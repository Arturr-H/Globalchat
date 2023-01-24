#![allow(dead_code, unused_imports)]

/* Imports */
use dotenv::dotenv;
use lazy_static::lazy_static;
use serde::Deserialize;
use serde_json::json;
use std::{
    collections::HashMap,
    env::var,
    net::SocketAddr,
    sync::{Arc, Mutex, MutexGuard},
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

/* Structs */
#[derive(Deserialize)]
struct WsTypeRequest {
    _type: String
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

        match &data {
            Message::Text(text) => {
                match serde_json::from_str::<WsTypeRequest>(text.as_str()) {
                    Ok(req) => {
                        return handle_type(&req._type, &data, peers)
                    },
                    Err(_) => return future::ok(())
                }
            },
            _ => return future::ok(())
        };
    });


    /* Enable user to also recieve messages */
    let receive_from_others = rx.map(Ok).forward(outgoing);
    pin_mut!(broadcast_incoming, receive_from_others);

    /* Run recv / broadcast */
    future::select(broadcast_incoming, receive_from_others).await;

    /* Remove peer */
    peer_map.lock().unwrap().remove(&addr);
}
fn handle_type(
    _type: &str,
    data:&Message,
    peers:MutexGuard<
        HashMap<
            SocketAddr,
            UnboundedSender<
                Message
            >
        >
    >
) -> futures_util::future::Ready<Result<(), tokio_tungstenite::tungstenite::Error>> {
    match _type {
        "message" => {
            let message = match handle_message(data.clone()) {
                Ok(e) => e,
                Err(_) => return future::ok(())
            };
    
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
            };

            return future::ok(())
        },
        "shit" => {
            #[derive(Deserialize)]
            struct Request { message_id: String, suid: String }

            /* Get message data */
            let message_id:String = match data {
                Message::Text(text) => {
                    /* First string before ';' is the message id, second is user suid */    
                    let request:Request = match serde_json::from_str(text.as_str()) {
                        Ok(e) => e,
                        Err(_) => return future::ok(())
                    };

                    // TODO: Change storage to and update amount (and check that suid is valid)

                    request.message_id
                },
                _ => return future::ok(())
            };

            /* Write to all clients including ourselves */
            for recp in peers.iter().map(|(_, ws_sink)| ws_sink) {
                match recp.unbounded_send(
                    Message::Text(
                        json!({
                            "_type": "shit",
                            "message_id": message_id,
                        }).to_string()
                    )
                ) {
                    Ok(e) => e,
                    Err(_) => return future::ok(())
                }
            };

            return future::ok(())
        },
        _ => return future::ok(())
    }
}

