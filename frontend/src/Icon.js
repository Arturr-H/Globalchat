import React from "react";

class Icon extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};

		/* Static */
		this.icons = {
			dark: {
				"paperclip": require("./assets/icons/dark/paperclip.svg").default,
				"forward": require("./assets/icons/dark/forward.svg").default,
			},
			light: {
			}
		};
	}

	render() {
		return (
			<img {...this.props} style={this.props.size && { width:this.props.size, height:this.props.size }} alt={"icon " + this.props.icon} src={
				this.props.mode === "dark" 
				? this.icons.dark[this.props.icon]
				: this.props.mode === "light"
				? this.icons.light[this.props.icon]
				: null
			} />
		)
	}
}

export default Icon;
