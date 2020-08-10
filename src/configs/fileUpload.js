const multer = require("multer");
const path = require("path");

// multer config
const storage = multer.diskStorage({
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

module.exports = multipleUploads;
