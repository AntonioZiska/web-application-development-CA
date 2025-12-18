document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("barChart");
  if (!canvas) return;

  try {
    const data = await fetch("/api/favourites").then((res) => res.json());

    //movies per year
    const perYear = {};
    data.forEach((movie) => {
      if (movie.year) perYear[movie.year] = (perYear[movie.year] || 0) + 1;
    });

    const years = Object.keys(perYear)
      .map(Number)
      .sort((a, b) => a - b);
    const counts = years.map((y) => perYear[y]);

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            label: "favourites",
            data: counts,
            backgroundColor: "#3f51b5",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
      },
    });
  } catch (err) {
    console.error("Failed to load chart data:", err);
  }
});
