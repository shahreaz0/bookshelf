// Add Book form validation
$(".ui.form.add-book").form({
	fields: {
		title: {
			identifier: "title",
			rules: [
				{
					type: "empty",
					prompt: "Enter book title",
				},
			],
		},
		author: {
			identifier: "author",
			rules: [
				{
					type: "empty",
					prompt: "Enter author name",
				},
			],
		},
		coverImagePath: {
			identifier: "coverImagePath",
			rules: [
				{
					type: "empty",
					prompt: "Choose book cover image",
				},
			],
		},
		pdfFile: {
			identifier: "pdfFile",
			rules: [
				{
					type: "empty",
					prompt: "Choose pdf file",
				},
			],
		},
	},
});

// signup form
$(".ui.form.signup").form({
	fields: {
		fullName: {
			identifier: "fullName",
			rules: [
				{
					type: "empty",
					prompt: "Enter your name",
				},
			],
		},
		email: {
			identifier: "email",
			rules: [
				{
					type: "email",
					prompt: "Enter a correct email",
				},
			],
		},
		username: {
			identifier: "username",
			rules: [
				{
					type: "empty",
					prompt: "Enter a username",
				},
			],
		},
		password: {
			identifier: "password",
			rules: [
				{
					type: "empty",
					prompt: "Enter a password",
				},
				{
					type: "minLength[6]",
					prompt: "Your password must be at least {ruleValue} characters",
				},
			],
		},
		terms: {
			identifier: "terms",
			rules: [
				{
					type: "checked",
					prompt: "You must agree to the terms and conditions",
				},
			],
		},
	},
});

//login form

// signup form
$(".ui.form.login").form({
	fields: {
		username: {
			identifier: "username",
			rules: [
				{
					type: "empty",
					prompt: "Enter a username",
				},
			],
		},
		password: {
			identifier: "password",
			rules: [
				{
					type: "empty",
					prompt: "Enter a password",
				},
				{
					type: "minLength[6]",
					prompt: "Your password must be at least {ruleValue} characters",
				},
			],
		},
	},
});
