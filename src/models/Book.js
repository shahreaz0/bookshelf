const mongoose = require("mongoose");
const path = require("path");

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
	coverImageName: {
		type: String,
		required: true,
	},
	pdfFileName: {
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

bookSchema.virtual("coverImageUrl").get(function () {
	if (this.coverImageName) {
		return "\\" + path.join("uploads", "img", "resized", this.coverImageName);
	}
});

bookSchema.virtual("pdfFileUrl").get(function () {
	if (this.pdfFileName) {
		return "\\" + path.join("uploads", "pdf", this.pdfFileName);
	}
});

module.exports = mongoose.model("Book", bookSchema);
