import "./App.css";
import React from "react";

class Message extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
		};

		/* Refs */
	}

	/* Render */
	render() {
		return (
            <div className="message"></div>
		);
	}
}

export default Message;
