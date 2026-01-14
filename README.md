# EVAWG Dashboard

A static dashboard presenting indicators related to **Ending Violence Against Women and Girls (EVAWG)** in Northern Ireland. Built with HTML, modular JavaScript, and R for data preparation.

> **Audience:** This guide is written for novice developers who can run basic commands and edit files but may be new to modular JavaScript and R-backed data workflows.

---

## 1. Overview
This dashboard provides interactive charts, maps, and summary statistics to monitor gender-based violence indicators. Data is sourced from official NISRA datasets and preprocessed using R.

---

## 2. Folder Structure
```
repo-root/
├── assets/                # CSS, images, icons
├── public/                # Data and map styles
│   ├── data/data.json     # Preprocessed data for charts
│   └── map/               # GeoJSON and map style
├── src/                   # JavaScript source
│   ├── utils/             # Reusable helper functions
│   ├── *.js               # Page-specific scripts
│   └── r/data.R           # R script for data preparation
├── *.html                 # Dashboard pages
└── 99-teo-evawg-dashboard.Rproj # RStudio project file
```

---

## 3. How Modularisation Works
Each HTML page loads a **corresponding JS module**:
```html
<script type="module" src="src/violence-against-women-and-men.js"></script>
```
The JS module:
- Imports shared helpers from `src/utils/`
- Fetches data from `public/data/data.json`
- Builds charts/maps and wires up interactions

---

## 4. Worked Example: Violence Against Women and Men Page

### HTML Highlights
- Dynamic header and footer placeholders:
```html
<banner id="banner"></banner>
<nav id="nav"></nav>
<footer id="footer"></footer>
```
- Main content includes:
  - Cards showing key percentages
  - Charts for prevalence and trends
  - Info boxes for definitions and sources

### JS Highlights
Imports utilities:
```js
import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js";
import { maleComparison } from "./utils/male-comparison.js";
import { createLineChart, createBarChartData, createBarChart } from "./utils/charts.js";
import { updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
```

Fetches data and updates DOM:
```js
let data = await readData("EXPVLADEQ");
updateYearSpans(data, "Adult victims of gender-based violence");
insertValue("violence-female", 100 - types_data.data[types_stat][latest_year]["No forms of violence"]["Female"]);
```

Creates charts:
```js
createBarChart({ chart_data, categories: violence_types, canvas_id: "prevalence-nilt-bar", label_format: "%" });
createLineChart({ data, stat, years, line_1: ["Physical violence", "Gender - Female"], line_2: ["Physical violence", "Gender - Male"], canvas_id: "prevalence-nilt-line" });
```

Populates info boxes:
```js
populateInfoBoxes(["Definitions", "Source", "What does the data mean?"], [htmlContent1, htmlContent2, htmlContent3]);
```

---

## 5. Getting Started (Recommended Workflow)

### Install VS Code
Download from [Visual Studio Code](https://code.visualstudio.com/).

### Clone the Repo in VS Code
- Open VS Code → `View > Command Palette` → `Git: Clone`
- Paste the repo URL:
```
https://github.com/NISRA-Tech-Lab/99-teo-evawg-dashboard.git
```

### Install Live Server Extension
- In VS Code, go to Extensions → Search for **Live Server** → Install.

### Run the Dashboard
- Open `index.html` in VS Code.
- Click **Go Live** (bottom-right corner).
- The site will open in your browser with auto-refresh on changes.

---

## 6. Data Preparation (`data.R`)
Run in RStudio:
```r
source("src/r/data.R")
```
This regenerates `public/data/data.json` from NISRA PxStat API.

---

## 7. Adding a New Page or Chart
1. Duplicate an existing HTML file.
2. Create a matching JS module in `src/`.
3. Import utilities and fetch data:
```js
import { readData } from './utils/read-data.js';
import { createBarChart } from './utils/charts.js';
```
4. Link the JS in your HTML:
```html
<script type="module" src="src/new-page.js"></script>
```

---

## 8. Utilities Reference (`src/utils/`)
Each file in `src/utils/` provides reusable helpers:
- **charts.js**: Chart creation functions (`createLineChart`, `createBarChart`).
- **read-data.js**: Loads preprocessed JSON data.
- **update-years.js**: Updates year spans in DOM.
- **insert-value.js**: Inserts values into elements.
- **info-boxes.js**: Builds accordion-style info boxes.
- **male-comparison.js**: Toggles gender views.
- **page-layout.js**: Inserts header, footer, and navigation.
- **plot-map.js**: Renders interactive maps.
- **load-shapes.js**: Fetches GeoJSON shapes.
- **leader-line-plugin.js**: Adds leader lines to pie charts.
- **violence-percentage.js**: Calculates gender-based violence percentages.
- **wrap-label.js**: Wraps long chart labels.
- **get-nested.js**: Safely accesses nested object properties.
- **get-selected-gender.js**: Reads selected gender from radio buttons.

---

## 9. Accessibility & Best Practices
- Use **high-contrast colours** (`getContrastTextColour()` helps).
- Add **ARIA roles** for interactive elements.
- Ensure charts have **text alternatives** for screen readers.
- Test responsiveness on mobile and desktop.

---

## 10. License
© Crown Copyright. Consider adding an Open Government Licence (OGL) notice if applicable.

---
