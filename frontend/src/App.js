import "./App.css";
import React from "react";
import Message from "./Message";

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
				<input
					type="text"
					placeholder="Skriv nåt..."
					className="chat-input"
					ref={this.input}
				/>
			</main>
		);
	}
}

export default App;
