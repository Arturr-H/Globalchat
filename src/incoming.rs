/* Imports */
use tokio_tungstenite::tungstenite::Message;
use serde_json;
use crate::message::{ ClientMessage, Request };

/* Handle message request */
#[allow(dead_code)]
pub fn handle_message(message:Message) -> Result<ClientMessage, ()> {
    match message {
        Message::Text(json) => {
            match serde_json::from_str::<Request>(&json) {
                Ok(success) => Ok(success.into()),
                Err(..) => Err(())
            }
        },
        _ => Err(())
    }
}
