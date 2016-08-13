import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import smartcrop from './smartcrop'
import Loading from 'react-loading';

import {Binary} from '../api/binary.js';
import {Images} from '../api/cfs/cfs.js';

export default App = React.createClass({
	getInitialState: () => ({
		link: '',
		showSaveButton: false,
		showLoader: false,
		dataSaved: false,
	}),

	componentDidMount() {
		Meteor.subscribe('images', (error, result) => {
			if (error) throw error;
		});
		Meteor.subscribe('binary', (error, result) => {
			if (error) throw error;
		});
	},

	handleSubmit(event) {
		event.preventDefault();
		const sourceUrl = this.refs.input.value.trim();
		if (!sourceUrl) return;

		this.clearCanvas();
		this.refs.input.value = '';
		this.setState({link: sourceUrl, showLoader: true, dataSaved: false});
		this.saveImage(sourceUrl);
	},

	saveImage(sourceUrl) {
		new Promise((resolve, reject) => {
			Meteor.call('saveImage', sourceUrl, (error, _id) => {
				if (error) throw error;
				resolve(_id);
			});
		}).then((_id) => {
			const link   = Images.findOne({_id}).url();
			const image  = new Image();
			image.onload = () => this.handleSmartCrop(image);
			image.src    = link;
		});
	},

	handleSmartCrop(image) {
		const options = {debug: true, width: 400, height: 200};

		smartcrop.crop(image, options).then(result => {
			const crop    = result.topCrop;
			const canvas  = this.refs.canvas;
			const ctx     = canvas.getContext('2d');
			canvas.width  = options.width;
			canvas.height = options.height;
			ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);

			this.setState({showSaveButton: true, showLoader: false})
		});
	},

	handleSave() {
		const canvas  = this.refs.canvas;
		const dataURL = canvas.toDataURL('image/png');
		const data    = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
		Meteor.call('saveData', data);
		this.setState({dataSaved: true});
	},

	clearCanvas() {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	},

	render() {
		const {link, showSaveButton, showLoader, dataSaved} = this.state;

		return (
			<div className="container">
				<div className="header">
					<form onSubmit={this.handleSubmit} >
						<input type="text" ref="input" placeholder="Insert image url" />
					</form>

					<button type="button" onClick={this.handleSubmit}>Get image!</button>

					{showSaveButton ?
						<button type="button" onClick={this.handleSave}>Save as base64!</button>
					: null}

					{dataSaved ? <span>Done!</span> : null}
				</div>
				<div className="images">
					<div className="images__source">
						{link ?
							<img src={link} alt="Original image"/>
						: null}
					</div>
					<div className="images__cropped">
						{showLoader ?
							<div className="loader">
								<Loading type='cylon' color='#2a5885' />
							</div>
						: null}
						<canvas ref="canvas" />
					</div>
				</div>
			</div>
		);
	}
});
