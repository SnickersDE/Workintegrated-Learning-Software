const STORAGE_KEY = "seminar-preview-workbook";
const MEASURE_KEY = `${STORAGE_KEY}-measures`;
const TASK_PROGRESS_KEY = `${STORAGE_KEY}-progress`;
const SECTION_SAVE_KEY = `${STORAGE_KEY}-section-save`;

const burgerButton = document.getElementById("burgerButton");
const siteNav = document.getElementById("siteNav");
const persistFields = Array.from(document.querySelectorAll("[data-persist]"));
const saveStateElements = Array.from(document.querySelectorAll("[data-save-state]"));
const progressElements = Array.from(document.querySelectorAll("[data-progress]"));
const exampleReportButtons = Array.from(document.querySelectorAll("[data-action='open-example-report']"));
const clearButtons = Array.from(document.querySelectorAll("[data-action='clear-workbook']"));
const reportButtons = Array.from(document.querySelectorAll("[data-action='open-report']"));
const generatePdfButtons = Array.from(document.querySelectorAll("[data-action='generate-pdf']"));
const manualSaveButtons = Array.from(document.querySelectorAll("[data-action='save-workbook']"));
const healthCheckButtons = Array.from(document.querySelectorAll("[data-action='run-storage-check']"));
const measureSearch = document.getElementById("measureSearch");
const measureCatalog = document.getElementById("measureCatalog");
const selectedMeasuresContainer = document.getElementById("selectedMeasures");
const customMeasuresContainer = document.getElementById("customMeasures");
const addCustomMeasureButton = document.getElementById("addCustomMeasure");
const accordionTriggers = Array.from(document.querySelectorAll(".accordion__trigger"));
const healthStorage = document.querySelector("[data-health='storage']");
const healthWorkbook = document.querySelector("[data-health='workbook']");
const healthReport = document.querySelector("[data-health='report']");
const healthSummary = document.querySelector("[data-health-summary]");

const workbookData = loadJson(STORAGE_KEY, {});
let selectedMeasures = loadJson(MEASURE_KEY, []);
const taskProgress = loadJson(TASK_PROGRESS_KEY, {});
const sectionSaveState = loadJson(SECTION_SAVE_KEY, {});
let measureSearchTerm = "";
const currentWorkbookSection = document.body?.dataset.workbookSection || "";

