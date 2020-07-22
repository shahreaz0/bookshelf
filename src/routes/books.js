const router = require("express").Router();
const Book = require("../models/Book");

// const book = new Book({
// 	title: "New world with islam 2",
// 	description: "new description",
// 	coverImagePath:
// 		"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
// 	pageNo: 10,
// 	language: "english",
// 	author: "maria",
// });

// book.save()
// 	.then((book) => console.log(book))
// 	.catch((error) => console.log(error));

// GET --> /books --> Shows All books
router.get("/books", async (req, res) => {
	try {
		// search by options
		let query = Book.find();
		if (req.query.title) {
			query = query.where("title").regex(new RegExp(req.query.title, "i"));
		}
		if (req.query.author) {
			query = query.where("author").regex(new RegExp(req.query.author, "i"));
		}
		if (req.query.publishAfter) {
			query = query.where("publishDate").gte(req.query.publishAfter);
		}
		if (req.query.publishBefore) {
			query = query.where("publishDate").lte(req.query.publishBefore);
		}
		if (req.query.language) {
			query = query.where("language").equals(req.query.language);
		}

		// find
		const books = await query.exec();

		// render
		res.render("books/index", {
			pageTitle: "Books",
			path: req.path,
			searchOptions: req.query,
			books,
		});
	} catch (error) {
		res.render("error", { backButton: "/books", error });
	}
});

// POST --> /books --> Create books
// GET --> /books/new --> Show create book form
// GET --> /books/new --> Show individual book in details
// PUT --> /books/:id/ --> Edit books
// GET --> /books/:id/edit --> Show edit book form
// DELETE --> /books/:id/ --> Delete book

module.exports = router;
