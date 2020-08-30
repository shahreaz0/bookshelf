const router = require("express").Router();
const passport = require("passport");

// models
const User = require("../models/User");

// middleware
const { ifLoggedIn } = require("../configs/middleware");

// passport-local routes
router.get("/signup", ifLoggedIn, (req, res) => {
	res.render("auth/signup", { pageTitle: "Signup" });
});

router.post("/signup", ifLoggedIn, async (req, res) => {
	try {
		const existedUser = await User.find({ username: req.body.username });

		const newName = req.body.username + Math.round(Math.random() * 100).toString();

		if (existedUser.length === 1) {
			req.flash("error", `${req.body.username} already taken. Try ${newName}`);
			throw new Error("username already used.");
		}

		const { username, password, email, gender, age, fullName } = req.body;

		const user = new User({ username, email, gender, age, fullName });
		await user.setPassword(password);
		await user.save();
		passport.authenticate("local")(req, res, () => {
			req.flash("success", `Welcome to bookshelf, ${user.fullName}`);
			res.redirect("/books");
		});
	} catch (error) {
		console.log(error);
		res.redirect("/signup");
	}
});

router.get("/login", ifLoggedIn, (req, res) => {
	res.render("auth/login", { pageTitle: "Login" });
});

router.post(
	"/login",
	ifLoggedIn,
	passport.authenticate("local", {
		successRedirect: "/books",
		successMessage: "Successfully logged in.",
		failureRedirect: "/login",
		failureMessage: "Incorrect username or password.",
	}),
	(req, res) => {},
);

// passport-google-oauth20 routes
//passport-google-oauth20
router.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	}),
);

router.get("/auth/google/cb", passport.authenticate("google"), (req, res) => {
	req.flash("success", "Successfully logged in.");
	res.redirect("/books");
});

// logout
router.get("/logout", (req, res) => {
	req.logOut();

	req.flash("success", "Successfully logged out.");
	res.redirect("/books");
});

module.exports = router;
