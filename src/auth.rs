/* Imports */
use reqwest::blocking::Client;
use crate::ACCOUNT_MANAGER_URL;

/* Functions */
pub fn origin_control(stream: &mut Stream) -> bool {
    match stream.headers.get("token") {
        Some(token) => {
            match Client::new()
                .get(ACCOUNT_MANAGER_URL.to_owned() + "profile/verify-token")
                .header("token", *token)
                .send() {
                    Ok(req) => {
                        if req.status() == 200 { true }
                        else {
                            stream.respond_status(401);
                            false
                        }
                    }
                    Err(_) => {
                        stream.respond_status(503);
                        false
                    }
                }
        },

        /* Unauthorized */
        None => {
            stream.respond_status(401);
            false
        }
    }
}
