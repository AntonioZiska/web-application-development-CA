document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("goCollectionBtn");
  const select = document.getElementById("viewCollection");

  if (!btn || !select) return;

  btn.addEventListener("click", () => {
    const url = select.value;

    if (!url) {
      alert("Please select a collection first");
      return;
    }

    window.location.href = url;
  });
});
