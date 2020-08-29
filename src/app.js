// modules
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const formatDistanceToNow = require("date-fns/formatDistanceToNow");
require("dotenv").config();

// routes requires
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comments");
const profileRoutes = require("./routes/profile");

// mongodb config
require("./configs/db");

// passport config
require("./configs/passport");

// express configs
const app = express();
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(express.static(path.join("public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
	session({
		secret: process.env.COOKIE_SECRET_KEY,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			ttl: 7 * 24 * 60 * 60,
		}),
	}),
);
app.use(passport.initialize());
app.use(passport.session());

// ejs middleware
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.dateFormat = (date) => {
		return formatDistanceToNow(date);
	};
	res.locals.capitalize = (str) => {
		if (typeof str !== "string") return "";
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	next();
});

// routes
app.get("/", (req, res) => {
	res.render("home", { pageTitle: "Bookshelf", path: req.path });
});

app.use(authRoutes);
app.use(bookRoutes);
app.use(commentRoutes);
app.use(profileRoutes);

app.get("*", (req, res) => {
	res.render("404", { pageTitle: "404" });
});

// server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(chalk.blue("====================="));
	console.log(chalk.bold(`http://localhost:${chalk.bold.red(port)}`));
	console.log(chalk.blue("====================="));
});
