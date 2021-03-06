const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			maxlength: 20,
			unique: true,
		},
		password: {
			type: String,
			minlength: 6,
		},
		fullName: {
			type: String,
			maxlength: 30,
		},
		email: {
			type: String,
		},
		gender: {
			type: String,
		},
		age: {
			type: Number,
			min: 1,
		},
		googleId: {
			type: String,
		},
		thumbnail: {
			type: String,
			default: "https://image.flaticon.com/icons/svg/758/758669.svg",
		},
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Book",
			},
		],
	},
	{
		timestamps: true,
	},
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
