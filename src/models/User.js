const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		maxlength: 20,
	},
	password: {
		type: String,
		minlength: 4,
	},
	email: {
		type: String,
	},
	gender: {
		type: String,
		maxlength: 10,
	},
	age: {
		type: Number,
		minlength: 1,
	},
	googleId: {
		type: String,
	},
	thumbnail: {
		type: String,
		default: "https://tinyurl.com/y6qo86km",
	},
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
