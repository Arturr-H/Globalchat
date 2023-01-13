/* Imports */
use std::net::TcpListener;
use std::thread::spawn;

use tungstenite::accept;
use crate::incoming::handle_message;

mod incoming;
mod message;

/* Constants */
const ADDRESS: &'static str = "127.0.0.1";
const PORT: u16 = 8080;

fn main() {
    let addr = format!("{ADDRESS}:{PORT}");

    /* Initialize stream */
    let server = TcpListener::bind(&addr).unwrap();
    println!("{addr}");

    /* Incoming requests */
    for stream in server.incoming() {
        spawn (move || {
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

                // TODO: Implement logic
            };
        });
    };
}
