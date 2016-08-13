import {Images} from '../cfs.js';

Meteor.publish('images', () => Images.find());