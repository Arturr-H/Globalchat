/* Global allowings */
#![allow(dead_code)]

/* Request is the user request (in JSON) which contains important data */
pub struct Request {
    /// JWT
    client: String,

    /// Content as bytes
    content: Vec<u8>,

    /// Date sent
    date: usize,
}

/* ClientMessage is the usermessage, with additional information like id which is created server-side */
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
            date: self.date,
            client: self.client,
            content: self.content,
            id: ClientMessage::gen_id()
        }
    }
}

/* Client message methods */
impl ClientMessage {
    pub fn gen_id() -> String {
        //! TODO: Make this actually generate an ID
        String::new()
    }
}
