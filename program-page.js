(function () {
  const SECTION_IMAGE_SUFFIXES = {
    what: "WHAT",
    how: "HOW",
    when: "WHEN"
  };

  const SECTION_IMAGE_LABELS = {
    what: "What",
    how: "How",
    when: "When"
  };

  const TRAINING_BY_LEVEL = {
    Beginner: "You’ll get a short orientation and safety overview before your first outing.",
    Intermediate: "Training covers the site protocol, field safety, and note-taking before you join the team.",
    Advanced: "Expect role-specific training and a protocol review before field work begins."
  };

  function setMetaDescription(summary) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', summary);
    }
  }

  function toAssetStem(slug) {
    return slug.toUpperCase().replace(/-/g, "_");
  }

  function getSectionImagePath(slug, section) {
    return `assets/${toAssetStem(slug)}_${SECTION_IMAGE_SUFFIXES[section]}.png`;
  }

  function getTrainingText(level) {
    return TRAINING_BY_LEVEL[level] || TRAINING_BY_LEVEL.Beginner;
  }

  function ensureImageDialog() {
    let dialog = document.querySelector('[data-program-image-dialog]');

    if (dialog) {
      return dialog;
    }

    dialog = document.createElement('dialog');
    dialog.className = 'program-image-dialog';
    dialog.dataset.programImageDialog = 'true';
    dialog.innerHTML = `
      <div class="program-image-dialog-panel">
        <button type="button" class="program-image-dialog-close">Close</button>
        <img alt="" />
        <p class="program-image-dialog-caption"></p>
      </div>
    `;

    const closeButton = dialog.querySelector('.program-image-dialog-close');
    closeButton.addEventListener('click', () => {
      dialog.close();
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    document.body.appendChild(dialog);
    return dialog;
  }

  function openImageDialog(imagePath, title, sectionLabel) {
    const dialog = ensureImageDialog();
    const dialogImage = dialog.querySelector('img');
    const caption = dialog.querySelector('.program-image-dialog-caption');

    if (typeof dialog.showModal !== 'function') {
      window.open(imagePath, '_blank', 'noopener');
      return;
    }

    dialogImage.src = imagePath;
    dialogImage.alt = `${title} ${sectionLabel} image`;
    caption.textContent = `${title} - ${sectionLabel}`;

    if (dialog.open) {
      dialog.close();
    }

    dialog.showModal();
  }

  function mountSectionImage(container, slug, section, title) {
    if (!container) {
      return;
    }

    const sectionLabel = SECTION_IMAGE_LABELS[section];
    const imagePath = getSectionImagePath(slug, section);
    const image = document.createElement('img');
    image.src = imagePath;
    image.alt = `${title} ${sectionLabel} image`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      image.remove();
    });

    container.removeAttribute('aria-hidden');
    container.classList.add('program-section-visual-interactive');
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    container.setAttribute('aria-label', `Open ${sectionLabel} image for ${title}`);

    const openPreview = () => {
      openImageDialog(imagePath, title, sectionLabel);
    };

    container.addEventListener('click', openPreview);
    container.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPreview();
      }
    });

    container.replaceChildren(image);
  }

  function createWhenBlock(label, text) {
    const block = document.createElement('div');
    block.className = `program-when-item program-when-item-${label.toLowerCase()}`;

    const heading = document.createElement('p');
    heading.className = 'program-when-label';
    heading.textContent = `${label}:`;

    const body = document.createElement('p');
    body.className = 'program-when-text';
    body.textContent = text;

    block.append(heading, body);
    return block;
  }

  function renderWhenSection(container, level, timelineText) {
    if (!container) {
      return;
    }

    const timeline = timelineText || "Dates are posted when the team schedules them.";

    let target = container;

    if (target.tagName === 'P') {
      const replacement = document.createElement('div');
      replacement.className = 'program-when-stack';
      replacement.dataset.programWhen = '';
      target.replaceWith(replacement);
      target = replacement;
    }

    target.innerHTML = '';
    target.append(
      createWhenBlock('Training', getTrainingText(level)),
      createWhenBlock('Timeline', timeline)
    );
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
    let whenElement = shell.querySelector('[data-program-when]');
    const whatVisual = shell.querySelector('.program-section-visual-what');
    const howVisual = shell.querySelector('.program-section-visual-how');
    const whenVisual = shell.querySelector('.program-section-visual-when');

    if (whenElement && whenElement.tagName === 'P') {
      const replacement = document.createElement('div');
      replacement.className = 'program-when-stack';
      replacement.dataset.programWhen = '';
      whenElement.replaceWith(replacement);
      whenElement = replacement;
    }

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

    mountSectionImage(whatVisual, slug, 'what', detail.title);
    mountSectionImage(howVisual, slug, 'how', detail.title);
    mountSectionImage(whenVisual, slug, 'when', detail.title);

    if (whatElement) {
      whatElement.textContent = detail.what;
    }

    if (howElement) {
      renderList(howElement, detail.how);
    }

    renderWhenSection(whenElement, program.level, detail.when);
  }

  init();
})();
