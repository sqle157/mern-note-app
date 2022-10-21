const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Please add a title'],
		},
		description: {
			type: String,
			required: [true, 'Please add a description'],
		},
		status: {
			type: String,
			required: true,
			enum: ['Action Required', 'Done'],
			default: 'Action Required',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Note', noteSchema);
