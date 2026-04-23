# Workintegrated Learning Software

Interaktive Seminar-Anwendung fuer eine arbeitsintegrierte Personalentwicklungsaufgabe im Hochschulkontext.

Die Anwendung fuehrt Gruppen durch drei Arbeitsblaetter:

- Persona und Zielrolle analysieren
- Bedarfsanalyse mit Wollen, Koennen, Duerfen
- PE-Ticket und arbeitsintegrierte Massnahmen entwickeln

Am Ende koennen die Eingaben in einem Report gesichtet und als PDF exportiert werden. Zusaetzlich gibt es einen ausgefuellten Pflege-Beispielreport sowie verlinkte Bewerbungsunterlagen fuer den Musterfall.

## Funktionen

- Mehrseitige HTML-Anwendung ohne Build-Schritt
- Burger-Navigation fuer alle Unterseiten
- Speicherung der Eingaben im Local Storage
- Report-Seite mit bearbeitbaren Inhalten
- PDF-Export des Reports per jsPDF
- Auswahl und Pflege eigener PE-Massnahmen
- Statischer Pflege-Beispielreport
- Verlinkte Beispiel-Dokumente aus dem Ordner `Bewerbungsunterlagen`

## Projektstruktur

- `index.html`: Startseite, Navigation und Dokumentenzugriff
- `arbeitsblatt-1.html`: Persona und Zielrolle
- `arbeitsblatt-2.html`: Bedarfsanalyse
- `arbeitsblatt-3.html`: PE-Ticket und Massnahmen
- `report.html`: Eigener Report
- `pflege-report.html`: Ausgefuellter Beispielreport
- `seminar-anleitung.html`: Dozierendenansicht
- `script.js`: Interaktion, Local Storage, Massnahmenlogik
- `report.js`: Rendern und Bearbeiten des Reports
- `report-utils.js`: Report-Modell und PDF-Export
- `styles.css`: Gemeinsames Styling

## Lokal starten

Die Anwendung ist statisch und kann mit einem einfachen lokalen Server gestartet werden.

```bash
cd /Users/florian/Unternehmensorganisation/seminar-preview
python3 -m http.server 8000
```

Danach im Browser oeffnen:

```text
http://127.0.0.1:8000/
```

## Hinweise

- Die Arbeitsdaten liegen im Browser-Local-Storage.
- Fuer den PDF-Export wird `jsPDF` ueber ein CDN geladen.
- Die PDF-Dokumente auf der Startseite verweisen auf lokale Dateien per `file://`.

## Beispielmaterial

Die zugehoerigen Beispiel-Dokumente liegen in:

```text
/Users/florian/Unternehmensorganisation/Bewerbungsunterlagen
```

Enthalten sind aktuell:

- `Lebenslauf.pdf`
- `Arbeitszeugnis.pdf`
- `Kompetenzprofil.pdf`
- `Zeugnis der Fachhochschulreife.pdf`
