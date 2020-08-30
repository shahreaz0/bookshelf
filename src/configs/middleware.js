// models
const Book = require("../models/Book");
const Comment = require("../models/Comment");

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();

	req.flash("error", "You are not logged in");
	res.redirect("/login");
};

exports.ifLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return res.redirect("/books");
	next();
};

exports.isBookOwner = async (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "You are not logged in");
		return res.redirect("/login");
	}

	const book = await Book.findById(req.params.id);

	if (book.creator.equals(req.user._id)) return next();

	req.flash("error", "You can't edit other's post.");
	res.redirect(`/books/${req.params.id}`);
};

exports.isCommentOwner = async (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "You are not logged in");
		return res.redirect("/login");
	}

	const comment = await Comment.findById(req.params.comment_id);
	if (comment.author === req.user.username) return next();

	req.flash("error", "Permission denied");
	res.redirect("back");
};
