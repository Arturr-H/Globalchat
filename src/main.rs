/* Imports */
use std::net::TcpListener;
use std::thread::spawn;

use tungstenite::accept;

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
            let mut websocket = accept(stream.unwrap()).unwrap();
            loop {
                let msg = websocket.read_message().unwrap();

                if msg.is_binary() || msg.is_text() {
                    websocket.write_message(msg).unwrap();
                };
            };
        });
    };
}
