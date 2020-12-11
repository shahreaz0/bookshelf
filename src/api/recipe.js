const axios = require("axios").default;
require("dotenv").config();

const fetchRecipe = async (query) => {
	const option = {
		url: `https://api.spoonacular.com/recipes/complexSearch/`,

		params: {
			apiKey: process.env.SPOONACULAR_API_KEY,
			query,
			number: 100,
		},
	};

	try {
		const res = await axios(option);
		return res.data.results;
	} catch (error) {
		throw "API server is down. Try Again.";
	}
};

const getRecipeDetails = async (id) => {
	const option = {
		url: `https://api.spoonacular.com/recipes/${id}/information`,
		params: {
			apiKey: process.env.SPOONACULAR_API_KEY,
		},
	};

	try {
		const res = await axios(option);
		return res.data;
	} catch (error) {
		throw "API server is down. Try Again.";
	}
};

module.exports = { fetchRecipe, getRecipeDetails };
