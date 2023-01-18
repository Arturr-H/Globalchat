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
                    <p className="content">Ad adipisicing est cillum aliquip excepteur occaecat ex. Excepteur incididunt nulla et magna. Dolor amet nisi magna laboris laborum labore id tempor ullamco enim occaecat et est dolore. Nostrud aliquip eiusmod elit nulla ex esse. Cillum minim laboris aliquip consequat eiusmod officia reprehenderit elit. Anim eu do in adipisicing et incididunt amet enim ut dolore et.Velit incididunt aliquip consequat tempor tempor pariatur consequat consequat amet anim adipisicing consequat pariatur. Quis fugiat velit nisi minim consequat fugiat elit id. Esse fugiat ut laborum pariatur velit voluptate deserunt aute sint ad. Eiusmod nisi amet culpa amet ad enim velit velit laboris aute commodo. Adipisicing voluptate exercitation culpa cillum velit est nisi cupidatat excepteur tempor incididunt irure.Aliqua anim minim adipisicing in eu aliqua dolor nisi qui. Est velit ea elit cupidatat minim laboris culpa officia fugiat. Veniam consequat sit veniam consequat aute labore deserunt. Fugiat est aute laborum sint labore pariatur ea incididunt in nisi aliqua ut. Amet anim laborum dolor aliqua elit incididunt. Pariatur adipisicing fugiat amet ullamco adipisicing enim ad consequat ullamco. Ut nulla est ex ex est do exercitation ipsum in exercitation qui nulla irure irure.</p>
                </div>
            </div>
		);
	}
}

export default Message;
