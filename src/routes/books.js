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
		cb(null, `${Date.now()}-${file.originalname}`);
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
const multipleUploads = upload.fields([
	{ name: "coverImagePath", maxCount: 3 },
	{ name: "pdfFile", maxCount: 3 },
]);
router.post("/books", multipleUploads, async (req, res) => {
	try {
		// if folders is not there, create new folders
		// fs.access("./public/uploads/img/cover", (error) => {
		// 	if (error) {
		// 		fs.mkdirSync("./public/uploads/img/cover", { recursive: true });
		// 	}
		// });

		// image path
		const { path, originalname } = req.files.coverImagePath[0];
		const formattedName = originalname.split(" ").join("-"); //replace space with -
		const coverImagePath = `/uploads/img/resized/${Date.now()}-${formattedName}`;

		// pdf path
		const { filename } = req.files.pdfFile[0];
		const pdfPath = `/uploads/pdf/${filename}`;

		// resize cover image
		await sharp(path).resize(250, 400).toFile(`./public${coverImagePath}`);

		// save in the data base
		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			description: req.body.description,
			coverImagePath: coverImagePath,
			pdfPath: pdfPath,
			pageNo: req.body.pageNo,
			language: req.body.language,
		});

		// save book
		await book.save();
		console.log(book);

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
// PUT --> /books/:id/ --> Edit books
// GET --> /books/:id/edit --> Show edit book form
// DELETE --> /books/:id/ --> Delete book

module.exports = router;
