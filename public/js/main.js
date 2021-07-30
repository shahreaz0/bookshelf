// CKEditor editor
ClassicEditor.create(document.querySelector("#add-book-textarea")).catch(
	(error) => console.error(error)
);

ClassicEditor.create(document.querySelector("#edit-book-textarea")).catch(
	(error) => console.error(error)
);

// tippy.js
tippy("#tooltip", {});

// user like
const likeIcons = document.querySelectorAll(".heart");
const likesText = document.querySelectorAll(".like-section");

for (let icon of likeIcons) {
	icon.addEventListener("click", async function (e) {
		const bookid = this.dataset.bookid;
		const userid = this.dataset.userid;

		this.classList.toggle("outline");

		const option = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userid }),
		};

		const response = await fetch(`/books/${bookid}/like`, option);
		const data = await response.json();

		for (let text of likesText) {
			if (text.dataset.span === bookid)
				text.textContent = data.likes + " likes";
		}
	});
}
