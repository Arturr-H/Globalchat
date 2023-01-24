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
    addSplats = () => {
        this.props.increaseShits();
        let amountOfSplats = Math.floor(Math.random() * 5) + 5;
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

        this.setState({ splats: [...this.state.splats, ...splats] });
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

    render() {
        return (
            <div className="message-splat" onClick={this.addSplats}>
                {this.state.splats.map((e, i) => {
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