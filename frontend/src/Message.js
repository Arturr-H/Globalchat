import "./App.css";
import React from "react";

class Message extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
		};

		/* Refs */
		this.self = React.createRef();
	}

	componentDidMount() {
		if (this.self) {
			this.self.current.animate([
				{ transform: "translateX(100px)", opacity: 0 },
				{ transform: "translateX(0px)", opacity: 1 }
			], {
				duration: 200,
				easing: "ease-in-out"
			});
		};
	}

	/* Render */
	render() {
		return (
            <div ref={this.self} className="message">
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
