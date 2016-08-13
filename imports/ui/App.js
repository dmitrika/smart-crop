import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import smartcrop from './smartcrop'

import {Binary} from '../api/binary.js';
import {Images} from '../api/cfs/cfs.js';

const App = React.createClass({
	propTypes: {
		binary: PropTypes.array.isRequired,
	},

	getInitialState: () => ({
		link: '',
		currentID: '',
	}),

	componentDidMount() {
		window.Images = Images;
		Meteor.subscribe('images', (error, result) => {
			if (error) throw error;
		});
	},

	handleSubmit(event) {
		event.preventDefault();
		const sourceUrl = this.refs.input.value.trim();

		new Promise((resolve, reject) => {
			Meteor.call('saveImage', sourceUrl, (error, id) => {
				if (error) throw error;
				resolve(id);
			});
		}).then((id) => {
			const link = Images.findOne({_id: id}).url();
			this.setState({link, currentID: id});
		})

		this.refs.input.value = '';
	},

	handleSmartCrop() {
		const img = this.refs.source;
		const options = {debug: true, width: 400, height: 200};

		smartcrop.crop(img, options).then(result => {
			const crop    = result.topCrop;
			const canvas   = this.refs.canvas;
			const ctx     = canvas.getContext('2d');
			canvas.width  = options.width;
			canvas.height = options.height;
			ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
		});
	},

	render() {
		const {link} = this.state;

		return (
			<div className="container">
				<form className="new-task" onSubmit={this.handleSubmit} >
					<input type="text" ref="input" placeholder="Type to add new tasks" />
				</form>

				{link ?
					<div onClick={this.handleSmartCrop}>Smart crop me!</div>
				: null}

				{link ?
					<img id="source" ref="source" src={link} alt="Original image" />
				: null}

				<canvas ref="canvas" />

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
