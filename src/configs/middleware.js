exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) return res.redirect("/login");
	next();
};

exports.ifLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return res.redirect("/books");
	next();
};
