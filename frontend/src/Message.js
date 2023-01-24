import "./App.css";
import React from "react";
import Globals from "./Globals";
import MessageSplat from "./MessageSplat";

class Message extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			client: {
				username: "",
			},
			totalShits: 0,
		};

		/* Refs */
		this.self = React.createRef();

		/* Static */
		this.suid = this.props.client;
		this.profilePicture = Globals.accountManager + "profile/image/" + this.props.client
	}

	componentDidMount() {
		this.getClientData();

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

	getSplats = () => {
        let amountOfSplats = Math.floor(Math.random() * 5 * this.state.totalShits) + this.state.totalShits*5;
        let splats = [];
        this.index += 1;

        if (this.index > 5) {
            this.index = 0;
            this.props.deleteMessage();
        }

        for (let i = 0; i < amountOfSplats; i++) {
            let coord = this.randomizeCoordinate(Math.max(20 - this.props.intensity*2, 1));
            splats.push({
                x: coord[0],
                y: coord[1],
                size: Math.floor(Math.random() * 30) + 20,
            });
        };

        return splats;
    }
	/*
        Generate a random number between 0 and 100 using exponential distribution.
        It's more likely to return a number close to 0 or 100, but it's still possible to get a number in the middle. 
    */
	randomizeCoordinate = (dist) => {
		if (Math.random() > 0.5) {
			let random = [];
			for (let i = 0; i < dist; i++) { random.push(Math.random()); };

			/* Grab the number furthest away from 0.5 */
			let furthestIndex = 0;
			random.forEach((e, i) => {
				if (Math.abs(e - 0.5) > Math.abs(random[furthestIndex] - 0.5)) {
					furthestIndex = i;
				};
			});

			/* Convert to percentage */
			return [Math.floor(Math.random() * 100), Math.floor(random[furthestIndex] * 100)];
		}
		else {
			let random = [];
			for (let i = 0; i < dist; i++) { random.push(Math.random()); };

			/* Grab the number furthest away from 0.5 */
			let furthestIndex = 0;
			random.forEach((e, i) => {
				if (Math.abs(e - 0.5) > Math.abs(random[furthestIndex] - 0.5)) {
					furthestIndex = i;
				};
			});

			/* Convert to percentage */
			return [Math.floor(random[furthestIndex] * 100), Math.floor(Math.random() * 100)];
		}
	}

	/* Get client data */
	getClientData = () => {
		fetch(Globals.accountManager + "profile/data/by_suid/" + this.suid).then(e => {
			if (e.status === 200) {
				e.json().then(data => {
					this.setState({ client: data });
				});
			};
		});
	}
	increaseShits = () => {
		console.log("increaseShits");
		this.props.increaseShits(this.props.id, (shits) => {
			this.setState({ totalShits: shits });
		});
	}

	/* Render */
	render() {
		return (
            <div ref={this.self} className="message" id={this.props.id}>
                <div className="user-profile">
                    <img src={this.profilePicture} alt="profile" />
                </div>
                <div className="main">
                    <p className="data">@{this.state.client.username} - {new Date(this.props.date).toDateString()}</p>
                    <p className="content">{this.props.content}</p>
                </div>

				<MessageSplat
					deleteMessage={this.props.deleteMessage}
					increaseShits={this.increaseShits}
					intensity={this.props.shits}
					splats={this.getSplats()}
				/>
            </div>
		);
	}
}

export default Message;
