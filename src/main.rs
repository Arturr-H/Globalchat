#![allow(dead_code, unused_imports)]

/* Imports */
use dotenv::dotenv;
use lazy_static::lazy_static;
use std::{
    collections::HashMap,
    env::var,
    net::SocketAddr,
    sync::{Arc, Mutex},
};

use futures_channel::mpsc::{ unbounded, UnboundedSender };
use futures_util::{future, pin_mut, stream::TryStreamExt, StreamExt};

use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::tungstenite::{ protocol::Message };

use crate::incoming::handle_message;
mod incoming;
mod message;

/* Constants */
const ADDRESS: &'static str = "127.0.0.1";
const PORT: u16 = 8080;
lazy_static! {
    pub static ref ACCOUNT_MANAGER_URL:String = var("ACCOUNT_MANAGER_URL").unwrap();
}

/* Types */
type Tx = UnboundedSender<Message>;
type PeerMap = Arc<Mutex<HashMap<SocketAddr, Tx>>>;

#[tokio::main]
async fn main() {
    dotenv().unwrap();

    /* Load lazy initialized env varaibles to prewarn about missing vars */
    let _ = &**ACCOUNT_MANAGER_URL;
    
    /* Initialize stream */
    let addr = format!("{ADDRESS}:{PORT}");
    let server = TcpListener::bind(&addr).await.unwrap();
    println!("{addr}");

    /* Create peer map */
    let peers:PeerMap = Arc::new(Mutex::new(HashMap::new()));

    /* Incoming requests */
    while let Ok((stream, addr)) = server.accept().await {
        tokio::spawn(handle_connection(peers.clone(), stream, addr));
    }
}

async fn handle_connection(peer_map: PeerMap, raw_stream: TcpStream, addr: SocketAddr) {
    let ws_stream = match tokio_tungstenite::accept_async(raw_stream).await {
        Ok(e) => e,
        Err(_) => return
    };

    /* Insert to peers */
    let (tx, rx) = unbounded();
    match peer_map.lock() { Ok(e) => e, Err(_) => return }.insert(addr, tx);
    let (outgoing, incoming) = ws_stream.split();

    /* Message loop */
    let broadcast_incoming = incoming.try_for_each(|data| {
        let peers = match peer_map.lock() {
            Ok(e) => e,
            Err(_) => return future::ok(())
        };
        dbg!(&data);
        let message = match handle_message(data) {
            Ok(e) => e,
            Err(_) => return future::ok(())
        };
        dbg!(&message);
        /* Write to all clients including ourselves */
        for recp in peers.iter().map(|(_, ws_sink)| ws_sink) {
            match recp.unbounded_send(
                Message::Text(
                    match message
                        .clone()
                        .to_stripped_json() {
                            Some(e) => e,
                            None => return future::ok(())
                        }
                )
            ) {
                Ok(e) => e,
                Err(_) => return future::ok(())
            }
        }

        future::ok(())
    });


    /* Enable user to also recieve messages */
    let receive_from_others = rx.map(Ok).forward(outgoing);
    pin_mut!(broadcast_incoming, receive_from_others);

    /* Run recv / broadcast */
    future::select(broadcast_incoming, receive_from_others).await;

    /* Remove peer */
    peer_map.lock().unwrap().remove(&addr);
}
