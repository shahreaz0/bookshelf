const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

//models
const Book = require("../models/Book");
const User = require("../models/User");

// middleware
const { isLoggedIn, isBookOwner } = require("../configs/middleware");

// file upload
const multipleUploads = require("../configs/fileUpload");

// routes -------------------------->

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
		console.log(books);

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
		// if resized folder not there, create
		fs.access("./public/uploads/img/resized", (error) => {
			if (error) {
				fs.mkdirSync("./public/uploads/img/resized");
			}
		});

		// image path
		const coverFilename = req.files.coverImagePath[0].filename;
		const coverImagePath = `/uploads/img/resized/${coverFilename}`;

		// pdf path
		const pdfFilename = req.files.pdfFile[0].filename;
		const pdfPath = `/uploads/pdf/${pdfFilename}`;

		// resize cover image
		const filePath = req.files.coverImagePath[0].path;
		await sharp(filePath)
			.resize(250, 400)
			.toFile(`./public${coverImagePath}`);

		// save in the data base
		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			description: req.body.description,
			coverImageName: coverFilename,
			pdfFileName: pdfFilename,
			pageNo: req.body.pageNo,
			language: req.body.language,
			status: req.body.status,
			creator: req.user._id,
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
		console.log(error);
		res.redirect("/books");
	}
});

// GET --> /books/:id/edit --> Show edit book form
router.get("/books/:id/edit", isBookOwner, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		res.render("books/edit", { pageTitle: book.title, book });
	} catch (error) {
		console.log(error);
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
		if (req.body.pageNo) book.pageNo = req.body.pageNo;
		if (req.body.language) book.language = req.body.language;
		if (req.body.status) book.status = req.body.status;
		if (req.body.publishDate) book.publishDate = req.body.publishDate;
		if (req.files.coverImagePath) {
			// delete old file before saving new one
			const { filename } = req.files.coverImagePath[0];

			const deletePath = path.join(
				"public",
				"uploads",
				"img",
				book.coverImageName
			);
			fs.unlink(deletePath, (error) => {
				if (error) console.log(error);
			});
			const deletePathResized = path.join(
				"public",
				"uploads",
				"img",
				"resized",
				book.coverImageName
			);
			fs.unlink(deletePathResized, (error) => {
				if (error) console.log(error);
			});

			// resize updated file
			const srcPath = req.files.coverImagePath[0].path;
			const destPath = path.join(
				"public",
				"uploads",
				"img",
				"resized",
				filename
			);
			await sharp(srcPath).resize(250, 400).toFile(destPath);

			// save new file name
			book.coverImageName = filename;
		}

		if (req.files.pdfFile) {
			const { filename } = req.files.pdfFile[0];

			// delete old file before saving new one
			const deletePath = path.join(
				"public",
				"uploads",
				"pdf",
				book.pdfFileName
			);
			fs.unlink(deletePath, (error) => {
				if (error) console.log(error);
			});

			// save new pdf file name
			book.pdfFileName = filename;
		}

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

		const imgDelete = path.join(
			"public",
			"uploads",
			"img",
			book.coverImageName
		);
		const resizedDelete = path.join(
			"public",
			"uploads",
			"img",
			"resized",
			book.coverImageName
		);
		const pdfDelete = path.join(
			"public",
			"uploads",
			"pdf",
			book.pdfFileName
		);

		fs.unlink(imgDelete, (error) => console.log(error));
		fs.unlink(resizedDelete, (error) => console.log(error));
		fs.unlink(pdfDelete, (error) => console.log(error));

		await book.remove();
		req.flash("success", "Post deleted.");
		res.redirect("/books");
	} catch (error) {
		req.flash("error", "Failed to delete. Try Again.");
		res.redirect("/books");
	}
});

module.exports = router;
