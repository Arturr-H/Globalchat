import "./App.css";
import React from "react";
import Message from "./Message";
import Icon from "./Icon";
import Attachments from "./Attachments";

class Main extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			messages: [],
			users: [],
			inputData: "",

			attachmentActive: false,
		};

		/* Refs */
		this.input = React.createRef();

		/* Static */
		this.ws = null;
	}

	/* Functions */
	submitText = (custom = null) => {
		if (this.ws === null) { return };
		let text;
		if (custom !== null) {
			text = custom;
		}else {
			text = this.state.inputData;
		};

		/* Clear text input */
		this.setState({ inputData: "" });

		/* Send text */
		if (text.length > 0) {
			this.ws.send(JSON.stringify({
				_type: "message",
				content: this.encodeItems(text),
				client: this.getCookie("token")
			}));
		};
	}
	getCookie = (cname) => {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}


	componentDidMount() {
		this.ws = new WebSocket("ws://localhost:8080/");

		if (this.ws !== null) {
			this.ws.onopen = () => {
				console.log('WebSocket connected');
			};
			this.ws.onmessage = this.handleWebsocketEvent;
			this.ws.onclose = () => {
				console.log('WebSocket disconnected');
			};
		};
	}
	componentWillUnmount() {
		this.ws.close();
	}
	handleWebsocketEvent = (evt) => {
		let json = JSON.parse(evt.data);

		/* Handle message */
		switch (json._type) {
			case "message":
				this.handleMessage(json);
				break;
			case "shit":
				this.handleShit(json);
				break;
			default:
				console.log("Unknown event", json);
				break;
		};
	}

	/* Websocket functions */
	handleMessage = (json) => {
		json["content"] = this.convertToRealContent(json["content"]);

		/* Push message */
		this.setState({ messages: [...this.state.messages, json] });
	}
	handleShit = (json) => {
		let message_id = json.message_id;

		/* Find message index */
		let message_idx = this.state.messages.findIndex((message) => message.id === message_id);

		/* Increase shits */
		let messages = this.state.messages;
		messages[message_idx].shits += 1;
		this.setState({ messages: messages });
	}

	/*- Convert bytes into real text strings -*/
	convertToRealContent = (content) => {
		const decoder = new TextDecoder();
		return decoder.decode(new Uint8Array(content));
	};
	encodeItems = (content) => {
		let utf8Encode = new TextEncoder();
		return Array.from(utf8Encode.encode(content));
	}

	toggleAttachments = () => {
		this.setState({ attachmentActive: !this.state.attachmentActive });
	}

	/* Delete message */
	deleteMessage = (id) => {
		console.log("delte", id);
	}
	increaseShits = (id) => {
		console.log("shat on", id);
		this.ws.send(JSON.stringify({
			_type: "shit",
			message_id: id,
			suid: this.getCookie("suid")
		}));
	}

	/* Render */
	render() {
		return (
			<main>
				<img className="watermark" src={require("./assets/logos/ShitShatText.svg").default} />
				<section>
					{
						this.state.messages.map((message, idx) => 
							<Message
								key={idx}
								deleteMessage={() => this.deleteMessage(message.id)}
								increaseShits={this.increaseShits}
								{...message}
							/>
						)
					}
				</section>
				<Attachments sendData={(e) => this.submitText(e)} active={this.state.attachmentActive} />
				<div className="input">
					<button className={"add-button" + (this.state.attachmentActive ? " active" : "")} onClick={this.toggleAttachments}>
						<Icon size={32} mode="dark" icon="paperclip" />
					</button>
					<form onSubmit={(e) => { e.preventDefault(); this.submitText(); }}>
						<input
							type="text"
							placeholder="Skriv nåt..."
							className="chat-input"
							ref={this.input}
							value={this.state.inputData}
							onChange={(e) => this.setState({ inputData: e.target.value })}
						/>
						<button onClick={(e) => this.submitText(this.state.inputData)} className="send-button">
							<Icon size={32} mode="dark" icon="forward" />
						</button>
					</form>
				</div>
			</main>
		);
	}
}

export default Main;
