(function () {
  const OPPORTUNITIES = Array.isArray(window.SFBBO_PROGRAMS) ? window.SFBBO_PROGRAMS : [];
  const grid = document.getElementById("opportunity-grid");

  function renderOpportunity(opportunity) {
    const card = document.createElement("a");
    card.className = "opportunity-card opportunity-card-link";
    card.href = `${opportunity.slug}.html`;
    card.setAttribute("aria-label", `Open ${opportunity.name} page`);
    card.innerHTML = `
      <div class="opportunity-logo">
        <img src="${opportunity.logo}" alt="${opportunity.name} logo" />
      </div>
      <div class="card-top">
        <h3 class="card-title">${opportunity.name}</h3>
        <div class="card-meta">
          <span class="tag">${opportunity.level}</span>
        </div>
      </div>
      <p class="card-copy">${opportunity.summary}</p>
    `;

    card.addEventListener("click", () => {
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    });

    return card;
  }

  function init() {
    if (!grid) {
      return;
    }

    grid.innerHTML = "";
    OPPORTUNITIES.forEach((opportunity) => {
      grid.appendChild(renderOpportunity(opportunity));
    });
  }

  init();
})();
