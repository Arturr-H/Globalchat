use tokio_tungstenite::tungstenite::{ connect, Message };
use serde_json::json;

#[test]
fn send_and_recieve() {
    let (mut socket, _) = connect("ws://localhost:8080/").expect("Can't connect");

    let send = json!({
        "client": "some-client-id",
        "content": &[12, 2, 3, 4],
        "date": 1231224124
    });

    socket.write_message(Message::Text(send.to_string())).unwrap();
    loop {
        println!("writnt");
        let msg = socket.read_message().expect("Error reading message");
        println!("Received: {}", msg);
    }
    // socket.close(None);
}