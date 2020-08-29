const router = require("express").Router();

// models
const User = require("../models/User");

//middleware
const { isLoggedIn } = require("../configs/middleware");

router.get("/profile/", isLoggedIn, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("posts").exec();
		res.render("profile/index", { pageTitle: "Profile", user });
	} catch (error) {
		console.log("profile.js line 13", error);
		res.send({ error });
	}
});

router.get("/profile/:id", isLoggedIn, async (req, res) => {
	// try {
	// 	const user = await User.findById(req.user._id).populate("posts").exec();
	// 	res.render("profile/index", { pageTitle: "Profile", user });
	// } catch (error) {
	// 	console.log("profile.js line 13", error);
	// 	res.send({ error });
	// }
});

router.put("/profile/edit", isLoggedIn, async (req, res) => {
	res.send("edit profile");
});

router.delete("/profile", isLoggedIn, async (req, res) => {
	res.send("delete user account");
});

module.exports = router;
