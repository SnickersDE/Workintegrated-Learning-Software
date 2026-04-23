const reportTitle = document.getElementById("reportTitle");
const reportLead = document.getElementById("reportLead");
const metaGroup = document.getElementById("metaGroup");
const metaCompany = document.getElementById("metaCompany");
const metaRole = document.getElementById("metaRole");
const reportContent = document.getElementById("reportContent");
const printReportButton = document.getElementById("printReport");
const downloadPdfButton = document.getElementById("downloadPdf");
const editReportButton = document.getElementById("editReport");
let isEditMode = false;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBlockItems(items, editable) {
  return `
    <div class="report-detail-list">
      ${items.map((item) => `
        <div class="report-detail-row">
          <strong>${item.label}</strong>
          ${editable
            ? `<textarea class="report-edit-field" data-report-item="${item.id}" rows="3">${escapeHtml(item.content)}</textarea>`
            : `<p>${escapeHtml(item.content)}</p>`}
        </div>
      `).join("")}
    </div>
  `;
}

function renderMeasureFields(measure, editable) {
  const fields = [
    ["title", "Massnahme", measure.title || ""],
    ["category", "Kategorie", measure.category || "Noch offen"],
    ["integrated", "Arbeitsintegriert", measure.integrated || "Noch offen"],
    ["goal", "Zielbezug", measure.goal || "Noch offen"],
    ["duration", "Zeitraum", measure.duration || "Noch offen"],
    ["owner", "Verantwortlich", measure.owner || "Noch offen"],
    ["note", "Angaben zur Massnahme", measure.note || ""],
    ["learningPlace", "Lernort", measure.learningPlace || ""],
    ["learningFormat", "Lernform", measure.learningFormat || ""],
    ["certification", "Angestrebte Zertifizierung", measure.certification || ""],
    ["lengthCost", "Laenge und Kosten", measure.lengthCost || ""]
  ];

  return `
    <div class="report-detail-list">
      ${fields.map(([field, label, value]) => `
        <div class="report-detail-row">
          <strong>${label}</strong>
          ${editable
            ? `<textarea class="report-edit-field" data-measure-item="${measure.id}" data-measure-field="${field}" rows="2">${escapeHtml(value)}</textarea>`
            : `<p>${escapeHtml(value || "Noch offen")}</p>`}
        </div>
      `).join("")}
    </div>
  `;
}

function renderMeasures(measures, editable) {
  if (!measures.length) {
    return `<div class="empty-state">Es wurden noch keine PE-Massnahmen ausgewaehlt oder eingetragen.</div>`;
  }

  return `
    <div class="report-grid">
      ${measures.map((measure) => `
        <article class="report-card">
          <h3>${escapeHtml(measure.title || "PE-Massnahme")}</h3>
          ${renderMeasureFields(measure, editable)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderReport() {
  const model = window.ReportUtils?.buildReportModel();
  if (!model) return;

  const getBlock = (sectionTitle, blockTitle) => model.sections
    .find((section) => section.title === sectionTitle)
    ?.blocks.find((block) => block.title === blockTitle);

  const introCompany = getBlock("Einleitung", "Beispielunternehmen");
  const introPersona = getBlock("Einleitung", "Persona und Zielrolle");
  const mainAnalysis = getBlock("Hauptteil", "Bedarfsanalyse");
  const mainTicket = getBlock("Hauptteil", "PE-Ticket");

  reportTitle.textContent = model.title;
  reportLead.textContent = "Diese Seite zieht alle Antworten der Gruppe zusammen und zeigt die Logik eurer Loesung in kompakter Form.";
  metaGroup.textContent = `Gruppe: ${model.meta.group}`;
  metaCompany.textContent = `Unternehmen: ${model.meta.company}`;
  metaRole.textContent = `Zielrolle: ${model.meta.role}`;
  editReportButton.textContent = isEditMode ? "Bearbeitung speichern" : "Bearbeiten";
  editReportButton.classList.toggle("button--saved", isEditMode);

  const intro = `
    <section class="report-section">
      <h2>Einleitung</h2>
      <div class="report-grid">
        <article class="report-card">
          <h3>Beispielunternehmen</h3>
          ${renderBlockItems(introCompany?.items || [], isEditMode)}
        </article>
        <article class="report-card">
          <h3>Persona</h3>
          ${renderBlockItems(introPersona?.items || [], isEditMode)}
        </article>
      </div>
    </section>
  `;

  const main = `
    <section class="report-section">
      <h2>Hauptteil</h2>
      <div class="summary-grid">
        <article class="report-card">
          <h3>Bedarfsanalyse</h3>
          ${renderBlockItems(mainAnalysis?.items || [], isEditMode)}
        </article>
        <article class="report-card">
          <h3>PE-Ticket</h3>
          ${renderBlockItems(mainTicket?.items || [], isEditMode)}
        </article>
      </div>
      <div class="report-section">
        <h3>PE-Massnahmen</h3>
        ${renderMeasures(model.measures, isEditMode)}
      </div>
    </section>
  `;

  reportContent.innerHTML = intro + main;
}

function saveReportEdits() {
  const overrides = window.ReportUtils?.loadReportOverrides?.() || {};

  document.querySelectorAll("[data-report-item]").forEach((field) => {
    const id = field.dataset.reportItem;
    if (!id) return;
    overrides[id] = field.value;
  });

  document.querySelectorAll("[data-measure-item]").forEach((field) => {
    const measureId = field.dataset.measureItem;
    const measureField = field.dataset.measureField;
    if (!measureId || !measureField) return;
    overrides[`measure.${measureId}.${measureField}`] = field.value;
  });

  window.ReportUtils?.saveReportOverrides?.(overrides);
}

printReportButton?.addEventListener("click", () => window.print());
downloadPdfButton?.addEventListener("click", async () => {
  await window.ReportUtils?.generateReportPdf();
});
editReportButton?.addEventListener("click", () => {
  if (isEditMode) {
    saveReportEdits();
  }
  isEditMode = !isEditMode;
  renderReport();
});

renderReport();
