const axios = require("axios").default;
require("dotenv").config();

const fetchRecipe = async (query) => {
	const q = encodeURIComponent(query);
	const option = {
		url: `https://api.spoonacular.com/recipes/complexSearch/`,
		//
		params: {
			apiKey: process.env.SPOONACULAR_API_KEY,
			query: q,
		},
	};

	try {
		const res = await axios(option);
		console.log(res.data.results);
	} catch (error) {
		throw "API server is down. Try Again.";
	}
};

//fetchRecipe();

module.exports = fetchRecipe;
