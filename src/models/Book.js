const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	author: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		trim: true,
	},
	coverImagePath: {
		type: String,
		required: true,
	},
	pdfPath: {
		type: String,
		required: true,
	},
	pageNo: {
		type: Number,
	},
	language: {
		type: String,
	},
	publishDate: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model("Book", bookSchema);