const exampleData = {
  meta_group: "Gruppe Pflege",
  meta_unternehmensname: "PflegePlus Nord",
  unternehmen_branche: "Ambulante und teilstationaere Pflege",
  unternehmen_groesse: "67 Mitarbeitende",
  unternehmen_bedarf: "Fachkraefte, Einarbeitung und koordinierende Entlastung",
  unternehmen_wachstum: "Erweitertes Angebot und zweiter Standort in 9 Monaten",
  unternehmen_zielrolle: "Praxisnahe Teamkoordination Betreuung und Tourenunterstuetzung",
  unternehmen_zeitraum: "9 Monate",
  persona_name: "Nadine Keller",
  persona_alter: "31 Jahre",
  persona_job: "Pflegehilfskraft im ambulanten Dienst",
  persona_ausbildung: "Einjaehrige Helferausbildung im Gesundheitsbereich",
  persona_erfahrung: "3 Jahre im Betrieb, gute Routine in Grundpflege, verlaesslich in Tourenablaeufen und hohe Akzeptanz bei Klient:innen.",
  persona_interessen: "Kommunikation, Organisation kleiner Alltagsablaeufe, Begleitung neuer Kolleg:innen",
  persona_motivation: "Mehr Verantwortung uebernehmen, aber praxisnah bleiben",
  persona_lernpraeferenz: "praktisch im Tun",
  persona_staerken: "ruhig, empathisch, puenktlich, verlaesslich",
  persona_unsicherheiten: "Dokumentation und Konfliktgespraeche",
  persona_informell: "Hat neue Kolleg:innen punktuell eingearbeitet und Rueckmeldungen an die Tourenplanung weitergegeben.",
  zielrolle_name: "Praxisnahe Teamkoordination Betreuung und Tourenunterstuetzung",
  zielrolle_verantwortung: "Einarbeitung, Rueckmeldungen, erste Koordination im Alltag",
  zielrolle_aufgaben: "Neue Hilfskraefte begleiten, Rueckmeldungen an die Einsatzplanung geben und bei einfachen Qualitaetsfragen erste Ansprechperson sein.",
  zielrolle_kompetenzen: "Strukturierte Rueckmeldung, Basiskompetenz in Anleitung, Dokumentation und Rollenklarheit.",
  zielrolle_foerderung: "Shadowing mit erfahrener Fachkraft, kurze Lernfenster im Dienst, Feedbackschleifen im Team und schrittweise Uebernahme kleiner koordinierender Aufgaben.",
  einschaetzung_relevant: "Die Persona kennt den Betrieb und hat bereits anschlussfaehige Praxiserfahrung.",
  einschaetzung_potenzial: "Entwicklungsbereitschaft, praktische Staerken und erste informelle Anleitungssituationen sprechen fuer Potenzial.",
  einschaetzung_huerden: "Hohe Auslastung, Unsicherheit bei Doku und fehlende freigegebene Lernzeit.",
  analyse_ist: "Praxisnah, erfahren im direkten Kontakt mit Klient:innen, sicher in Routinen und Teamdynamiken.",
  analyse_soll: "Koordinierende Aufgaben, Anleitung neuer Hilfskraefte, strukturierte Rueckmeldungen und sicherere Dokumentation.",
  wollen_einschaetzung: "Motivation ist vorhanden, solange die Entwicklung praxisnah bleibt und nicht nur aus Theorie besteht.",
  wollen_belege: "Die Persona will mehr Verantwortung, scheut aber reine Papierarbeit.",
  koennen_einschaetzung: "Gute fachnahe Basis, aber Entwicklungsbedarf in Dokumentation, Feedback und Anleitung.",
  koennen_belege: "Routine im Alltag ist sichtbar, koordinierende Kommunikation wurde bisher nur informell uebernommen.",
  duerfen_einschaetzung: "Das groesste Risiko liegt im System: zu wenig Zeit, unklare Zustaendigkeit und Lernen nur nebenbei.",
  duerfen_belege: "Hohe Auslastung und fehlende Lernfenster verhindern stabile Entwicklung.",
  duerfen_rechtlich: "Relevant sind Qualifikationsgrenzen, Dokumentationspflichten, Datenschutz und die Frage, welche Aufgaben unter Anleitung oder Aufsicht uebernommen werden duerfen.",
  priorisierung_barriere: "Duerfen",
  priorisierung_fokus: "Rahmen sichern",
  priorisierung_begruendung: "Ohne freigegebene Lernzeit und klare Rollenverantwortung verpuffen selbst gute Massnahmen.",
  ticket_unternehmen: "PflegePlus Nord",
  ticket_bereich: "Ambulante Betreuung",
  ticket_persona: "Nadine Keller",
  ticket_anlass: "Expansion und Fachkraeftemangel",
  ticket_businessziel: "Interne Entwicklung soll Fachkraefte entlasten und die Expansion absichern.",
  ticket_zielrolle: "Praxisnahe Teamkoordination Betreuung und Tourenunterstuetzung",
  ticket_zeitpunkt: "innerhalb von 9 Monaten",
  ticket_beitrag: "Entlastung der Fachkraefte, bessere Einarbeitung und mehr Stabilitaet im Wachstumsprozess.",
  ticket_wollen: "hoch, wenn Entwicklung begleitet und praxisnah erfolgt",
  ticket_koennen: "gute Basis, Entwicklungsbedarf in Anleitung, Rueckmeldung und Doku",
  ticket_duerfen: "aktuell eingeschraenkt durch Zeitdruck und fehlende Lernfenster",
  erfolg_alltag: "Die Persona uebernimmt erste koordinierende Aufgaben sicher und strukturiert.",
  erfolg_entlastung: "Die Teamleitung meldet spuerbare Entlastung bei Einarbeitung und Rueckfragen.",
  erfolg_person: "Die Persona erlebt mehr Sicherheit in Anleitung, Doku und Rueckmeldung.",
  pitch_text: "Nadine Keller ist eine erfahrene Pflegehilfskraft mit hohem Praxisbezug und Entwicklungsmotivation. Die zentrale Luecke liegt weniger im Wollen als im Duerfen und in einzelnen Kompetenzfeldern.",
  reflexion_anschlussfaehig: true,
  reflexion_systemsicht: true,
  reflexion_arbeitsintegriert: true,
  reflexion_realistisch: true,
  reflexion_notiz: "Die staerkste Entscheidung war, keine reine Schulungsloesung zu waehlen. Offen bleibt, wie viel Lernzeit die Leitung wirklich absichern kann."
};

