const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");

//models
const Book = require("../models/Book");

// multer config
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
			cb(null, path.join("public", "uploads", "img"));
		} else if (file.originalname.match(/\.pdf$/i)) {
			cb(null, path.join("public", "uploads", "pdf"));
		}
	},
	filename: function (req, file, cb) {
		const formattedName = file.originalname.split(" ").join("_");
		cb(null, `${Date.now()}_${formattedName}`);
	},
});
const upload = multer({
	storage: storage,
	limits: 100000,
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
			cb(new Error("File type not allowed."));
		}
		cb(null, true);
	},
});

const multipleUploads = upload.fields([
	{ name: "coverImagePath", maxCount: 1 },
	{ name: "pdfFile", maxCount: 1 },
]);

// routes

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

router.post("/books", multipleUploads, async (req, res) => {
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
		await sharp(filePath).resize(250, 400).toFile(`./public${coverImagePath}`);

		// save in the data base
		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			description: req.body.description,
			coverImageName: coverFilename,
			pdfFileName: pdfFilename,
			pageNo: req.body.pageNo,
			language: req.body.language,
		});

		// save book
		await book.save();
		// redirect
		res.redirect("/books");
	} catch (error) {
		console.log(error);
		res.redirect("/books");
	}
});

// GET --> /books/new --> Show create book form
router.get("/books/new", (req, res) => {
	res.render("books/new", { pageTitle: "Add Books", path: req.path });
});

// GET --> /books/:id --> Show individual book in details
router.get("/books/:id", async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		res.render("books/show", { pageTitle: book.title, book });
	} catch (error) {
		console.log(error);
		res.redirect("/books");
	}
});

// GET --> /books/:id/edit --> Show edit book form
router.get("/books/:id/edit", async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		res.render("books/edit", { pageTitle: book.title, book });
	} catch (error) {
		console.log(error);
		res.redirect("/books");
	}
});

// PUT --> /books/:id/ --> Edit books

router.put("/books/:id", multipleUploads, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		if (req.body.title) book.title = req.body.title;
		if (req.body.author) book.author = req.body.author;
		if (req.body.description) book.description = req.body.description;
		if (req.body.pageNo) book.pageNo = req.body.pageNo;
		if (req.body.language) book.language = req.body.language;
		if (req.body.publishDate) book.publishDate = req.body.publishDate;
		if (req.files.coverImagePath) {
			// delete old file before saving new one
			const { filename } = req.files.coverImagePath[0];

			const deletePath = path.join("public", "uploads", "img", book.coverImageName);
			fs.unlink(deletePath, (error) => {
				if (error) console.log(error);
			});
			const deletePathResized = path.join(
				"public",
				"uploads",
				"img",
				"resized",
				book.coverImageName,
			);
			fs.unlink(deletePathResized, (error) => {
				if (error) console.log(error);
			});

			// resize updated file
			const srcPath = req.files.coverImagePath[0].path;
			const destPath = path.join("public", "uploads", "img", "resized", filename);
			await sharp(srcPath).resize(250, 400).toFile(destPath);

			// save new file name
			book.coverImageName = filename;
		}

		if (req.files.pdfFile) {
			const { filename } = req.files.pdfFile[0];

			// delete old file before saving new one
			const deletePath = path.join("public", "uploads", "pdf", book.pdfFileName);
			fs.unlink(deletePath, (error) => {
				if (error) console.log(error);
			});

			// save new pdf file name

			book.pdfFileName = filename;
		}

		await book.save();
		res.redirect("/books/" + req.params.id);
	} catch (error) {
		console.log(error);
		res.redirect("back");
	}
});

// DELETE --> /books/:id/ --> Delete book

module.exports = router;
