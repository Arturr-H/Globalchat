/* Imports */
use tokio_tungstenite::tungstenite::Message;
use serde_json;
use crate::{ message::{ ClientMessage, Request }, ACCOUNT_MANAGER_URL };
use reqwest::blocking::Client;
use std::{ collections::HashMap, time::{ SystemTime, UNIX_EPOCH } };

/* Handle message request */
#[allow(dead_code)]
pub fn handle_message(message:Message) -> Result<ClientMessage, ()> {
    match message {
        Message::Text(json) => {
            match serde_json::from_str::<Request>(&json) {
                Ok(success) => {

                    /* Get suid */
                    let suid = get_suid(success.client())?;

                    /* Convert to client message and provide extra data */
                    let client_message:ClientMessage = ClientMessage { 
                        date: unix_time(),
                        client: suid,
                        ..success.into()
                    };

                    Ok(client_message)
                },
                Err(..) => Err(())
            }
        },
        _ => Err(())
    }
}
fn get_suid(jwt:&String) -> Result<String, ()> {
    tokio::task::block_in_place(|| {
        let client = reqwest::blocking::Client::new();
        let json = client
            .get(ACCOUNT_MANAGER_URL.to_string() + "profile/verify-token")
            .header("token_key", jwt)
            .send()
            .unwrap()
            .json::<HashMap<String, String>>();
        
        Ok(
            match match json {
                Ok(e) => e,
                Err(_) => return Err(())
            }.get("suid") {
                Some(e) => e,
                None => return Err(())
            }.to_owned()
        )
    })
        
}

/* Utils */
fn unix_time() -> usize {
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as usize
}