const measureCatalogData = [
  { id: "shadowing", title: "Shadowing im Alltag", category: "Koennen", duration: "2-4 Wochen", owner: "Erfahrene Fachkraft", integrated: "Ja", goal: "Praxistransfer und Beobachtungslernen", description: "Die Person begleitet gezielt eine erfahrene Kolleg:in und uebernimmt schrittweise Teilaufgaben." },
  { id: "stretch", title: "Stretch Assignment", category: "Koennen", duration: "4-8 Wochen", owner: "Teamleitung", integrated: "Ja", goal: "Verantwortung kontrolliert erweitern", description: "Eine echte, aber begrenzte Zusatzverantwortung wird im Alltag probeweise uebernommen." },
  { id: "mentoring", title: "Mentoring im Betrieb", category: "Wollen", duration: "laufend", owner: "Mentor:in", integrated: "Ja", goal: "Sicherheit und Motivation staerken", description: "Regelmaessige kurze Reflexionsgespraeche sichern Motivation und Rollenklarheit." },
  { id: "microlearning", title: "Mikro-Lernfenster", category: "Koennen", duration: "15 Minuten pro Woche", owner: "Praxisanleitung", integrated: "Ja", goal: "Konkrete Kompetenzluecken bearbeiten", description: "Kleine Lerneinheiten direkt an echten Faellen, etwa Dokumentation oder Feedback." },
  { id: "jobrotation", title: "Job Rotation", category: "Koennen", duration: "1-2 Tage", owner: "Leitung", integrated: "Ja", goal: "Schnittstellen und Zielrolle verstehen", description: "Gezielter Wechsel in relevante Arbeitsbereiche." },
  { id: "learningtime", title: "Verbindliche Lernzeit", category: "Duerfen", duration: "ab sofort", owner: "Leitung", integrated: "Ja", goal: "Rahmenbedingungen sichern", description: "Lernzeit wird offiziell eingeplant, damit Entwicklung nicht im Tagesstress untergeht." },
  { id: "roleclarity", title: "Rollenklaerung", category: "Duerfen", duration: "1-2 Termine", owner: "Fuehrungskraft", integrated: "Teilweise", goal: "Zustaendigkeiten sauber festlegen", description: "Abstimmung, was die Person tun darf und welche Unterstuetzung es gibt." },
  { id: "peerfeedback", title: "Feedbackschleife im Team", category: "Wollen", duration: "woechentlich", owner: "Team", integrated: "Ja", goal: "Motivation und Rollensicherheit staerken", description: "Kurze strukturierte Rueckmeldung aus dem Team zu beobachtbaren Fortschritten." },
  { id: "certification", title: "Fort- oder Weiterbildung in einem spezifischen Bereich", category: "Koennen", duration: "individuell", owner: "Anbieter + Betrieb", integrated: "Teilweise", goal: "Spezifische Fachkompetenz strukturiert aufbauen", description: "Gezielte Qualifizierung in einem fachlich relevanten Bereich mit moeglicher Zertifizierung.", supportsCertification: true }
];

function loadJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function persistWorkbook() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workbookData));
}

function persistMeasures() {
  window.localStorage.setItem(MEASURE_KEY, JSON.stringify(selectedMeasures));
}

function persistTaskProgress() {
  window.localStorage.setItem(TASK_PROGRESS_KEY, JSON.stringify(taskProgress));
}

function persistSectionSaveState() {
  window.localStorage.setItem(SECTION_SAVE_KEY, JSON.stringify(sectionSaveState));
}

function setSaveState(message) {
  saveStateElements.forEach((element) => {
    element.textContent = message;
  });
}

function updateTaskOverviewState() {
  const taskLinks = Array.from(document.querySelectorAll("[data-task-link]"));
  const taskStatuses = Array.from(document.querySelectorAll("[data-task-status]"));

  taskLinks.forEach((link) => {
    const taskId = link.dataset.taskLink;
    if (!taskId || taskId === "report") return;
    const isComplete = Boolean(taskProgress[taskId]);
    link.classList.toggle("is-complete", isComplete);
  });

  taskStatuses.forEach((status) => {
    const taskId = status.dataset.taskStatus;
    const isComplete = Boolean(taskId && taskProgress[taskId]);
    status.textContent = isComplete ? "✓" : "Offen";
    status.classList.toggle("is-complete", isComplete);
  });
}

function markCurrentSectionComplete() {
  if (!currentWorkbookSection) return;
  taskProgress[currentWorkbookSection] = true;
  persistTaskProgress();
  updateTaskOverviewState();
}

function updateProgress() {
  const totalFields = persistFields.length;
  const filledFields = persistFields.filter((field) => {
    if (field.type === "checkbox") return field.checked;
    return field.value.trim() !== "";
  }).length;
  progressElements.forEach((element) => {
    element.textContent = `${filledFields} von ${totalFields} Feldern`;
  });
}

function restoreFields() {
  let seededDefaults = false;
  persistFields.forEach((field) => {
    const key = field.dataset.persist;
    if (!key) return;

    if (key in workbookData) {
      if (field.type === "checkbox") {
        field.checked = Boolean(workbookData[key]);
      } else {
        field.value = workbookData[key];
      }
      return;
    }

    const defaultValue = field.type === "checkbox" ? field.checked : field.value;
    if (defaultValue !== undefined && defaultValue !== null && String(defaultValue).trim() !== "") {
      workbookData[key] = defaultValue;
      seededDefaults = true;
    }
  });
  if (seededDefaults) {
    persistWorkbook();
  }
  updateProgress();
  setSaveState(Object.keys(workbookData).length ? "Automatisch gespeichert" : "Autosave aktiv");
}

