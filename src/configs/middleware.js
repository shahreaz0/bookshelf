// models
const Book = require("../models/Book");
const Comment = require("../models/Comment");

exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) return res.redirect("/login");
	next();
};

exports.ifLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return res.redirect("/books");
	next();
};

exports.isBookOwner = async (req, res, next) => {
	if (!req.isAuthenticated()) return res.redirect("/login");

	const book = await Book.findById(req.params.id);

	if (book.creator.equals(req.user._id)) return next();

	res.redirect("back");
};

exports.isCommentOwner = async (req, res, next) => {
	if (!req.isAuthenticated()) res.redirect("/login");

	const comment = await Comment.findById(req.params.comment_id);
	if (comment.author === req.user.username) return next();

	res.redirect("back");
};
