const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
	{
		content: {
			type: String,
			maxlength: 100,
			trim: true,
		},
		author: {
			type: String,
		},
		thumbnail: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Comment", commentSchema);
