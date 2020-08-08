const router = require("express").Router();
const passport = require("passport");

// models
const User = require("../models/User");

// middleware
const { ifLoggedIn } = require("../configs/middleware");

router.get("/signup", ifLoggedIn, (req, res) => {
	res.render("auth/signup", { pageTitle: "Signup" });
});

router.post("/signup", ifLoggedIn, async (req, res) => {
	try {
		const existedUser = await User.find({ username: req.body.username });
		if (existedUser.length === 1) throw new Error("username already used.");

		const { username, password, email, gender, age, fullName } = req.body;

		const user = new User({ username, email, gender, age, fullName });
		await user.setPassword(password);
		await user.save();
		passport.authenticate("local")(req, res, () => {
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
		successMessage: "You are logged in.",
		failureRedirect: "/login",
		failureMessage: "Incorrect username or password.",
	}),
	(req, res) => {},
);

router.get("/logout", (req, res) => {
	req.logOut();
	res.redirect("/books");
});

module.exports = router;
