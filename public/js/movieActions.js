// delete
async function deleteMovie(id) {
  const res = await fetch(`/movie/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (data.redirect) window.location.href = data.redirect;
}

//favourite
async function togglefavourite(id) {
  await fetch(`/movie/favourite/${id}`, { method: "POST" });
  const btn = document.getElementById("favouriteBtn");
  btn.innerText = btn.innerText.includes("Add")
    ? "Remove from favourites"
    : "Add to favourites";
}

//add to selected collection
async function addToCollection(movieId) {
  const collectionId = document.getElementById("collectionSelect").value;
  if (!collectionId) {
    alert("Select a collection first");
    return;
  }

  await fetch(`/collections/${collectionId}/add/${movieId}`, {
    method: "POST",
  });

  alert("Movie added to collection!");
}

//create new collection
async function createCollection() {
  const name = document.getElementById("newCollectionName").value.trim();
  if (!name) return alert("Enter a collection name");

  const res = await fetch("/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const col = await res.json();
  const select = document.getElementById("collectionSelect");

  const option = document.createElement("option");
  option.value = col._id;
  option.textContent = col.name;
  select.appendChild(option);

  document.getElementById("newCollectionName").value = "";
}