function saveField(field) {
  const key = field.dataset.persist;
  if (!key) return;
  workbookData[key] = field.type === "checkbox" ? field.checked : field.value;
  persistWorkbook();
  updateProgress();
  setSaveState("Automatisch gespeichert");
}

function openReportPage() {
  persistWorkbook();
  persistMeasures();
  window.location.href = "report.html";
}

function openExampleReportPage() {
  window.location.href = "pflege-report.html";
}

function getMeasureFieldKey(measureId, fieldName) {
  return `measure_${fieldName}_${measureId}`;
}

function readMeasureDraft(measureId) {
  return {
    note: workbookData[getMeasureFieldKey(measureId, "note")] || "",
    learningPlace: workbookData[getMeasureFieldKey(measureId, "learningPlace")] || "",
    learningFormat: workbookData[getMeasureFieldKey(measureId, "learningFormat")] || "",
    certification: workbookData[getMeasureFieldKey(measureId, "certification")] || "",
    lengthCost: workbookData[getMeasureFieldKey(measureId, "lengthCost")] || ""
  };
}

function writeMeasureDraft(measureId, fieldName, value) {
  workbookData[getMeasureFieldKey(measureId, fieldName)] = value;
  persistWorkbook();
}

function buildSelectedMeasure(measure) {
  const draft = readMeasureDraft(measure.id);
  return {
    ...measure,
    note: draft.note,
    learningPlace: draft.learningPlace,
    learningFormat: draft.learningFormat,
    certification: draft.certification,
    lengthCost: draft.lengthCost
  };
}

function syncSelectedMeasureDraft(measureId) {
  const selectedMeasure = selectedMeasures.find((item) => item.id === measureId);
  if (!selectedMeasure) return;
  const draft = readMeasureDraft(measureId);
  selectedMeasure.note = draft.note;
  selectedMeasure.learningPlace = draft.learningPlace;
  selectedMeasure.learningFormat = draft.learningFormat;
  selectedMeasure.certification = draft.certification;
  selectedMeasure.lengthCost = draft.lengthCost;
  persistMeasures();
  renderSelectedMeasures();
}

function updateCustomMeasure(measureId, fieldName, value) {
  const selectedMeasure = selectedMeasures.find((item) => item.id === measureId);
  if (!selectedMeasure) return;
  selectedMeasure[fieldName] = value;
  persistMeasures();
}

function saveWorkbookManually() {
  persistWorkbook();
  persistMeasures();
  markCurrentSectionComplete();
  runStorageHealthCheck();
  setSaveState("Gespeichert");
}

function animateSaveButton(button) {
  if (!button) return;
  button.classList.remove("is-morphing");
  void button.offsetWidth;
  button.classList.add("is-morphing");
  window.setTimeout(() => {
    button.classList.remove("is-morphing");
  }, 520);
}

function getCardEditableElements(card) {
  if (!card) return [];
  return Array.from(card.querySelectorAll("input, select, textarea, button")).filter((element) => !element.closest(".section-save-row"));
}

function toggleCardEditing(card, enabled) {
  getCardEditableElements(card).forEach((element) => {
    if (enabled) {
      if (element.dataset.sectionLockDisabled === "true") {
        element.disabled = false;
        delete element.dataset.sectionLockDisabled;
      }
      return;
    }

    if (element.disabled) return;
    element.disabled = true;
    element.dataset.sectionLockDisabled = "true";
  });
}

function updateSectionSaveButton(button, saved) {
  if (!button) return;
  button.classList.toggle("button--section-saved", saved);
  button.classList.toggle("button--ghost", !saved);
  button.setAttribute("aria-pressed", saved ? "true" : "false");
  button.setAttribute("title", saved ? "Erneut klicken, um wieder zu bearbeiten" : "Container abspeichern");
}

function setSectionCardSavedState(card, button, saved, options = {}) {
  if (!card || !button) return;
  const { persist = true, animate = false } = options;
  const cardId = card.dataset.sectionSaveId;

  card.classList.toggle("card--section-saved", saved);
  toggleCardEditing(card, !saved);
  updateSectionSaveButton(button, saved);

  if (cardId && persist) {
    sectionSaveState[cardId] = saved;
    persistSectionSaveState();
  }

  if (animate) {
    button.classList.remove("is-figma-save", "is-figma-release");
    void button.offsetWidth;
    button.classList.add(saved ? "is-figma-save" : "is-figma-release");
    animateSaveButton(button);
    window.setTimeout(() => {
      button.classList.remove("is-figma-save", "is-figma-release");
    }, 760);
  }
}

