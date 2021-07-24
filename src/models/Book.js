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
			min: 1,
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

bookSchema.virtual("coverImageUrl").get(function () {
	if (this.coverImageName) {
		return (
			"\\" + path.join("uploads", "img", "resized", this.coverImageName)
		);
	}
});

bookSchema.virtual("pdfFileUrl").get(function () {
	if (this.pdfFileName) {
		return "\\" + path.join("uploads", "pdf", this.pdfFileName);
	}
});

module.exports = mongoose.model("Book", bookSchema);
