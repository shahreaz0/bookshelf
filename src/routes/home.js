const router = require("express").Router();
const Book = require("../models/Book");

router.get("/", async (req, res) => {
	try {
		const recentBooks = await Book.find()
			.populate("creator")
			.sort({ publishDate: "desc" })
			.limit(10)
			.exec();

		res.render("home", {
			pageTitle: "Bookshelf",
			books: recentBooks,
			path: req.path,
		});
	} catch (error) {
		res.render("404", {
			pageTitle: "404",
		});
	}
});

router.get("/:author/books", async (req, res) => {
	try {
		const byAuthor = await Book.find({ author: req.params.author })
			.populate("creator")
			.exec();

		res.render("authors/index", {
			pageTitle: req.params.author,
			books: byAuthor,
			path: req.path,
		});
	} catch (error) {
		res.render("404", {
			pageTitle: "404",
		});
	}
});

module.exports = router;
