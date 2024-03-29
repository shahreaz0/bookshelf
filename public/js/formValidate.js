// Close Flash message
$(".message .close").on("click", function () {
	$(this).closest(".message").transition("fade");
});

// toast
const errorMsg =
	document.getElementById("error-message")?.dataset.msg || "error";
const successMsg =
	document.getElementById("success-message")?.dataset.suc || "success";

let headMsg = "";

switch (errorMsg) {
	case "You are not logged in":
		headMsg = "Please, Login";
		break;
	case "You can't edit other's post.":
		headMsg = "Permission denied";
		break;
}

$("#error-toast").toast({
	title: headMsg,
	message: errorMsg,
	showProgress: "bottom",
	displayTime: 4000,
	position: "top center",
	classProgress: "red",
});

switch (successMsg) {
	case "You are not logged in":
		headMsg = "Please, Login";
		break;
}

$("#success-toast").toast({
	message: successMsg,
	showProgress: "bottom",
	displayTime: 3000,
	position: "top center",
	classProgress: "green",
});

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
		name: {
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
	},
});

//login form
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

$(".ui.reply.form.comment").form({
	fields: {
		identifier: "content",
		rules: [
			{
				type: "empty",
				prompt: "There is no comment",
			},
		],
	},
});
