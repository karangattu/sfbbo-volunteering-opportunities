(function () {
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const MONTH_LABELS = Object.fromEntries(
    MONTHS.map((month) => [month, month.slice(0, 3)])
  );

  const EXPERIENCES = ["All levels", "Beginner", "Intermediate", "Advanced"];
  const PROGRAMS = Array.isArray(window.SFBBO_PROGRAMS) ? window.SFBBO_PROGRAMS : [];

  const ICONS = {
    programs: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 4h12" />
        <path d="M6 12h12" />
        <path d="M6 20h12" />
        <path d="M4 4h.01" />
        <path d="M4 12h.01" />
        <path d="M4 20h.01" />
      </svg>
    `,
    months: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18" />
      </svg>
    `,
    categories: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 7h8" />
        <path d="M13 7h8" />
        <path d="M3 17h8" />
        <path d="M13 17h8" />
        <path d="M11 3v18" />
      </svg>
    `
  };

  const elements = {
    heroStats: document.getElementById("hero-stats"),
    monthFilter: document.getElementById("month-filter"),
    experienceFilter: document.getElementById("experience-filter"),
    resultsSummary: document.getElementById("results-summary"),
    programList: document.getElementById("program-list"),
    programDetail: document.getElementById("program-detail")
  };

  const state = {
    month: "All months",
    experience: "All levels",
    selectedProgramId: PROGRAMS[0] ? PROGRAMS[0].id : null
  };

  function getActiveMonths(program) {
    return MONTHS.filter((month) => program.schedule[month]);
  }

  function getFilteredPrograms() {
    return PROGRAMS.filter((program) => {
      const matchesMonth =
        state.month === "All months" || Boolean(program.schedule[state.month]);
      const matchesExperience =
        state.experience === "All levels" || program.experience === state.experience;

      return matchesMonth && matchesExperience;
    }).sort((left, right) => {
      const leftMonths = getActiveMonths(left);
      const rightMonths = getActiveMonths(right);
      const leftFirst = MONTHS.indexOf(leftMonths[0]);
      const rightFirst = MONTHS.indexOf(rightMonths[0]);

      if (leftFirst !== rightFirst) {
        return leftFirst - rightFirst;
      }

      return left.name.localeCompare(right.name);
    });
  }

  function ensureSelection(filteredPrograms) {
    const selectedStillVisible = filteredPrograms.some(
      (program) => program.id === state.selectedProgramId
    );

    if (!selectedStillVisible) {
      state.selectedProgramId = filteredPrograms[0] ? filteredPrograms[0].id : null;
    }
  }

  function renderFilterPills(container, values, currentValue, onChange) {
    container.innerHTML = "";

    values.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `pill-button${value === currentValue ? " is-active" : ""}`;
      button.textContent = value;
      button.setAttribute("aria-pressed", String(value === currentValue));
      button.addEventListener("click", () => onChange(value));
      container.appendChild(button);
    });
  }

  function buildStat(icon, value, label) {
    return `
      <li class="hero-stat">
        <span class="stat-icon" aria-hidden="true">${icon}</span>
        <div>
          <strong>${value}</strong>
          <span>${label}</span>
        </div>
      </li>
    `;
  }

  function renderHeroStats() {
    const monthsCovered = new Set();
    const categories = new Set();

    PROGRAMS.forEach((program) => {
      categories.add(program.category);
      getActiveMonths(program).forEach((month) => monthsCovered.add(month));
    });

    elements.heroStats.innerHTML = [
      buildStat(ICONS.programs, String(PROGRAMS.length), "Programs"),
      buildStat(ICONS.months, String(monthsCovered.size), "Months"),
      buildStat(ICONS.categories, String(categories.size), "Categories")
    ].join("");
  }

  function formatTiming(activeMonths) {
    if (activeMonths.length === 12) {
      return "Year-round";
    }

    if (activeMonths.length === 1) {
      return activeMonths[0];
    }

    if (activeMonths.length <= 3) {
      return activeMonths.map((month) => MONTH_LABELS[month]).join(", ");
    }

    return `${activeMonths
      .slice(0, 3)
      .map((month) => MONTH_LABELS[month])
      .join(", ")} + ${activeMonths.length - 3}`;
  }

  function formatSummary(filteredPrograms) {
    const count = filteredPrograms.length;
    const noun = count === 1 ? "program" : "programs";

    if (!count) {
      return "No matches";
    }

    if (state.month === "All months" && state.experience === "All levels") {
      return `${count} ${noun}`;
    }

    if (state.month !== "All months" && state.experience === "All levels") {
      return `${count} ${noun} in ${state.month}`;
    }

    if (state.month === "All months" && state.experience !== "All levels") {
      return `${count} ${noun} for ${state.experience.toLowerCase()} volunteers`;
    }

    return `${count} ${noun} in ${state.month}`;
  }

  function renderProgramList(filteredPrograms) {
    elements.resultsSummary.textContent = formatSummary(filteredPrograms);

    if (!filteredPrograms.length) {
      elements.programList.innerHTML = `
        <div class="empty-state">
          <p class="eyebrow">No matches</p>
          <h3 class="empty-state-title">Try a different filter</h3>
          <p class="empty-state-copy">
            This combination does not have a matching volunteer program.
          </p>
        </div>
      `;
      return;
    }

    elements.programList.innerHTML = "";

    filteredPrograms.forEach((program) => {
      const activeMonths = getActiveMonths(program);
      const currentMonthStatus =
        state.month === "All months" ? null : program.schedule[state.month];

      const button = document.createElement("button");
      button.type = "button";
      button.className = `program-card${
        state.selectedProgramId === program.id ? " is-selected" : ""
      }`;
      button.innerHTML = `
        <div class="program-card-head">
          <div>
            <p class="eyebrow">${program.category}</p>
            <h4 class="program-card-title">${program.name}</h4>
          </div>
          <span class="tag tag-accent">${program.experience}</span>
        </div>
        <p class="program-card-copy">${program.summary}</p>
        <div class="program-card-foot">
          <span>${formatTiming(activeMonths)}</span>
          ${
            currentMonthStatus && currentMonthStatus.status === "Full"
              ? `<span class="status-chip status-full">Full</span>`
              : currentMonthStatus
                ? `<span class="tag tag-muted">Listed in ${state.month}</span>`
                : ""
          }
        </div>
      `;

      button.addEventListener("click", () => {
        state.selectedProgramId = program.id;
        render();
      });

      elements.programList.appendChild(button);
    });
  }

  function renderProgramDetail(filteredPrograms) {
    if (!filteredPrograms.length) {
      elements.programDetail.innerHTML = `
        <div class="empty-state">
          <p class="eyebrow">Selection</p>
          <h3 class="empty-state-title">No program selected</h3>
          <p class="empty-state-copy">
            Choose a different month or experience level to see available listings.
          </p>
        </div>
      `;
      return;
    }

    const program =
      filteredPrograms.find((entry) => entry.id === state.selectedProgramId) || filteredPrograms[0];
    const activeMonths = getActiveMonths(program);
    const currentMonthStatus =
      state.month === "All months" ? null : program.schedule[state.month];

    elements.programDetail.innerHTML = `
      <div class="detail-top">
        <div>
          <p class="detail-kicker">Selected program</p>
          <h3 class="detail-title" id="detail-heading">${program.name}</h3>
        </div>
        <div class="detail-badges">
          <span class="tag tag-accent">${program.experience}</span>
          <span class="tag tag-muted">${program.category}</span>
          ${
            currentMonthStatus && currentMonthStatus.status === "Full"
              ? `<span class="status-chip status-full">Full in ${state.month}</span>`
              : currentMonthStatus
                ? `<span class="tag tag-muted">Listed in ${state.month}</span>`
                : ""
          }
        </div>
      </div>

      <p class="detail-copy">${program.summary}</p>

      <div class="detail-stat-list">
        <div class="detail-stat">
          <strong>Experience</strong>
          <span>${program.experience}</span>
        </div>
        <div class="detail-stat">
          <strong>Category</strong>
          <span>${program.category}</span>
        </div>
        <div class="detail-stat">
          <strong>Timing</strong>
          <span>${formatTiming(activeMonths)}</span>
        </div>
      </div>

      <div class="detail-section">
        <p class="detail-section-title">Months</p>
        <div class="month-chip-list">
          ${activeMonths
            .map((month) => {
              const monthStatus = program.schedule[month];
              const isFull = monthStatus.status === "Full";

              return `
                <div class="month-chip${isFull ? " has-status" : ""}">
                  <strong>${MONTH_LABELS[month]}</strong>
                  ${isFull ? "<span>Full</span>" : ""}
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function render() {
    const filteredPrograms = getFilteredPrograms();
    ensureSelection(filteredPrograms);
    renderProgramList(filteredPrograms);
    renderProgramDetail(filteredPrograms);
  }

  function initializeFilters() {
    renderFilterPills(
      elements.monthFilter,
      ["All months", ...MONTHS],
      state.month,
      (value) => {
        state.month = value;
        initializeFilters();
        render();
      }
    );

    renderFilterPills(
      elements.experienceFilter,
      EXPERIENCES,
      state.experience,
      (value) => {
        state.experience = value;
        initializeFilters();
        render();
      }
    );
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {
        // Ignore registration failures in environments that do not support SW fully.
      });
    });
  }

  function init() {
    if (!PROGRAMS.length) {
      elements.programList.innerHTML = `
        <div class="empty-state">
          <p class="eyebrow">Data unavailable</p>
          <h3 class="empty-state-title">No program data loaded</h3>
          <p class="empty-state-copy">
            The app expected the seed dataset to be available on <code>window.SFBBO_PROGRAMS</code>.
          </p>
        </div>
      `;
      return;
    }

    renderHeroStats();
    initializeFilters();
    render();
    registerServiceWorker();
  }

  init();
})();