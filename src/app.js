// modules
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const flash = require("connect-flash");
if (!(process.env.NODE_ENV === "production")) require("dotenv").config();

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
app.use(express.json());
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
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ejs middleware
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.errorMsg = req.flash("error");
	res.locals.successMsg = req.flash("success");
	res.locals.dateFormat = (date) => {
		return dayjs().to(dayjs(date));
	};
	res.locals.smallDate = (date) => {
		return dayjs(new Date()).format("MMM DD, YYYY");
	};
	res.locals.capitalize = (str) => {
		if (typeof str !== "string") return "";
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	next();
});

// routes
app.use(require("./routes/home"));
app.use(require("./routes/auth"));
app.use(require("./routes/books"));
app.use(require("./routes/likes"));
app.use(require("./routes/comments"));
app.use(require("./routes/profile"));

app.get("*", (req, res) => {
	res.render("404", { pageTitle: "404" });
});

// server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
