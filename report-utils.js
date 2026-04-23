(function () {
  const STORAGE_KEY = "seminar-preview-workbook";
  const MEASURE_KEY = `${STORAGE_KEY}-measures`;
  const REPORT_OVERRIDE_KEY = `${STORAGE_KEY}-report-overrides`;

  function loadJson(key, fallback) {
    try {
      return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function value(data, key, fallback = "Noch offen") {
    const entry = data[key];
    if (typeof entry === "boolean") {
      return entry ? "Ja" : "Nein";
    }
    if (entry === undefined || entry === null || String(entry).trim() === "") {
      return fallback;
    }
    return String(entry);
  }

  function loadOverrides() {
    return loadJson(REPORT_OVERRIDE_KEY, {});
  }

  function saveOverrides(overrides) {
    window.localStorage.setItem(REPORT_OVERRIDE_KEY, JSON.stringify(overrides));
  }

  function applyOverride(overrides, id, content) {
    if (!id) return content;
    return overrides[id] ?? content;
  }

  function item(id, label, content) {
    return { id, label, content };
  }

  function getReportData() {
    const data = loadJson(STORAGE_KEY, {});
    const selectedMeasures = loadJson(MEASURE_KEY, []);
    const overrides = loadOverrides();

    const manualMeasures = [
      {
        id: "manual-1",
        title: value(data, "massnahme_1_name", ""),
        integrated: value(data, "massnahme_1_arbeitsintegriert", ""),
        goal: value(data, "massnahme_1_zielbezug", ""),
        category: value(data, "massnahme_1_kategorie", ""),
        duration: value(data, "massnahme_1_zeitraum", ""),
        owner: value(data, "massnahme_1_verantwortlich", "")
      },
      {
        id: "manual-2",
        title: value(data, "massnahme_2_name", ""),
        integrated: value(data, "massnahme_2_arbeitsintegriert", ""),
        goal: value(data, "massnahme_2_zielbezug", ""),
        category: value(data, "massnahme_2_kategorie", ""),
        duration: value(data, "massnahme_2_zeitraum", ""),
        owner: value(data, "massnahme_2_verantwortlich", "")
      },
      {
        id: "manual-3",
        title: value(data, "massnahme_3_name", ""),
        integrated: value(data, "massnahme_3_arbeitsintegriert", ""),
        goal: value(data, "massnahme_3_zielbezug", ""),
        category: value(data, "massnahme_3_kategorie", ""),
        duration: value(data, "massnahme_3_zeitraum", ""),
        owner: value(data, "massnahme_3_verantwortlich", "")
      }
    ].filter((item) => item.title);

    const measuresFromSelection = selectedMeasures.map((item) => ({
      id: item.id,
      title: item.title,
      integrated: item.integrated,
      goal: item.goal,
      category: item.category,
      duration: item.duration,
      owner: item.owner,
      note: item.note || "",
      learningPlace: item.learningPlace || "",
      learningFormat: item.learningFormat || "",
      certification: item.certification || "",
      lengthCost: item.lengthCost || "",
      custom: Boolean(item.custom)
    }));

    const measures = measuresFromSelection.filter((item) => item.title || item.goal || item.note).length
      ? measuresFromSelection
      : manualMeasures;

    return {
      data,
      overrides,
      measures: measures.map((measure) => ({
        ...measure,
        title: applyOverride(overrides, `measure.${measure.id}.title`, measure.title),
        integrated: applyOverride(overrides, `measure.${measure.id}.integrated`, measure.integrated),
        goal: applyOverride(overrides, `measure.${measure.id}.goal`, measure.goal),
        category: applyOverride(overrides, `measure.${measure.id}.category`, measure.category),
        duration: applyOverride(overrides, `measure.${measure.id}.duration`, measure.duration),
        owner: applyOverride(overrides, `measure.${measure.id}.owner`, measure.owner),
        note: applyOverride(overrides, `measure.${measure.id}.note`, measure.note || ""),
        learningPlace: applyOverride(overrides, `measure.${measure.id}.learningPlace`, measure.learningPlace || ""),
        learningFormat: applyOverride(overrides, `measure.${measure.id}.learningFormat`, measure.learningFormat || ""),
        certification: applyOverride(overrides, `measure.${measure.id}.certification`, measure.certification || ""),
        lengthCost: applyOverride(overrides, `measure.${measure.id}.lengthCost`, measure.lengthCost || "")
      }))
    };
  }

  function buildReportModel() {
    const { data, measures, overrides } = getReportData();

    return {
      title: `Gruppen-Ergebnis: ${value(data, "meta_group", "Unbenannte Gruppe")}`,
      meta: {
        group: applyOverride(overrides, "meta_group", value(data, "meta_group", "Unbenannte Gruppe")),
        company: applyOverride(overrides, "meta_unternehmensname", value(data, "meta_unternehmensname", value(data, "ticket_unternehmen", "Kein Unternehmen eingetragen"))),
        role: applyOverride(overrides, "zielrolle_name", value(data, "zielrolle_name", value(data, "ticket_zielrolle", "Keine Zielrolle eingetragen")))
      },
      sections: [
        {
          title: "Einleitung",
          blocks: [
            {
              title: "Beispielunternehmen",
              items: [
                item("unternehmen_branche", "Branche", applyOverride(overrides, "unternehmen_branche", value(data, "unternehmen_branche"))),
                item("unternehmen_groesse", "Groesse", applyOverride(overrides, "unternehmen_groesse", value(data, "unternehmen_groesse"))),
                item("unternehmen_bedarf", "Personalbedarf", applyOverride(overrides, "unternehmen_bedarf", value(data, "unternehmen_bedarf"))),
                item("unternehmen_wachstum", "Expansion", applyOverride(overrides, "unternehmen_wachstum", value(data, "unternehmen_wachstum"))),
                item("unternehmen_zeitraum", "Zeitrahmen", applyOverride(overrides, "unternehmen_zeitraum", value(data, "unternehmen_zeitraum")))
              ]
            },
            {
              title: "Persona und Zielrolle",
              items: [
                item("persona_name", "Name", applyOverride(overrides, "persona_name", value(data, "persona_name"))),
                item("persona_job", "Aktueller Job", applyOverride(overrides, "persona_job", value(data, "persona_job"))),
                item("persona_ausbildung", "Ausbildung", applyOverride(overrides, "persona_ausbildung", value(data, "persona_ausbildung"))),
                item("persona_motivation", "Motivation", applyOverride(overrides, "persona_motivation", value(data, "persona_motivation"))),
                item("persona_staerken", "Staerken", applyOverride(overrides, "persona_staerken", value(data, "persona_staerken"))),
                item("persona_unsicherheiten", "Unsicherheiten", applyOverride(overrides, "persona_unsicherheiten", value(data, "persona_unsicherheiten"))),
                item("zielrolle_name", "Zielrolle", applyOverride(overrides, "zielrolle_name", value(data, "zielrolle_name"))),
                item("zielrolle_kompetenzen", "Kompetenzen", applyOverride(overrides, "zielrolle_kompetenzen", value(data, "zielrolle_kompetenzen"))),
                item("zielrolle_foerderung", "Arbeitsintegrierte Foerderung", applyOverride(overrides, "zielrolle_foerderung", value(data, "zielrolle_foerderung")))
              ]
            }
          ]
        },
        {
          title: "Hauptteil",
          blocks: [
            {
              title: "Bedarfsanalyse",
              items: [
                item("analyse_ist", "Ist-Profil", applyOverride(overrides, "analyse_ist", value(data, "analyse_ist"))),
                item("analyse_soll", "Soll-Profil", applyOverride(overrides, "analyse_soll", value(data, "analyse_soll"))),
                item("wollen_einschaetzung", "Wollen", applyOverride(overrides, "wollen_einschaetzung", value(data, "wollen_einschaetzung"))),
                item("koennen_einschaetzung", "Koennen", applyOverride(overrides, "koennen_einschaetzung", value(data, "koennen_einschaetzung"))),
                item("duerfen_einschaetzung", "Duerfen", applyOverride(overrides, "duerfen_einschaetzung", value(data, "duerfen_einschaetzung"))),
                item("duerfen_rechtlich", "Rechtliche Rahmen", applyOverride(overrides, "duerfen_rechtlich", value(data, "duerfen_rechtlich"))),
                item("priorisierung_barriere", "Groesste Barriere", applyOverride(overrides, "priorisierung_barriere", value(data, "priorisierung_barriere"))),
                item("priorisierung_fokus", "Hauptfokus", applyOverride(overrides, "priorisierung_fokus", value(data, "priorisierung_fokus"))),
                item("priorisierung_begruendung", "Begruendung", applyOverride(overrides, "priorisierung_begruendung", value(data, "priorisierung_begruendung")))
              ]
            },
            {
              title: "PE-Ticket",
              items: [
                item("ticket_anlass", "Ausgangssituation", applyOverride(overrides, "ticket_anlass", value(data, "ticket_anlass"))),
                item("ticket_businessziel", "Business-Ziel", applyOverride(overrides, "ticket_businessziel", value(data, "ticket_businessziel"))),
                item("ticket_entwicklungsziel", "Entwicklungsziel", applyOverride(overrides, "ticket_entwicklungsziel", `${value(data, "ticket_zielrolle")} bis ${value(data, "ticket_zeitpunkt")}`)),
                item("ticket_beitrag", "Beitrag fuer das Unternehmen", applyOverride(overrides, "ticket_beitrag", value(data, "ticket_beitrag"))),
                item("ticket_wollen", "Kurzdiagnose Wollen", applyOverride(overrides, "ticket_wollen", value(data, "ticket_wollen"))),
                item("ticket_koennen", "Kurzdiagnose Koennen", applyOverride(overrides, "ticket_koennen", value(data, "ticket_koennen"))),
                item("ticket_duerfen", "Kurzdiagnose Duerfen", applyOverride(overrides, "ticket_duerfen", value(data, "ticket_duerfen"))),
                item("erfolg_alltag", "Erfolg im Alltag", applyOverride(overrides, "erfolg_alltag", value(data, "erfolg_alltag"))),
                item("erfolg_entlastung", "Entlastung Fuehrung", applyOverride(overrides, "erfolg_entlastung", value(data, "erfolg_entlastung"))),
                item("erfolg_person", "Lernfortschritt Person", applyOverride(overrides, "erfolg_person", value(data, "erfolg_person"))),
                item("pitch_text", "Sonstige Angaben zur PE-Massnahmen", applyOverride(overrides, "pitch_text", value(data, "pitch_text"))),
                item("wil_herausforderungen", "WIL-Herausforderungen", applyOverride(overrides, "wil_herausforderungen", value(data, "wil_herausforderungen")))
              ]
            }
          ]
        }
      ],
      measures
    };
  }

  function generatePdfFileName(model) {
    const safeName = (model.meta.group || "gruppe").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    return `PE-Report-${safeName || "gruppe"}.pdf`;
  }

  function runStorageHealthCheck() {
    const result = {
      storageOk: false,
      workbookOk: false,
      reportOk: false,
      summary: ""
    };

    try {
      const probeKey = `${STORAGE_KEY}-health-probe`;
      window.localStorage.setItem(probeKey, "ok");
      result.storageOk = window.localStorage.getItem(probeKey) === "ok";
      window.localStorage.removeItem(probeKey);
    } catch {
      result.storageOk = false;
    }

    const { data } = getReportData();
    result.workbookOk = Object.keys(data).length > 0;

    try {
      const model = buildReportModel();
      result.reportOk = Boolean(model && model.title && model.sections?.length);
    } catch {
      result.reportOk = false;
    }

    if (result.storageOk && result.workbookOk && result.reportOk) {
      result.summary = "Speicherung und Report-Abzug sind einsatzbereit.";
    } else if (!result.storageOk) {
      result.summary = "Local Storage ist nicht verfuegbar. Der Report-Abzug ist damit nicht verlaesslich.";
    } else if (!result.workbookOk) {
      result.summary = "Es wurden noch keine relevanten Formulardaten gespeichert.";
    } else {
      result.summary = "Die Daten sind gespeichert, aber der Report-Abzug ist noch nicht vollstaendig pruefbar.";
    }

    return result;
  }

  async function generateReportPdf() {
    const model = buildReportModel();
    const jspdfNamespace = window.jspdf;
    if (!jspdfNamespace || !jspdfNamespace.jsPDF) {
      window.alert("PDF-Bibliothek konnte nicht geladen werden.");
      return;
    }

    const { jsPDF } = jspdfNamespace;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const colors = {
      primary: [63, 91, 216],
      text: [23, 32, 51],
      muted: [102, 112, 134],
      line: [221, 227, 238],
      soft: [248, 249, 252]
    };

    function ensureSpace(required = 60) {
      if (y + required <= pageHeight - margin) return;
      doc.addPage();
      y = margin;
    }

    function addWrappedText(text, x, top, width, fontSize, color, lineGap = 5, fontStyle = "normal") {
      doc.setFont("helvetica", fontStyle);
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, width);
      doc.text(lines, x, top);
      return top + (lines.length * (fontSize + lineGap));
    }

    doc.setFillColor(...colors.primary);
    doc.roundedRect(margin, y, contentWidth, 88, 18, 18, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(model.title, margin + 22, y + 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Unternehmen: ${model.meta.company}`, margin + 22, y + 53);
    doc.text(`Zielrolle: ${model.meta.role}`, margin + 22, y + 70);
    doc.text(`Gruppe: ${model.meta.group}`, pageWidth - margin - 180, y + 53);
    y += 110;

    model.sections.forEach((section) => {
      ensureSpace(90);
      doc.setDrawColor(...colors.line);
      doc.setFillColor(...colors.soft);
      doc.roundedRect(margin, y, contentWidth, 32, 12, 12, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...colors.primary);
      doc.text(section.title, margin + 16, y + 21);
      y += 48;

      section.blocks.forEach((block) => {
        ensureSpace(110);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...colors.text);
        doc.text(block.title, margin, y);
        y += 16;

        block.items.forEach((entry) => {
          const text = `${entry.label}: ${entry.content}`;
          ensureSpace(44);
          y = addWrappedText(text, margin, y, contentWidth, 10.5, colors.text, 4);
          y += 8;
        });

        y += 8;
      });
    });

    ensureSpace(80);
    doc.setDrawColor(...colors.line);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.primary);
    doc.text("PE-Massnahmen", margin, y);
    y += 18;

    if (!model.measures.length) {
      y = addWrappedText("Es wurden noch keine PE-Massnahmen ausgewaehlt oder eingetragen.", margin, y, contentWidth, 10.5, colors.muted, 4);
    } else {
      model.measures.forEach((measure, index) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const detailTexts = [
          `Zielbezug: ${measure.goal || "Noch offen"}`,
          measure.note ? `Angaben zur Massnahme: ${measure.note}` : "",
          measure.learningPlace ? `Lernort: ${measure.learningPlace}` : "",
          measure.learningFormat ? `Lernform: ${measure.learningFormat}` : "",
          measure.certification ? `Angestrebte Zertifizierung: ${measure.certification}` : "",
          measure.lengthCost ? `Laenge und Kosten: ${measure.lengthCost}` : ""
        ].filter(Boolean);
        const detailLineCount = detailTexts.reduce((total, text) => total + doc.splitTextToSize(text, contentWidth - 28).length, 0);
        const boxHeight = Math.max(78, 48 + (detailLineCount * 13));
        ensureSpace(boxHeight + 16);
        doc.setFillColor(...colors.soft);
        doc.roundedRect(margin, y, contentWidth, boxHeight, 12, 12, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.setTextColor(...colors.text);
        doc.text(`${index + 1}. ${measure.title}`, margin + 14, y + 18);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Kategorie: ${measure.category || "Noch offen"}`, margin + 14, y + 35);
        doc.text(`Arbeitsintegriert: ${measure.integrated || "Noch offen"}`, margin + 170, y + 35);
        doc.text(`Zeitraum: ${measure.lengthCost || measure.duration || "Noch offen"}`, margin + 360, y + 35);
        let detailY = y + 53;
        detailTexts.forEach((text) => {
          detailY = addWrappedText(text, margin + 14, detailY, contentWidth - 28, 10, colors.text, 3);
          detailY += 5;
        });
        y = detailY;
        y += 12;
      });
    }

    doc.save(generatePdfFileName(model));
  }

  window.ReportUtils = {
    buildReportModel,
    generateReportPdf,
    runStorageHealthCheck,
    loadReportOverrides: loadOverrides,
    saveReportOverrides: saveOverrides
  };
})();
