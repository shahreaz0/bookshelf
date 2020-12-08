const router = require("express").Router();

const fetchRecipe = require("../api/recipe");

router.get("/recipe", async (req, res) => {
	res.send("Recipe");
	fetchRecipe("pasta");
});

module.exports = router;
