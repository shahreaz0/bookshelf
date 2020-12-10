const router = require("express").Router();

const { fetchRecipe, getRecipeDetails } = require("../api/recipe");

router.get("/recipes", async (req, res) => {
	try {
		const data = await fetchRecipe(req.query.q);
		console.log(data);
		res.render("recipes/index", {
			pageTitle: "Search Recipes",
			queryStr: req.query.q,
			recipes: data,
		});
	} catch (error) {
		res.render("404", { error });
	}
});

router.get("/recipes/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const data = await getRecipeDetails(req.params.id);
		res.render("recipes/show", {
			pageTitle: "Recipe",
			data,
		});
	} catch (error) {
		res.render("404", { pageTitle: "404" });
	}
});

router.get("/recipes/api/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const data = await getRecipeDetails(req.params.id);
		res.send(data);
	} catch (error) {
		res.render("404", { pageTitle: "404" });
	}
});

module.exports = router;
