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
