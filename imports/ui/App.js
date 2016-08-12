import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import smartcrop from './smartcrop'

import {Binary} from '../api/binary.js';

const App = React.createClass({
	propTypes: {
		binary: PropTypes.array.isRequired,
	},

	getInitialState: () => ({link: 'http://i.telegraph.co.uk/multimedia/archive/02301/bolt_2301239b.jpg'}),

	handleSubmit(event) {
		event.preventDefault();
		const link = this.refs.input.value.trim();

		this.setState({link})
		const binaries = Binary.insert({
			link,
			time: new Date(),
		});
		this.refs.input.value = '';
	},

	handleSmartCrop() {
		const ctx = this.refs.canvas.getContext('2d');

		smartcrop.crop(ctx, {width: 200, height: 400}).then(result => console.log(result));
	},

	renderExample() {
		const {link} = this.state;
		const ctx = this.refs.canvas.getContext('2d');
		const img = new Image();
		img.onload = function(){
			ctx.drawImage(img,0,0);
		};
		img.src = link;
	},

	render() {
		const {link} = this.state;

		return (
			<div className="container">
				<form className="new-task" onSubmit={this.handleSubmit} >
					<input type="text" ref="input" placeholder="Type to add new tasks" />
				</form>
				<div onClick={this.handleSmartCrop}>Smart crop me!</div>
				<div onClick={this.renderExample}>Resize me!</div>

				{link ?
					<img id="source" ref="source" src={link} alt="Original image" />
				: null}

				<canvas
					ref="canvas"
					width={400}
					height={200}
				/>

				{this.props.binary.map((item, index) =>
					<div key={index}>{item.link}</div>
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
