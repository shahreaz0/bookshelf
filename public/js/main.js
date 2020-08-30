// froala editor
new FroalaEditor("textarea#add-book-textarea");
new FroalaEditor("textarea#edit-book-textarea");

// tippy.js
const length = document.getElementById("length").dataset.length;

for (let i = 0; i < length; i++) {
	const name = `tooltip${i}`;
	const content = document.getElementById(name)?.dataset.tooltip;

	tippy(`#${name}`, {
		content: content,
	});
}
