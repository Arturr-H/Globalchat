import "./App.css";
import React from "react";
import Message from "./Message";
import Icon from "./Icon";
import Globals from "./Globals";

class Account extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
            createAccount: true,

            username: "",
            email: "",
            password: "",
            passwordConfirm: "",

        };

		/* Refs */
		this.input = React.createRef();

		/* Static */
		this.ws = null;
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

    setTabAccount = (state) => {
        this.setState({ createAccount: state });
    }
    setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; samesite=strict; path=/";
    }

    login = () => {
        fetch(Globals.accountManager + "login", {
            method: "GET",
            headers: {
                email: this.state.email,
                password: this.state.password
            }
        }).then(e => {
            if (e.status === 200) {
                e.json().then(e => {
                    this.setCookie("token", e.token, 30);
                    this.setCookie("suid", e.suid, 30);
                    window.location.reload();
                });
            } else {
                alert("Invalid email or password.");
            };
        })
    }

    createAccount = () => {
        if (this.state.password !== this.state.passwordConfirm) { return alert("Passwords do not match."); };
        fetch(Globals.accountManager + "create-account", {
            method: "GET",
            headers: {
                username: this.state.username,
                displayname: this.state.username,
                email: this.state.email,
                password: this.state.password
            }
        }).then(e => {
            if (e.status === 200) {
                Message.success("Account created successfully.");
                this.setTabAccount(false);
            } else {
                Message.error("Account creation failed.");
            };
        })
    }

	/* Render */
	render() {
		return (
			<main>
                <nav className="topbar">
                    <button onClick={() => this.setTabAccount(true)} className={this.state.createAccount === true ? "active" : ""}>Create Account</button>
                    <button onClick={() => this.setTabAccount(false)} className={this.state.createAccount !== true ? "active" : ""}>Sign in</button>
                </nav>

                {
                    this.state.createAccount === true
                    ?
                        <form className="account-details" onSubmit={e => { e.preventDefault(); this.createAccount(); }}>
                            <input value={this.state.username} onChange={e => this.setState({username: e.target.value})}  type="text" autoComplete="name" placeholder="Username..." />
                            <input value={this.state.email} onChange={e => this.setState({email: e.target.value})}  type="email" autoComplete="email" placeholder="Email..." />
                            <input value={this.state.password} onChange={e => this.setState({password: e.target.value})}  type="password" autoComplete="new-password" placeholder="Password..." />
                            <input value={this.state.passwordConfirm} onChange={e => this.setState({passwordConfirm: e.target.value})} type="password" autoComplete="new-password" placeholder="Confirm Password..." className="noborder" />

                            <input type="submit" value="Create Account" />
                        </form>
                    :
                        <form className="account-details" onSubmit={e => { e.preventDefault(); this.login(); }}>
                            <input value={this.state.email} onChange={e => this.setState({email: e.target.value})}  type="email" autoComplete="email" placeholder="Email..." />
                            <input value={this.state.password} onChange={e => this.setState({password: e.target.value})}  type="password" autoComplete="new-password" placeholder="Password..." className="noborder" />

                            <input type="submit" value="Log In" />
                        </form>
                }
			</main>
		);
	}
}

export default Account;

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFydHVyIiwidWlkIjoiZGFjZDQzMzEtOTZiNS00MGQzLWJjMjgtNTI0YTUwODhmMzgzIiwic3VpZCI6IjU5OTAyYjc3NzczMjRiZmI5MDlkZGE2ZDJmNmRmNzU2IiwiZXhwIjoxNjc2NzUzODg3fQ.uXK9t2Y4ZFZzY3fZYfsUi--M0KebQflqyP1YAb9sSlE
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFydHVyIiwidWlkIjoiZGFjZDQzMzEtOTZiNS00MGQzLWJjMjgtNTI0YTUwODhmMzgzIiwic3VpZCI6IjU5OTAyYjc3NzczMjRiZmI5MDlkZGE2ZDJmNmRmNzU2IiwiZXhwIjoxNjc2NzUzODg3fQ.uXK9t2Y4ZFZzY3fZYfsUi--M0KebQflqyP1YAb9sSlE
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFydHVyIiwidWlkIjoiZGFjZDQzMzEtOTZiNS00MGQzLWJjMjgtNTI0YTUwODhmMzgzIiwic3VpZCI6IjU5OTAyYjc3NzczMjRiZmI5MDlkZGE2ZDJmNmRmNzU2IiwiZXhwIjoxNjc2NzUzODg3fQ.uXK9t2Y4ZFZzY3fZYfsUi--M0KebQflqyP1YAb9sSlE

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFydHVyIiwidWlkIjoiMGE3MzVlNTUtNThkNC00NmQ5LTllMDktNDk1ODBhYTdhOWVkIiwic3VpZCI6IjJkMzFhN2ZmNjlkNjRkODU5Y2VlMDg5YWVmZTFmYmRiIiwiZXhwIjoxNjczMzA4MjMyfQ.Ee3LgP0-DtZAIWuroG1ftunvtegA2CJmwbRNpYkEl5U
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFydHVyIiwidWlkIjoiMGE3MzVlNTUtNThkNC00NmQ5LTllMDktNDk1ODBhYTdhOWVkIiwic3VpZCI6IjJkMzFhN2ZmNjlkNjRkODU5Y2VlMDg5YWVmZTFmYmRiIiwiZXhwIjoxNjczMzA4MjMyfQ.Ee3LgP0-DtZAIWuroG1ftunvtegA2CJmwbRNpYkEl5U