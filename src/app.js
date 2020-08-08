// modules
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const passport = require("passport");
const formatDistance = require("date-fns/formatDistance");
require("dotenv").config();

// mongodb config
require("./configs/db");

// routes requires
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comments");

// passport config
require("./configs/passport");

// express configs
const app = express();
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join("public")));
app.use(methodOverride("_method"));
app.use(
	expressSession({
		secret: process.env.SECRET_KEY,
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

// middleware
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.dateFormat = (date) => {
		return formatDistance(new Date(), date, { addSuffix: true });
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