function attachSaveButtonBehavior(button) {
  if (!button || button.dataset.saveBound === "true") return;
  button.dataset.saveBound = "true";
  button.addEventListener("click", () => {
    if (button.dataset.saveMode === "section") {
      const card = button.closest(".card");
      const isSaved = button.classList.contains("button--section-saved");
      if (isSaved) {
        setSectionCardSavedState(card, button, false, { persist: true, animate: true });
        setSaveState("Bearbeitung wieder aktiviert");
      } else {
        saveWorkbookManually();
        setSectionCardSavedState(card, button, true, { persist: true, animate: true });
      }
      return;
    }

    saveWorkbookManually();
    animateSaveButton(button);
  });
}

function setHealthStatus(element, ok, successText, errorText) {
  if (!element) return;
  element.textContent = ok ? successText : errorText;
  element.classList.toggle("is-ok", ok);
  element.classList.toggle("is-error", !ok);
}

function runStorageHealthCheck() {
  const result = window.ReportUtils?.runStorageHealthCheck?.();
  if (!result) return;

  setHealthStatus(healthStorage, result.storageOk, "OK", "Fehler");
  setHealthStatus(healthWorkbook, result.workbookOk, "Gespeichert", "Noch leer");
  setHealthStatus(healthReport, result.reportOk, "Bereit", "Nicht bereit");

  if (healthSummary) {
    healthSummary.textContent = result.summary;
  }
}

function injectSectionSaveButtons() {
  if (currentWorkbookSection === "ab3") return;
  const cardsWithFields = Array.from(document.querySelectorAll(".card")).filter((card) => {
    if (card.querySelector(".section-save-row")) return false;
    return Boolean(card.querySelector("[data-persist], [data-custom-measure], [data-measure-input]"));
  });

  cardsWithFields.forEach((card, index) => {
    const cardId = `${currentWorkbookSection || "page"}-card-${index + 1}`;
    card.dataset.sectionSaveId = cardId;

    const saveRow = document.createElement("div");
    saveRow.className = "section-save-row";

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "button button--small button--ghost button--section-save";
    saveButton.dataset.action = "save-workbook";
    saveButton.dataset.saveMode = "section";
    saveButton.innerHTML = '<span class="button__label">Alles abspeichern</span><span class="button__check" aria-hidden="true">✓</span>';
    attachSaveButtonBehavior(saveButton);

    saveRow.appendChild(saveButton);
    card.appendChild(saveRow);
    setSectionCardSavedState(card, saveButton, Boolean(sectionSaveState[cardId]), { persist: false, animate: false });
  });
}

