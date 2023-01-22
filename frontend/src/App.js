import React from "react";
import Main from "./Main";
import Account from "./Account";
import Globals from "./Globals";

class App extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			loading: true
		};

		/* Static */
		this.accountManager = Globals.accountManager;
		this.account = false;
	}
	componentDidMount() {
		let token = this.getCookie("token");
		let suid = this.getCookie("token");
		if (token === null || suid === null) { this.setState({ loading: false }); return this.account = false };

		console.log("TOKEN = ", token);
		fetch(this.accountManager + "profile/verify-token", {
			method: "GET",
			headers: { token_key: token },
		}).then(e => {
			this.setState({ loading: false });
			if (e.status === 200) {
				this.account = true;
				this.forceUpdate();
			};
		});
	}

	/* Cookies */	
	getCookie = (name) => {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			let cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				let cookie = cookies[i].trim();
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

	render() {
		return (
			<>
				{this.state.loading === false ? (this.account ? <Main /> : <Account />) : null}
			</>
		)
	};
}

export default App;
