const router = require("express").Router();

const Book = require("../models/Book");
const Comment = require("../models/Comment");

// GET /books/:id --> shows all comments
//      --> in show books routes all comments will be shown associated with that book

// GET /books/:id --> shows form
//      --> in show books routes

// POST /books/:id/comments --> add comment
router.post("/books/:id/comments", async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		const comment = new Comment({
			content: req.body.content,
			author: req.user.username,
			thumbnail: req.user.thumbnail,
		});

		await comment.save();
		console.log(comment);
		book.comments.push(comment);
		await book.save();
		console.log(book);
		res.redirect(`/books/${req.params.id}`);
	} catch (error) {
		res.redirect(`/books/${req.params.id}`);
		console.log(error);
	}
});

// GET /books/:id/comments/:id --> show edit form

// PUT /books/:id/comments/:id --> edit comment

// DELETE /books/:id/comments/:id --> delete comment

module.exports = router;
