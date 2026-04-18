(function () {
  function setMetaDescription(summary) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', summary);
    }
  }

  function renderList(listElement, items) {
    listElement.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      listElement.appendChild(li);
    });
  }

  function init() {
    const shell = document.querySelector('[data-program]');
    if (!shell || !window.SFBBO_PROGRAM_DETAILS || !window.SFBBO_PROGRAMS) {
      return;
    }

    const slug = shell.dataset.program;
    const program = window.SFBBO_PROGRAMS.find((item) => item.slug === slug);
    const detail = window.SFBBO_PROGRAM_DETAILS[slug];

    if (!program || !detail) {
      shell.innerHTML = `
        <section class="program-error">
          <p class="eyebrow">Missing program</p>
          <h1>We could not load that page.</h1>
          <p>The page data for this program is missing.</p>
          <a class="program-back" href="index.html">Back to catalog</a>
        </section>
      `;
      return;
    }

    document.title = `${detail.title} | SFBBO Volunteer Opportunities`;
    setMetaDescription(detail.summary);

    const titleElement = shell.querySelector('[data-program-title]');
    const summaryElement = shell.querySelector('[data-program-summary]');
    const levelElement = shell.querySelector('[data-program-level]');
    const phaseElement = shell.querySelector('[data-program-phase]');
    const logoElement = shell.querySelector('[data-program-logo]');
    const whatElement = shell.querySelector('[data-program-what]');
    const howElement = shell.querySelector('[data-program-how]');
    const whenElement = shell.querySelector('[data-program-when]');

    if (titleElement) {
      titleElement.textContent = detail.title;
    }

    if (summaryElement) {
      summaryElement.textContent = detail.summary;
    }

    if (levelElement) {
      levelElement.textContent = program.level;
    }

    if (phaseElement) {
      phaseElement.textContent = detail.phase;
    }

    if (logoElement) {
      logoElement.src = program.logo;
      logoElement.alt = `${detail.title} logo`;
    }

    if (whatElement) {
      whatElement.textContent = detail.what;
    }

    if (howElement) {
      renderList(howElement, detail.how);
    }

    if (whenElement) {
      whenElement.textContent = detail.when;
    }
  }

  init();
})();
