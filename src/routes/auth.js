const router = require("express").Router();
const passport = require("passport");

// models
const User = require("../models/User");

router.get("/signup", (req, res) => {
	res.render("auth/signup", { pageTitle: "Signup" });
});

router.post("/signup", async (req, res) => {
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

router.get("/login", (req, res) => {
	res.render("auth/login", { pageTitle: "Login" });
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/books",
		successMessage: "You are logged in.",
		failureRedirect: "/login",
		failureMessage: "Incorrect username or password.",
	}),
	(req, res) => {},
);

module.exports = router;
