const path = require("path");
const nodeExternals = require("webpack-node-externals");

// front
//const frontConfig = {
//	target: "web",
//	entry: {
//		app: ["./public/js/code.js"],
//	},
//	output: {
//		path: path.resolve(__dirname, "./public/js"),
//		filename: "bundle-front.js",
//	},
//};

// back
const backConfig = {
	target: "node",
	entry: {
		app: ["./src/app.js"],
	},
	output: {
		path: path.resolve(__dirname, "./build"),
		filename: "bundle-back.js",
	},
	node: {
		__dirname: true,
	},
	externals: [nodeExternals()],
};

// Combined 'module.exports'
module.exports = [backConfig];
