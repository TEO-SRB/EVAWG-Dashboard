    
import { wrapLabel } from "./wrap-label.js";
import { getSelectedGender } from "./get-selected-gender.js";
import { getNested } from "./get-nested.js";

export const chart_colours = ["#3878c5", "#00205B", "#68A41E", "#732777", "#ce70d2", "#434700", "#a88f8f", "#3b3b3b", "#e64791", "#400b23"];

export function createLineChart({data, stat, years, line_1, line_2, label_1 = "Female", label_2 = "Male", unit = "%", canvas_id}) {

    const line_canvas = document.getElementById(canvas_id);

    let line_values = [];
    let female_values = [];
    let male_values = [];

    for (let i = 0; i < years.length; i++) {
        const base = data.data[stat][years[i]];   // start point for that year

        if (line_1.includes("No violence") || line_1.includes("No forms of violence")) {
            female_values.push(100 - getNested(base, line_1));
            male_values.push(100 - getNested(base, line_2));
        } else {
            female_values.push(getNested(base, line_1));
            male_values.push(getNested(base, line_2));
        }
    }    

    line_values.push({axis: "y",
        label: label_1,
        data: female_values,
        fill: false,
        backgroundColor: chart_colours[0],
        borderColor: chart_colours[0],
        borderWidth: 2
    });

    line_values.push({axis: "y",
        label: label_2,
        data: male_values,
        fill: false,
        backgroundColor: chart_colours[1],
        borderColor: chart_colours[1],
        borderWidth: 2
    });


    const line_data = {
        labels: years,
        datasets: line_values
    };

    const config_line = {
        type: 'line',
        data: line_data,
        options: {
            maintainAspectRatio: false,   // let the canvas size control the chart
            layout: {
                padding: {
                    right: 40             // extra room for end labels
                }
            },
            scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
              tooltip: {
                callbacks: {
                    label: function (context) {
                    const value = context.raw;
                    if (unit === "%") {
                      return `${value}%`;
                    } else {
                      return Number(value).toLocaleString();
                    }
                }
            }
            }
        }
    }};

    const ctx_line = line_canvas.getContext('2d');
    const line_chart = new Chart(ctx_line, config_line);

    const gender_form = document.getElementById("gender-form");
    if (gender_form) {
        let selectedGender = getSelectedGender(); 

        const datasetsForSelection = (sel) => {
            if (sel === "female") return [line_values[0]];
            if (sel === "male") return [line_values[1]];
            return [line_values[0], line_values[1]]; // "both" / default
        };

        line_chart.data.datasets = datasetsForSelection(selectedGender);
        line_chart.update();

        gender_form.addEventListener("change", function () {
            selectedGender = getSelectedGender(); 
            line_chart.data.datasets = datasetsForSelection(selectedGender);
            line_chart.update();
        });
    }

}

export function createBarChart({ chart_data, categories, canvas_id, label_format }) {
  const bar_canvas = document.getElementById(canvas_id);

  const makeDataset = (gender) => ({
    axis: "y",
    label: `${gender === "female" ? "Female" : "Male"}`,
    data: gender === "female" ? chart_data.female : chart_data.male,
    fill: false,
    backgroundColor: gender === "female" ? chart_colours[0] : chart_colours[1],
    borderWidth: 1
  });

  const baseOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    layout: { padding: { right: 40 } },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "right",
        formatter: (v) => {
          if (label_format === "%") return `${v}%`;
          if (label_format === ",") return Number(v).toLocaleString();
          return v;
        },
        color: "#000",
        clamp: true
      }
    },
    scales: {
      x: { beginAtZero: true },
      y: {
        grid: { display: false },
        ticks: {
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return wrapLabel(label, 18);
          }
        }
      }
    }
  };

  function datasetsForSelection(sel) {
    if (sel === "female") return [makeDataset("female")];
    if (sel === "male") return [makeDataset("male")];
    return [makeDataset("female"), makeDataset("male")]; // "both" / default
  }

  // initial chart
  const ctx = bar_canvas.getContext("2d");
  let selectedGender = getSelectedGender();

  const bar_chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: datasetsForSelection(selectedGender)
    },
    options: baseOptions,
    plugins: [ChartDataLabels]
  });

  const gender_form = document.getElementById("gender-form");

  // IMPORTANT: replace datasets (so legend updates), then redraw
  gender_form.addEventListener("change", function () {
    selectedGender = getSelectedGender();

    bar_chart.data.datasets = datasetsForSelection(selectedGender);

    // clears + re-renders with new legend items
    bar_chart.update();
  });

  return bar_chart;
}


export function createBarChartData({data, stat, year, categories}) {   

    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < categories.length; i ++) {
        let female_key = Object.keys(data.data[stat][year][categories[i]]).filter(x => x.includes("Female"));
        let male_key = Object.keys(data.data[stat][year][categories[i]]).filter(x => x.includes("Male"));
        female_bars.push(data.data[stat][year][categories[i]][female_key]);
        male_bars.push(data.data[stat][year][categories[i]][male_key]);
    }

    return {female: female_bars,
            male: male_bars};    

}

export function createPRCData ({data, stat, year, violence_types}) {   

    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < violence_types.length; i ++) {
             female_bars.push(data.data[stat][year]
                [violence_types[i]]
                ["All ages"]["Female"]);
            male_bars.push(data.data[stat][year]
                [violence_types[i]]
                ["All ages"]["Male"]);
    }

    return {female: female_bars,
            male: male_bars};    

}

// Domestic abuse specific functions
// 
export function createDAData({data, stat, year, time_periods, da_type}) {   

    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < time_periods.length; i ++) {
             female_bars.push(data.data[stat][year][da_type]
                [time_periods[i]]
                ["Female"]);
            male_bars.push(data.data[stat][year][da_type]
                [time_periods[i]]
                ["Male"]);
    }

    return {female: female_bars,
            male: male_bars};    

}

export function createDALast3Data({data, stat, year, da_types}) {   

    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < da_types.length; i ++) {
             female_bars.push(data.data[stat][year][da_types[i]]
                [["Recent (last 3 years)"]]
                ["Female"]);
            male_bars.push(data.data[stat][year][da_types[i]]
                [["Recent (last 3 years)"]]
                ["Male"]);
    }

    return {female: female_bars,
            male: male_bars};    

}

function parseColourToRgb(color) {
  if (!color) return { r: 0, g: 0, b: 0 };

  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };

  // fallback (named colors etc.)
  return { r: 0, g: 0, b: 0 };
}

function relLuminance({ r, g, b }) {
  const srgb = [r, g, b].map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

// Relative luminance -> pick black/white for readability
export function getContrastTextColour(bgColor) {
  const rgb = parseColourToRgb(bgColor);
  const L = relLuminance(rgb);

  const contrastWhite = (1.0 + 0.05) / (L + 0.05);
  const contrastBlack = (L + 0.05) / 0.05;

  return contrastBlack >= contrastWhite ? "#000" : "#fff";
}

export function getPct(value, datasetData) {
  const total = datasetData.reduce((sum, v) => sum + Number(v || 0), 0);
  return total ? (Number(value || 0) / total) * 100 : 0;
}






