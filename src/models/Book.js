const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		coverImagePath: {
			type: String,
			required: true,
		},
		pageNo: {
			type: Number,
		},
		language: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Book", bookSchema);
