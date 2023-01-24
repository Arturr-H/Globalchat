import React from "react";

class Attachments extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			activeWindow: "gifs"
		};

		/* Static */
	}
	componentDidMount() {
	}

	/* Functions */
	setActiveWindow = (window) => {
		this.setState({ activeWindow: window });
	}

	render() {
		return (
			<>
				{this.props.active ? <div className="attachments">
					<div className="tab-bar">
						<button onClick={() => this.setActiveWindow("gifs")}>Gifs</button>
						<button onClick={() => this.setActiveWindow("other")}>Other</button>
					</div>

					{
						this.state.activeWindow === "gifs" ?
							<Gifs />
							:
							null
					}
				</div> : null}
			</>
		)
	};
}

/* Windows */

/* Grabs gifs from tenor.com api */
class Gifs extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			gifs: [],
			search: ""
		};

		/* Static */
		this.tenorKey = "LIVDSRZULELA";
		this.tenorLimit = 20;
	}

	componentDidMount() {
		this.getGifs();
	}

	/* Functions */
	getGifs = () => {
		let url = "https://api.tenor.com/v1/search?q=" + this.state.search + "&key=" + this.tenorKey + "&limit=" + this.tenorLimit;
		fetch(url)
			.then(response => response.json())
			.then(data => {
				this.setState({ gifs: data.results });
			});
	}
	setSearch = (event) => {
		this.setState({ search: event.target.value });
	}
	submitSearch = () => {
		this.getGifs();
		console.log("SSET GIF");
	}
	handleData = (data) => {
		if (!this.props.sendData) return {}
		console.log(data);
		this.props.sendData(data);
	}

	render() {
		return (
			<div className="gifs">
				<form onSubmit={(e) => { e.preventDefault(); this.submitSearch(); }}>
					<input className="search" type="text" placeholder="Search" value={this.state.search} onChange={this.setSearch} />
					<input type="submit" value="Search" style={{ display: "none" }}  />
				</form>
				<div className="gif-container">
					{
						this.state.gifs.map((gif, index) => {
							return (
								<img onClick={() => this.handleData(gif.media[0].gif.url)} className="gif-item" key={index} src={gif.media[0].gif.url} alt={gif.title} />
							)
						})
					}
				</div>
			</div>
		)
	};
}

export default Attachments;
