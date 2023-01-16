/* Imports */
use dotenv::dotenv;
use lazy_static::lazy_static;
use std::{
    net::TcpListener,
    thread::spawn,
    env::var
};

use tokio_tungstenite::{ tungstenite::{ accept, Message } };
use crate::incoming::handle_message;

mod incoming;
mod message;

/* Constants */
const ADDRESS: &'static str = "127.0.0.1";
const PORT: u16 = 8080;
lazy_static! {
    pub static ref ACCOUNT_MANAGER_URL:String = var("ACCOUNT_MANAGER_URL").unwrap();
}

fn main() {
    dotenv().unwrap();

    /* Load lazy initialized env varaibles to prewarn about missing vars */
    let _ = &**ACCOUNT_MANAGER_URL;
    
    /* Initialize stream */
    let addr = format!("{ADDRESS}:{PORT}");
    let server = TcpListener::bind(&addr).unwrap();
    println!("{addr}");

    /* Incoming requests */
    for stream in server.incoming() {
        spawn(move || {
            let mut websocket = match accept(match stream {
                Ok(e) => e,
                Err(_) => return
            }) {
                Ok(e) => e,
                Err(_) => return
            };

            /* Message loop */
            loop {
                let msg = match handle_message(match websocket.read_message() {
                    Ok(e) => e,
                    Err(_) => continue
                }) {
                    Ok(e) => e,
                    Err(_) => continue
                };

                /* Write to client */
                websocket.write_message(
                    Message::Text(
                        msg.to_stripped_json().unwrap()
                    )
                ).unwrap();
            };
        });
    };
}