function renderMeasures() {
  if (!measureCatalog) return;
  const primaryBarrier = workbookData.priorisierung_barriere || "";
  const filtered = measureCatalogData.filter((measure) => {
    const haystack = `${measure.title} ${measure.description} ${measure.goal}`.toLowerCase();
    const matchesSearch = !measureSearchTerm || haystack.includes(measureSearchTerm.toLowerCase());
    return matchesSearch;
  });

  measureCatalog.innerHTML = filtered.map((measure) => {
    const isSelected = selectedMeasures.some((item) => item.id === measure.id);
    const isRecommended = primaryBarrier && measure.category === primaryBarrier;
    const draft = readMeasureDraft(measure.id);
    return `
      <details class="measure-card ${isRecommended ? "measure-card--recommended" : ""}">
        <summary class="measure-card__summary">
          <div class="measure-card__summary-main">
            <h4>${measure.title}</h4>
            <p class="muted">${measure.description}</p>
          </div>
          <div class="measure-summary__side">
            ${isRecommended ? '<span class="recommendation-badge">Passend</span>' : ""}
            <span class="measure-info" tabindex="0" role="note" aria-label="Hinweis zur Massnahme" data-tooltip="${measure.description}">i</span>
            <span class="measure-summary__toggle">Details</span>
          </div>
        </summary>
        <div class="measure-card__content">
          <div class="measure-meta">
            <small class="muted">Kategorie: ${measure.category}</small>
            <small class="muted">Rahmen: ${measure.duration}</small>
            <small class="muted">Arbeitsintegriert: ${measure.integrated}</small>
          </div>
          <div class="measure-fields">
            <label class="field field--wide">
              <span>Angaben zur Massnahme</span>
              <textarea data-measure-input="note" data-measure-id="${measure.id}" rows="3" placeholder="z. B. Einsatzort, konkrete Ausgestaltung, Begleitung">${draft.note}</textarea>
            </label>
            <label class="field">
              <span>Lernort</span>
              <select data-measure-input="learningPlace" data-measure-id="${measure.id}">
                <option value="">Bitte waehlen</option>
                <option value="Im Betrieb" ${draft.learningPlace === "Im Betrieb" ? "selected" : ""}>Im Betrieb</option>
                <option value="Arbeitsplatz" ${draft.learningPlace === "Arbeitsplatz" ? "selected" : ""}>Arbeitsplatz</option>
                <option value="ausserbetrieblich" ${draft.learningPlace === "ausserbetrieblich" ? "selected" : ""}>ausserbetrieblich</option>
              </select>
            </label>
            <label class="field">
              <span>Lernform</span>
              <select data-measure-input="learningFormat" data-measure-id="${measure.id}">
                <option value="">Bitte waehlen</option>
                <option value="formell" ${draft.learningFormat === "formell" ? "selected" : ""}>formell</option>
                <option value="informell" ${draft.learningFormat === "informell" ? "selected" : ""}>informell</option>
                <option value="non formell" ${draft.learningFormat === "non formell" ? "selected" : ""}>non formell</option>
              </select>
            </label>
            ${measure.supportsCertification ? `
              <label class="field">
                <span>Angestrebte Zertifizierung</span>
                <input data-measure-input="certification" data-measure-id="${measure.id}" type="text" placeholder="z. B. Wundmanagement" value="${draft.certification}">
              </label>
              <label class="field">
                <span>Laenge und Kosten</span>
                <input data-measure-input="lengthCost" data-measure-id="${measure.id}" type="text" placeholder="z. B. 6 Monate / 1.200 EUR" value="${draft.lengthCost}">
              </label>
            ` : ""}
          </div>
          <div class="measure-card__bottom">
            <small class="muted">Ziel: ${measure.goal}</small>
            <button class="button button--small button--measure-toggle ${isSelected ? "button--selected" : "button--primary"}" data-measure-action="${isSelected ? "remove" : "add"}" data-measure-id="${measure.id}">
              ${isSelected ? "✓" : "Auswaehlen"}
            </button>
          </div>
        </div>
      </details>
    `;
  }).join("");

  measureCatalog.querySelectorAll("[data-measure-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const measureId = button.dataset.measureId;
      if (!measureId) return;
      if (button.dataset.measureAction === "add") {
        button.classList.add("is-morphing");
        button.classList.remove("button--primary");
        button.classList.add("button--selected");
        button.textContent = "✓";
        window.setTimeout(() => addMeasure(measureId), 180);
      } else {
        button.classList.add("is-morphing");
        button.classList.remove("button--selected");
        button.classList.add("button--primary");
        button.textContent = "Auswaehlen";
        window.setTimeout(() => removeMeasure(measureId), 180);
      }
    });
  });

  measureCatalog.querySelectorAll("[data-measure-input]").forEach((field) => {
    const update = () => {
      const measureId = field.dataset.measureId;
      const inputType = field.dataset.measureInput;
      if (!measureId || !inputType) return;
      writeMeasureDraft(measureId, inputType, field.value);
      syncSelectedMeasureDraft(measureId);
    };
    field.addEventListener("input", update);
    field.addEventListener("change", update);
  });
}

