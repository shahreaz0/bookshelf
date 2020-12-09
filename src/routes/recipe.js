const router = require("express").Router();

const fetchRecipe = require("../api/recipe");

router.get("/recipe", async (req, res) => {
	try {
		console.log(req.query.q);
		const data = await fetchRecipe(req.query.q);
		console.log(data);
		res.render("recipes/index", {
			pageTitle: "Search Recipes",
			queryStr: req.query.q,
			recipes: data,
		});
	} catch (error) {
		res.render("error", { backButton: "/recipe", error });
	}
});

module.exports = router;
