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
			pageTitle: "Paperback",
			books: recentBooks,
			path: req.path,
		});
	} catch (error) {
		res.render("404", {
			pageTitle: "404",
		});
	}
});

module.exports = router;