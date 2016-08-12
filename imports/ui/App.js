import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import {Binary} from '../api/binary.js';

const App = React.createClass({
	propTypes: {
		binary: PropTypes.array.isRequired,
	},

	getInitialState: () => ({link: 'http://i.telegraph.co.uk/multimedia/archive/02301/bolt_2301239b.jpg'}),

	handleSubmit(event) {
		event.preventDefault();
		const link = this.refs.input.value.trim();
		
		const fileObj = new FS.File();
		fileObj.attachData(link, function () {
			console.log(arguments);
			Images.insert(fileObj, function (err, fileObj) {
				console.log(arguments);
			});
		});
		this.refs.input.value = '';
	},

	handleSmartCrop() {
		const {link} = this.state;

		const cropSource = Images.find({}).fetch();
		console.log(cropSource);

		const binaries = Binary.find({}).fetch();
		console.log(binaries);
	},

	renderExample() {
		const {link} = this.state;
		var ctx = this.refs.canvas.getContext('2d');
		var img = new Image();
		img.onload = function(){
			ctx.drawImage(img,0,0);
			ctx.stroke();
		};
		img.src = link;
	},

	render() {
		const {link} = this.state;

		return (
			<div className="container">
				<form className="new-task" onSubmit={this.handleSubmit} >
					<input
						type="text"
						ref="input"
						placeholder="Type to add new tasks"
					/>
				</form>
				<buntton onClick={this.handleSmartCrop}>Click!</buntton>
				<buntton onClick={this.renderExample}>Click2!</buntton>

				{link ?
					<img
						id="source"
						ref="source"
						src={link}
						alt="Original image"
					/>
				: null}

				<canvas
					ref="canvas"
					width={400}
					height={200}
				/>

				{this.props.binary.map((item, index) =>
					<div key={index}>{item.binary}</div>
				)}

			</div>
		);
	}
});


export default createContainer(() => {
	return {
		binary: Binary.find({}).fetch(),
	};
}, App);
