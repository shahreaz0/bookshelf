const router = require("express").Router();
const passport = require("passport");

router.get("/signup", (req, res) => {
	res.render("auth/signup", { pageTitle: "Signup" });
});

router.get("/login", (req, res) => {
	res.render("auth/login", { pageTitle: "Login" });
});

module.exports = router;
