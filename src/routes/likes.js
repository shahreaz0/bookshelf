const router = require("express").Router();

// models
const Book = require("../models/Book");

// middleware
const { isLoggedIn } = require("../configs/middleware");

router.post("/books/:id/like", isLoggedIn, async (req, res) => {
	const book = await Book.findById(req.params.id);

	if (!book.likedUsers.includes(req.body.userid)) {
		book.likedUsers.push(req.body.userid);
		book.likes = book.likes + 1;
	} else {
		book.likedUsers = book.likedUsers.filter(
			(e) => !e.equals(req.body.userid)
		);
		if (book.likes > 0) book.likes = book.likes - 1;
	}

	await book.save();
	res.send({ likes: book.likes });
});

module.exports = router;
