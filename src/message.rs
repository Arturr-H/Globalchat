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

/* Getters */
impl Request {
    pub fn client(&self) -> &String {
        &self.client
    }
}

/* ClientMessage is the usermessage, with additional information like id which is created server-side */
#[derive(Serialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct ClientMessage {
    /// JWT
    pub client: String,

    /// Content as bytes
    pub content: Vec<u8>,

    /// Date sent
    pub date: usize,

    /// Message ID (generated server-side)
    pub id: String
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
    pub fn to_stripped_json(&self) -> Option<String> {
        serde_json::to_string(
            self
        ).ok()
    }

    /* Getters */
    pub fn client(&self) -> &String { &self.client }
    pub fn content(&self) -> &Vec<u8> { &self.content }
    pub fn date(&self) -> usize { self.date }
    pub fn id(&self) -> &String { &self.id }
}