function renderSelectedMeasures() {
  if (!selectedMeasuresContainer) return;

  const customMeasures = selectedMeasures.filter((measure) => measure.custom);
  const listedMeasures = selectedMeasures;

  if (customMeasuresContainer) {
    if (!customMeasures.length) {
      customMeasuresContainer.textContent = "Noch keine eigene Massnahme angelegt.";
      customMeasuresContainer.classList.add("empty-state-small");
    } else {
      customMeasuresContainer.classList.remove("empty-state-small");
      customMeasuresContainer.innerHTML = customMeasures.map((measure) => `
        <div class="selected-measure selected-measure--custom">
          <div class="selected-measure__header">
            <div>
              <strong>Eigene Massnahme</strong>
              <p>${measure.category || "Kategorie offen"} | ${measure.goal || "Ziel offen"}</p>
            </div>
            <button class="button button--small button--danger" data-remove-selected="${measure.id}">Entfernen</button>
          </div>
          <div class="form-grid">
            <label class="field field--wide">
              <span>Massnahme</span>
              <input data-custom-measure="${measure.id}" data-custom-field="title" type="text" value="${measure.title || ""}" placeholder="Eigene Massnahme benennen">
            </label>
            <label class="field">
              <span>Kategorie</span>
              <input data-custom-measure="${measure.id}" data-custom-field="category" type="text" value="${measure.category || ""}" placeholder="z. B. Koennen">
            </label>
            <label class="field">
              <span>Arbeitsintegriert?</span>
              <input data-custom-measure="${measure.id}" data-custom-field="integrated" type="text" value="${measure.integrated || ""}" placeholder="Ja / Teilweise / Nein">
            </label>
            <label class="field">
              <span>Zeitraum</span>
              <input data-custom-measure="${measure.id}" data-custom-field="duration" type="text" value="${measure.duration || ""}" placeholder="z. B. 4 Wochen">
            </label>
            <label class="field">
              <span>Verantwortlich</span>
              <input data-custom-measure="${measure.id}" data-custom-field="owner" type="text" value="${measure.owner || ""}" placeholder="z. B. Teamleitung">
            </label>
            <label class="field">
              <span>Lernort</span>
              <select data-custom-measure="${measure.id}" data-custom-field="learningPlace">
                <option value="">Bitte waehlen</option>
                <option value="Im Betrieb" ${measure.learningPlace === "Im Betrieb" ? "selected" : ""}>Im Betrieb</option>
                <option value="Arbeitsplatz" ${measure.learningPlace === "Arbeitsplatz" ? "selected" : ""}>Arbeitsplatz</option>
                <option value="ausserbetrieblich" ${measure.learningPlace === "ausserbetrieblich" ? "selected" : ""}>ausserbetrieblich</option>
              </select>
            </label>
            <label class="field">
              <span>Lernform</span>
              <select data-custom-measure="${measure.id}" data-custom-field="learningFormat">
                <option value="">Bitte waehlen</option>
                <option value="formell" ${measure.learningFormat === "formell" ? "selected" : ""}>formell</option>
                <option value="informell" ${measure.learningFormat === "informell" ? "selected" : ""}>informell</option>
                <option value="non formell" ${measure.learningFormat === "non formell" ? "selected" : ""}>non formell</option>
              </select>
            </label>
            <label class="field field--wide">
              <span>Ziel der Massnahme</span>
              <textarea data-custom-measure="${measure.id}" data-custom-field="goal" rows="3" placeholder="Welchen Beitrag leistet die Massnahme?">${measure.goal || ""}</textarea>
            </label>
            <label class="field field--wide">
              <span>Angaben zur Massnahme</span>
              <textarea data-custom-measure="${measure.id}" data-custom-field="note" rows="3" placeholder="z. B. Lernort, Ablauf, Betreuung">${measure.note || ""}</textarea>
            </label>
          </div>
        </div>
      `).join("");
    }
  }

  if (!listedMeasures.length) {
    selectedMeasuresContainer.textContent = "Noch keine Massnahmen ausgewaehlt.";
    selectedMeasuresContainer.classList.add("empty-state-small");
  } else {
    selectedMeasuresContainer.classList.remove("empty-state-small");
    selectedMeasuresContainer.innerHTML = listedMeasures.map((measure) => `
      <div class="selected-measure ${measure.custom ? "selected-measure--custom" : ""}">
        <div class="selected-measure__header">
          <div>
            <strong>${measure.custom ? (measure.title || "Eigene Massnahme") : measure.title}</strong>
            <p>${measure.category || "Kategorie offen"} | ${measure.goal || "Ziel offen"}</p>
          </div>
          <div class="selected-measure__actions">
            <button class="button button--small button--success-light" data-edit-selected="${measure.id}">Bearbeiten</button>
            <button class="button button--small button--danger" data-remove-selected="${measure.id}">Entfernen</button>
          </div>
        </div>
        <div class="selected-measure__details">
          ${measure.note ? `<p><strong>Angaben zur Massnahme:</strong> ${measure.note}</p>` : ""}
          ${measure.learningPlace ? `<p><strong>Lernort:</strong> ${measure.learningPlace}</p>` : ""}
          ${measure.learningFormat ? `<p><strong>Lernform:</strong> ${measure.learningFormat}</p>` : ""}
          ${measure.certification ? `<p><strong>Angestrebte Zertifizierung:</strong> ${measure.certification}</p>` : ""}
          ${measure.lengthCost ? `<p><strong>Laenge und Kosten:</strong> ${measure.lengthCost}</p>` : ""}
        </div>
      </div>
    `).join("");
  }

  document.querySelectorAll("[data-remove-selected]").forEach((button) => {
    button.addEventListener("click", () => removeMeasure(button.dataset.removeSelected));
  });

  document.querySelectorAll("[data-edit-selected]").forEach((button) => {
    button.addEventListener("click", () => editSelectedMeasure(button.dataset.editSelected));
  });

  document.querySelectorAll("[data-custom-measure]").forEach((field) => {
    const update = () => {
      const measureId = field.dataset.customMeasure;
      const inputField = field.dataset.customField;
      if (!measureId || !inputField) return;
      updateCustomMeasure(measureId, inputField, field.value);
    };
    field.addEventListener("input", update);
    field.addEventListener("change", update);
  });
}

function addMeasure(measureId) {
  const measure = measureCatalogData.find((item) => item.id === measureId);
  if (!measure || selectedMeasures.some((item) => item.id === measure.id)) return;
  selectedMeasures.push(buildSelectedMeasure(measure));
  persistMeasures();
  renderMeasures();
  renderSelectedMeasures();
  setSaveState("Massnahme hinzugefuegt");
}

