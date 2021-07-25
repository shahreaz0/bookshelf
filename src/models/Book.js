const mongoose = require("mongoose");
const path = require("path");

const bookSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},
		author: {
			type: String,
			required: true,
			trim: true,
			maxlength: 30,
		},
		description: {
			type: String,
			trim: true,
		},
		coverImg: {
			url: {
				type: String,
			},
			cloudinary_id: {
				type: String,
			},
		},
		pdfBook: {
			url: {
				type: String,
			},
			cloudinary_id: {
				type: String,
			},
		},
		pageNo: {
			type: Number,
		},
		language: {
			type: String,
		},
		status: {
			type: String,
			default: "public",
			enum: ["public", "private"],
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		likes: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Book", bookSchema);
