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
            <div className="message">
                <div className="user-profile" alt="profile picture">
                    <img alt="profile picture" />
                </div>
                <div className="main">
                    <p className="data">@username - 20:12:21</p>
                    <p className="content">{this.props.content}</p>
                </div>
            </div>
		);
	}
}

export default Message;
