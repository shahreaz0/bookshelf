// modules
const path = require("path");
const express = require("express");
const chalk = require("chalk");
require("dotenv").config();

// routes requires

// express config
const app = express();
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join("public")));

// routes
app.get("/", (req, res) => {
	res.render("home", { pageTitle: "Bookshelf", path: req.path });
});

app.get("*", (req, res) => {
	res.render("404", { pageTitle: "404" });
});
// server
const port = process.env.PORT || "3000";
app.listen(port, () => {
	console.log(chalk.blue("====================="));
	console.log(chalk.bold(`http://localhost:${chalk.bold.red(port)}`));
	console.log(chalk.blue("====================="));
});
