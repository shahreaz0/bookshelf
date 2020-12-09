const router = require("express").Router();

const { fetchRecipe, getRecipeDetails } = require("../api/recipe");

router.get("/recipe", async (req, res) => {
	try {
		const data = await fetchRecipe(req.query.q.trim());
		console.log(data);
		res.render("recipes/index", {
			pageTitle: "Search Recipes",
			queryStr: req.query.q,
			recipes: data,
		});
	} catch (error) {
		// res.render("404", { backButton: "/recipe", error });
	}
});

router.get("/recipe/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const data = await getRecipeDetails(req.params.id);
		res.send(data);
	} catch (error) {
		console.log(error);
		// res.render("404", { backButton: "/recipe", error });
	}
});

module.exports = router;
