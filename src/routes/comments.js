const router = require("express").Router();

// models
const Book = require("../models/Book");
const Comment = require("../models/Comment");

// middleware
const { isLoggedIn, isCommentOwner } = require("../configs/middleware");

// GET /books/:id --> shows all comments
//      --> in show books route, all comments will be shown associated with that book

// GET /books/:id --> shows form
//      --> in show books route, add comment form exists

// POST /books/:id/comments --> add comment
router.post("/books/:id/comments", isLoggedIn, async (req, res) => {
	try {
		if (req.body.content) {
			const book = await Book.findById(req.params.id);
			const comment = new Comment({
				content: req.body.content,
				author: req.user.username,
				thumbnail: req.user.thumbnail,
			});

			await comment.save();
			book.comments.push(comment._id);
			await book.save();
		}
		res.redirect(`/books/${req.params.id}`);
	} catch (error) {
		res.redirect(`/books/${req.params.id}`);
		console.log(error);
	}
});

// GET /books/:id/comments/:id/edit --> show edit form
router.get(
	"/books/:book_id/comments/:comment_id/edit",
	isCommentOwner,
	async (req, res) => {
		try {
			const comment = await Comment.findById(req.params.comment_id);
			res.render("comments/edit", {
				pageTitle: "Edit comment",
				bookId: req.params.book_id,
				comment,
			});
		} catch (error) {
			console.log(error);
		}
	}
);

// PUT /books/:id/comments/:id --> edit comment
router.put(
	"/books/:book_id/comments/:comment_id",
	isCommentOwner,
	async (req, res) => {
		try {
			const comment = await Comment.findById(req.params.comment_id);

			if (req.body.content) comment.content = req.body.content;

			await comment.save();

			res.redirect(`/books/${req.params.book_id}`);
		} catch (error) {
			console.log(error);
		}
	}
);

// DELETE /books/:id/comments/:id --> delete comment
router.delete(
	"/books/:book_id/comments/:comment_id",
	isCommentOwner,
	async (req, res) => {
		try {
			const comment = await Comment.findById(req.params.comment_id);
			const book = await Book.findById(req.params.book_id);

			book.comments = book.comments.filter(
				(e) => !e.equals(req.params.comment_id)
			);

			await book.save();
			await comment.remove();

			res.redirect(`/books/${req.params.book_id}`);
		} catch (error) {
			console.log(error);
		}
	}
);

module.exports = router;
