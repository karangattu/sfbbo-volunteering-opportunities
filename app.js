(function () {
  const OPPORTUNITIES = [
    {
      name: "Colonial Waterbird Nest Monitoring",
      logo: "assets/COLONIAL_WATERBIRD_NEST_MONITORING.png",
      level: "Beginner",
      summary: "Support repeated nest checks and colony observations for local waterbirds."
    },
    {
      name: "Bird Banding",
      logo: "assets/BIRD_BANDING.png",
      level: "Intermediate",
      summary: "Assist with banding operations and the careful handling of field data."
    },
    {
      name: "Outreach",
      logo: "assets/OUTREACH.png",
      level: "Beginner",
      summary: "Represent SFBBO at events, answer questions, and connect people to the mission."
    },
    {
      name: "Habitat Restoration",
      logo: "assets/HABITAT_RESTORATION.png",
      level: "Beginner",
      summary: "Join hands-on restoration work that improves habitat for birds and shoreline wildlife."
    },
    {
      name: "Least Tern Monitoring",
      logo: "assets/LEAST_TERN_MONITORING.png",
      level: "Beginner",
      summary: "Help document nesting activity and breeding behavior during the seasonal window."
    },
    {
      name: "California Gull Nest Surveys",
      logo: "assets/CALIFORNIA_GULL_NEST_SURVEYS.png",
      level: "Beginner",
      summary: "Survey nest sites to track California gull activity during peak season."
    },
    {
      name: "Avian Disease Prevention Program",
      logo: "assets/AVIAN_DISEASE_PREVENTION_PROGRAM.png",
      level: "Beginner",
      summary: "Support survey work that helps spot risk factors early in bird colonies."
    },
    {
      name: "Phalarope Surveys",
      logo: "assets/PHALAROPE_SURVEYS.png",
      level: "Intermediate",
      summary: "Survey phalarope activity during the seasonal window when the birds are visible."
    },
    {
      name: "Snowy Plover",
      logo: "assets/SNOWY_PLOVER.png",
      level: "Beginner",
      summary: "Take part in habitat-focused work that keeps snowy plover areas open and usable."
    }
  ];

  const grid = document.getElementById("opportunity-grid");

  function renderOpportunity(opportunity) {
    const card = document.createElement("article");
    card.className = "opportunity-card";
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
