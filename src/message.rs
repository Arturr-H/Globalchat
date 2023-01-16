/* Global allowings */
#![allow(dead_code)]

/* Imports */
use std::time::SystemTime;
use serde::{ Deserialize, Serialize };
use uuid::Uuid;

/* Request is the user request (in JSON) which contains important data */
#[derive(Deserialize)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct Request {
    /// JWT
    client: String,

    /// Content as bytes
    content: Vec<u8>,
}

/* Response */
#[derive(Serialize)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct Response {
    /// User suid
    suid: String,

    /// Content as bytes
    content: Vec<u8>,

    /// Date sent
    date: usize,

    /// Message ID (generated server-side)
    id: String
}

/* ClientMessage is the usermessage, with additional information like id which is created server-side */
#[derive(Serialize)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct ClientMessage {
    /// JWT
    client: String,

    /// Content as bytes
    content: Vec<u8>,

    /// Date sent
    date: usize,

    /// Message ID (generated server-side)
    id: String
}

/* Method implementations */
impl Into<ClientMessage> for Request {
    fn into(self) -> ClientMessage {
        ClientMessage {
            date: 1,
            client: self.client,
            content: self.content,
            id: ClientMessage::gen_id()
        }
    }
}

/* Client message methods */
impl ClientMessage {
    /* Create message ID */
    pub fn gen_id() -> String {
        Uuid::new_v4().hyphenated().to_string()
    }

    /* Convert to JSON */
    pub fn to_stripped_json(self) -> Option<String> {
        serde_json::to_string(
            //TODO: FIX SUID
            &Response::from_client_message(
                self,
                String::new()
            )
        ).ok()
    }

    /* Getters */
    pub fn client(&self) -> &String { &self.client }
    pub fn content(&self) -> &Vec<u8> { &self.content }
    pub fn date(&self) -> usize { self.date }
    pub fn id(&self) -> &String { &self.id }
}

/* Implementations for Response */
impl Response {
    pub fn from_client_message(message:ClientMessage, suid:String) -> Self {
        Self {
            suid,
            content: message.content,
            date: message.date,
            id: message.id
        }
    }
}

fn get_sys_time_in_secs() -> u128 {
    SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_millis()
}
