import "./App.css";
import React from "react";
import Message from "./Message";
import Icon from "./Icon";

class App extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			messages: [{ content: "hej" }],
			users: [],
			inputData: ""
		};

		/* Refs */
		this.input = React.createRef();
	}

	/* Render */
	render() {
		return (
			<main>
				<section>
					{this.state.messages.map(message => <Message {...message} />)}
				</section>
				<div className="input">
					<button className="add-button">
						<Icon size={32} dark icon="paperclip" />
					</button>
					<input
						type="text"
						placeholder="Skriv nåt..."
						className="chat-input"
						ref={this.input}
					/>
					<button className="send-button">
						<Icon size={32} dark icon="forward" />
					</button>
				</div>
			</main>
		);
	}
}

export default App;
