import "./App.css";
import React from "react";
import Message from "./Message";
import Icon from "./Icon";

class Main extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			messages: [{ content: "hej" }, { content: "hej" }],
			users: [],
			inputData: ""
		};

		/* Refs */
		this.input = React.createRef();

		/* Static */
		this.ws = null;
	}

	/* Functions */
	submitText = () => {
		if (this.ws === null) { return };
		let text = this.state.inputData;

		/* Clear text input */
		this.setState({ inputData: "" });

		/* Send text */
		if (text.length > 0) {
			this.ws.send(JSON.stringify({
				content: this.encodeItems(text),
				client: "aaaaawihdoahwodihaowihd"
			}));
		}
	}

	componentDidMount() {
		this.ws = new WebSocket("ws://localhost:8080/");

		if (this.ws !== null) {
			this.ws.onopen = () => {
				console.log('WebSocket connected');
			};
			this.ws.onmessage = this.handleMessage;
			this.ws.onclose = () => {
				console.log('WebSocket disconnected');
			};
		};
	}
	componentWillUnmount() {
		this.ws.close();
	}

	/* Websocket functions */
	handleMessage = (event) => {
		let json = JSON.parse(event.data);
		json["content"] = this.convertToRealContent(json["content"]);

		/* Push message */
		this.setState({ messages: [...this.state.messages, json] });
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

	/* Render */
	render() {
		return (
			<main>
				<section>
					{this.state.messages.map(message => <Message {...message} />)}
				</section>
				<div className="input">
					<form onSubmit={(e) => { e.preventDefault(); this.submitText(); }}>
						<button className="add-button">
							<Icon size={32} dark icon="paperclip" />
						</button>

						<input
							type="text"
							placeholder="Skriv nåt..."
							className="chat-input"
							ref={this.input}
							value={this.state.inputData}
							onChange={(e) => this.setState({ inputData: e.target.value })}
						/>
						<button onClick={this.submitText} className="send-button">
							<Icon size={32} dark icon="forward" />
						</button>
					</form>
				</div>
			</main>
		);
	}
}

export default Main;
