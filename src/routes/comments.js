const router = require("express").Router();

// models
const Book = require("../models/Book");
const Comment = require("../models/Comment");

// middleware
const { isLoggedIn } = require("../configs/middleware");

// GET /books/:id --> shows all comments
//      --> in show books routes all comments will be shown associated with that book

// GET /books/:id --> shows form
//      --> in show books routes

// POST /books/:id/comments --> add comment
router.post("/books/:id/comments", isLoggedIn, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		const comment = new Comment({
			content: req.body.content,
			author: req.user.username,
			thumbnail: req.user.thumbnail,
		});

		await comment.save();
		book.comments.push(comment);
		await book.save();
		res.redirect(`/books/${req.params.id}`);
	} catch (error) {
		res.redirect(`/books/${req.params.id}`);
		console.log(error);
	}
});

// GET /books/:id/comments/:id/edit --> show edit form
router.get("/books/:book_id/comments/:comment_id/edit", async (req, res) => {
	const comment = await Comment.findById(req.params.comment_id);
	res.render("comments/edit", {
		pageTitle: "Edit comments",
		bookId: req.params.book_id,
		comment,
	});
});

// PUT /books/:id/comments/:id --> edit comment
router.put("/books/:book_id/comments/:comment_id", async (req, res) => {
	const comment = await Comment.findById(req.params.comment_id);

	if (req.body.content) comment.content = req.body.content;

	await comment.save();

	res.redirect(`/books/${req.params.book_id}`);
});

// DELETE /books/:id/comments/:id --> delete comment
router.delete("/books/:book_id/comments/:comment_id", async (req, res) => {
	const comment = await Comment.findById(req.params.comment_id);

	await comment.remove();

	res.redirect(`/books/${req.params.book_id}`);
});

module.exports = router;
