import React from "react";

export default class MessageSplat extends React.PureComponent {
    constructor(props) {
        super(props);

        /* Changeable */
        this.state = {
            splats: [],
        };

        /* Static */
        this.index = 0;
    }

    componentDidMount() {
    }

    /* Add random splats to message */
    addSplats = () => this.props.increaseShits();

    render() {
        return (
            <div className="message-splat" onClick={this.addSplats}>
                {this.props.splats.map((e, i) => {
                    return (
                        <div
                            key={i}
                            className="splat"
                            style={{
                                left: e.x + "%",
                                top: e.y + "%",
                                width: e.size + "px",
                                height: e.size + "px",
                                // filter: "blur(" + Math.floor(Math.random() * 5) + "px) brightness(" + (Math.floor(Math.random() * 15) + 80) + "%)"
                            }}
                        ></div>
                    )
                })}
            </div>
        )
    };
}