function removeMeasure(measureId) {
  selectedMeasures = selectedMeasures.filter((item) => item.id !== measureId);
  persistMeasures();
  renderMeasures();
  renderSelectedMeasures();
  setSaveState("Massnahme entfernt");
}

function editSelectedMeasure(measureId) {
  if (!measureId) return;

  const customEditor = customMeasuresContainer?.querySelector(`[data-custom-measure="${measureId}"]`);
  if (customEditor) {
    const wrapper = customEditor.closest(".selected-measure");
    wrapper?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => customEditor.focus(), 220);
    return;
  }

  const measureCard = measureCatalog?.querySelector(`details .button[data-measure-id="${measureId}"]`)?.closest("details");
  if (!measureCard) return;
  measureCard.open = true;
  measureCard.scrollIntoView({ behavior: "smooth", block: "center" });
  const firstField = measureCard.querySelector("[data-measure-input]");
  window.setTimeout(() => firstField?.focus(), 220);
}

function addCustomMeasure() {
  const customMeasure = {
    id: `custom-${Date.now()}`,
    title: "",
    category: "",
    duration: "",
    owner: "",
    integrated: "",
    goal: "",
    note: "",
    learningPlace: "",
    learningFormat: "",
    custom: true
  };
  selectedMeasures.push(customMeasure);
  persistMeasures();
  renderSelectedMeasures();
  setSaveState("Eigene Massnahme hinzugefuegt");
}

function clearWorkbook() {
  const confirmed = window.confirm("Alle bisherigen Eingaben wirklich loeschen?");
  if (!confirmed) return;

  persistFields.forEach((field) => {
    if (field.type === "checkbox") {
      field.checked = false;
    } else {
      field.value = "";
    }
  });

  Object.keys(workbookData).forEach((key) => delete workbookData[key]);
  Object.keys(taskProgress).forEach((key) => delete taskProgress[key]);
  Object.keys(sectionSaveState).forEach((key) => delete sectionSaveState[key]);
  selectedMeasures = [];
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(MEASURE_KEY);
  window.localStorage.removeItem(TASK_PROGRESS_KEY);
  window.localStorage.removeItem(SECTION_SAVE_KEY);
  document.querySelectorAll(".card[data-section-save-id]").forEach((card) => {
    const button = card.querySelector(".button--section-save");
    if (button) {
      setSectionCardSavedState(card, button, false, { persist: false, animate: false });
    }
  });
  updateProgress();
  updateTaskOverviewState();
  renderMeasures();
  renderSelectedMeasures();
  setSaveState("Zurueckgesetzt");
}

function fillExample() {
  Object.assign(workbookData, exampleData);
  persistWorkbook();
  taskProgress.ab1 = true;
  taskProgress.ab2 = true;
  taskProgress.ab3 = true;
  persistTaskProgress();
  selectedMeasures = measureCatalogData.filter((item) => ["learningtime", "shadowing", "stretch"].includes(item.id));
  persistMeasures();
  restoreFields();
  updateTaskOverviewState();
  renderMeasures();
  renderSelectedMeasures();
  setSaveState("Pflege-Beispiel geladen");
}

burgerButton?.addEventListener("click", () => {
  siteNav?.classList.toggle("is-open");
});

persistFields.forEach((field) => {
  field.addEventListener("input", () => saveField(field));
  field.addEventListener("change", () => saveField(field));
});

exampleReportButtons.forEach((button) => button.addEventListener("click", openExampleReportPage));
clearButtons.forEach((button) => button.addEventListener("click", clearWorkbook));
reportButtons.forEach((button) => button.addEventListener("click", openReportPage));
manualSaveButtons.forEach(attachSaveButtonBehavior);
healthCheckButtons.forEach((button) => button.addEventListener("click", runStorageHealthCheck));
generatePdfButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    persistWorkbook();
    persistMeasures();
    if (window.ReportUtils?.generateReportPdf) {
      await window.ReportUtils.generateReportPdf();
      updateTaskOverviewState();
      setSaveState("PDF erstellt");
    } else {
      window.alert("PDF-Export ist aktuell nicht verfuegbar.");
    }
  });
});

measureSearch?.addEventListener("input", () => {
  measureSearchTerm = measureSearch.value || "";
  renderMeasures();
});

addCustomMeasureButton?.addEventListener("click", addCustomMeasure);

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    trigger.parentElement?.classList.toggle("is-open");
  });
});

restoreFields();
updateTaskOverviewState();
renderMeasures();
renderSelectedMeasures();
runStorageHealthCheck();
injectSectionSaveButtons();
