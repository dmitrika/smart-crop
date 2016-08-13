import {Images} from '../cfs.js';
import {Binary} from '/imports/api/binary.js';

Meteor.methods({
	saveImage(link) {
		const newFile = new FS.File();

		newFile.attachData(link, error => {
			if (error) throw error;
			Images.insert(newFile, (error, fileObj) => {
				if (error) throw error;
			});
		});

		return new Promise((resolve, reject) => {
			Images.on('stored', fileObj => resolve(fileObj._id));
		});
	},
	saveData(data) {
		Binary.insert({data, createdAt: new Date()});
	}
});