const router = require("express").Router();
const path = require("path");
const fs = require("fs-extra");

//models
const Book = require("../models/Book");
const User = require("../models/User");

// middleware
const { isLoggedIn, isBookOwner } = require("../configs/middleware");

// configs
const multipleUploads = require("../configs/fileUpload");
const cloudinary = require("../configs/cloudinary");

// GET --> /books --> Shows All books
router.get("/books", async (req, res) => {
	try {
		// search by options
		let query = Book.find();
		if (req.query.title) {
			query = query
				.where("title")
				.regex(new RegExp(req.query.title, "i"));
		}
		if (req.query.author) {
			query = query
				.where("author")
				.regex(new RegExp(req.query.author, "i"));
		}

		if (req.query.genre) {
			query = query
				.where("genre")
				.regex(new RegExp(req.query.genre, "i"));
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
		const books = await query
			.find({ status: "public" })
			.populate("creator")
			.exec();

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
router.post("/books", isLoggedIn, multipleUploads, async (req, res) => {
	try {
		const img = await cloudinary.uploader.upload(
			req.files.coverImagePath[0].path,
			{
				public_id: `bookshelf/img/${req.files.coverImagePath[0].filename}`,
				eager: [{ width: 250, height: 400, fetch_format: "auto" }],
			}
		);

		const pdf = await cloudinary.uploader.upload(
			req.files.pdfFile[0].path,
			{
				public_id: `bookshelf/pdf/${req.files.pdfFile[0].filename}`,
			}
		);

// 		await fs.emptyDir(path.join("public", "uploads"));

		// new book
		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			description: req.body.description,
			genre: req.body.genre,
			language: req.body.language,
			status: req.body.status,
			creator: req.user._id,
			coverImg: {
				url: img.eager[0].secure_url,
				cloudinary_id: img.public_id,
			},
			pdfBook: {
				url: pdf.secure_url,
				cloudinary_id: pdf.public_id,
			},
		});
		// save book
		await book.save();
		// save books Id in user model
		const user = await User.findById(req.user._id);
		user.posts.push(book);

		await user.save();

		// redirect
		req.flash("success", "Post created.");
		res.redirect("/books");
	} catch (error) {
		await cloudinary.uploader.destroy(deleteImg);
		await cloudinary.uploader.destroy(deletePdf);
		req.flash("error", "Failed to create. Try Again");
		res.redirect("/books");
	}
});

// GET --> /books/new --> Show create book form
router.get("/books/new", isLoggedIn, (req, res) => {
	res.render("books/new", { pageTitle: "Add Books", path: req.path });
});

// GET --> /books/:id --> Show individual book in details + all comments + comment form
router.get("/books/:id", async (req, res) => {
	try {
		const book = await Book.findById(req.params.id)
			.populate("comments")
			.populate("creator")
			.exec();

		res.render("books/show", { pageTitle: book.title, book });
	} catch (error) {
		res.redirect("/books");
	}
});

// GET --> /books/:id/edit --> Show edit book form
router.get("/books/:id/edit", isBookOwner, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		res.render("books/edit", { pageTitle: book.title, book });
	} catch (error) {
		res.redirect("/books");
	}
});

// PUT --> /books/:id/ --> Edit books
router.put("/books/:id", isBookOwner, multipleUploads, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		if (req.body.title) book.title = req.body.title;
		if (req.body.author) book.author = req.body.author;
		if (req.body.description) book.description = req.body.description;
		if (req.body.genre) book.genre = req.body.genre;
		if (req.body.language) book.language = req.body.language;
		if (req.body.status) book.status = req.body.status;
		if (req.body.publishDate) book.publishDate = req.body.publishDate;

		if (req.files.coverImagePath) {
			// delete prev img
			await cloudinary.uploader.destroy(book.coverImg.cloudinary_id);
			// upload new img
			const img = await cloudinary.uploader.upload(
				req.files.coverImagePath[0].path,
				{
					public_id: `bookshelf/img/${req.files.coverImagePath[0].filename}`,
					eager: [{ width: 250, height: 400, fetch_format: "auto" }],
				}
			);
			// overwrite prev img data
			book.coverImg = {
				url: img.eager[0].secure_url,
				cloudinary_id: img.public_id,
			};
		}

		if (req.files.pdfFile) {
			// delete prev pdf
			await cloudinary.uploader.destroy(book.pdfBook.cloudinary_id);
			// upload new pdf
			const pdf = await cloudinary.uploader.upload(
				req.files.pdfFile[0].path,
				{
					public_id: `bookshelf/pdf/${req.files.pdfFile[0].filename}`,
				}
			);
			// overwrite prev pdf data
			book.pdfBook = {
				url: pdf.secure_url,
				cloudinary_id: pdf.public_id,
			};
		}

		// empty uploads folder
// 		await fs.emptyDir(path.join("public", "uploads"));
		// save
		await book.save();
		req.flash("success", "Post updated.");
		res.redirect("/books/" + req.params.id);
	} catch (error) {
		req.flash("error", "Failed to update. Try Again.");
		res.redirect("back");
	}
});

// DELETE --> /books/:id/ --> Delete book
router.delete("/books/:id", isBookOwner, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		const user = await User.findById(req.user.id);
		// remove cover img and pdf book from cloudinary
		await cloudinary.uploader.destroy(book.coverImg.cloudinary_id);
		await cloudinary.uploader.destroy(book.pdfBook.cloudinary_id);
		// remove posts id from user
		user.posts = user.posts.filter((e) => !e.equals(req.params.id));
		await user.save();
		// remove book from database
		await book.remove();
		req.flash("success", "Post deleted.");
		res.redirect("/books");
	} catch (error) {
		req.flash("error", "Failed to delete. Try Again.");
		res.redirect("/books");
	}
});

module.exports = router;
