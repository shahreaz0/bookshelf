const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
	{
		content: {
			type: String,
			maxlength: 100,
			trim: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Comment", commentSchema);
