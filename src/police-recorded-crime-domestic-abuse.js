import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { insertValue } from "./utils/insert-value.js";
import { readData } from "./utils/read-data.js";
import { latest_year, updateYearSpans, years } from "./utils/update-years.js";
import { chart_colours, createLineChart, getContrastTextColour, getPct } from "./utils/charts.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { leaderLinePlugin } from "./utils/leader-line-plugin.js";
import { wrapLabel } from "./utils/wrap-label.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - Domestice abuse")
    insertHeader();
    insertNavButtons();

    const data = await readData("DOMAC");
    const stat = "All domestic abuse crimes";
    updateYearSpans(data, stat);

    insertValue("domestic-abuse-count", data.data[stat][latest_year]["Total crime (domestic abuse motivation)"].toLocaleString());
    insertValue("violence-with-injury-count", data.data[stat][latest_year]["Violence with injury (including homicide and death or serious injury-unlawful driving)"].toLocaleString());
    insertValue("violence-no-injury-count", data.data[stat][latest_year]["Violence without injury"].toLocaleString());

    let pie_values = data.data[stat][latest_year];

    const KEEP_KEYS = new Set([
    "Violence with injury",
    "Violence without injury",
    "Stalking and harassment",
    "Sexual offences"
    ]);

    pie_values = Object.entries(pie_values)
    // remove totals
    .filter(([key]) => !key.toLowerCase().includes("total"))
    // shorten the violence-with-injury label
    .map(([key, value]) => {
        if (key.startsWith("Violence with injury")) {
        return ["Violence with injury", value];
        }
        return [key, value];
    })
    // group everything else into "All other offences"
    .reduce((acc, [key, value]) => {
        const v = Number(value) || 0; // defensive: ensure numeric
        if (KEEP_KEYS.has(key)) {
        acc[key] = (acc[key] || 0) + v;
        } else {
        acc["All other offences"] = (acc["All other offences"] || 0) + v;
        }
        return acc;
    }, {});

    const pie_labels = Object.keys(pie_values);
    const pie_data = Object.values(pie_values);

    const ctx = document.getElementById('domestic-abuse-pie').getContext('2d');

    new Chart(ctx, {
    type: "pie",
    data: {
        labels: pie_labels,
        datasets: [{
        data: pie_data,
        backgroundColor: chart_colours,
        borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
        legend: { position: "bottom" },

        tooltip: {
            callbacks: {
            label: function (context) {
                const value = context.raw;
                const dataArr = context.dataset.data;
                const pct = getPct(value, dataArr).toFixed(1);
                return `${pct}%`;
            }
            }
        },

        datalabels: {
          font: {
            size: 14,
          },
  formatter: (value, context) => {
    const dataArr = context.dataset.data.map(v => Number(v) || 0);
    const total = dataArr.reduce((s, v) => s + v, 0);
    const pct = total ? (Number(value) / total) * 100 : 0;

    if (pct <= 5) return null; // hide if <= 5%

    const label =
      context.chart.data.labels[context.dataIndex] || "";

    return [
      ...wrapLabel(label, 15),          // wrapped label lines
      `${pct.toFixed(1)}%`              // percentage on its own line
    ];
  },

  // keep your existing inside / outside logic unchanged
  anchor: (context) => {
    const dataArr = context.dataset.data;
    const value = Number(dataArr[context.dataIndex]) || 0;
    const total = dataArr.reduce((s, v) => s + v, 0);
    const pct = total ? (value / total) * 100 : 0;
    return pct < 10 ? "end" : "center";
  },

  align: (context) => {
    const dataArr = context.dataset.data;
    const value = Number(dataArr[context.dataIndex]) || 0;
    const total = dataArr.reduce((s, v) => s + v, 0);
    const pct = total ? (value / total) * 100 : 0;
    return pct < 10 ? "end" : "center";
  },

  offset: (context) => {
    const dataArr = context.dataset.data;
    const value = Number(dataArr[context.dataIndex]) || 0;
    const total = dataArr.reduce((s, v) => s + v, 0);
    const pct = total ? (value / total) * 100 : 0;
    return pct < 10 ? 14 : 0;
  },

  color: (context) => {
    const dataArr = context.dataset.data;
    const value = Number(dataArr[context.dataIndex]) || 0;
    const total = dataArr.reduce((s, v) => s + v, 0);
    const pct = total ? (value / total) * 100 : 0;

    if (pct < 10) return "#000"; // outside labels
    const bg = context.dataset.backgroundColor?.[context.dataIndex];
    return getContrastTextColour(bg);
  },

  textAlign: "center",
  clamp: false,
  clip: false
},

        // options for the leaderLinePlugin (registered above)
        leaderLinePlugin: {
            datasetIndex: 0,
            color: "#666",
            lineWidth: 1,
            offset: 14
        }
        }
    },
    plugins: [ChartDataLabels, leaderLinePlugin]
    });


     createLineChart({
            data,
            stat,
            years,
            line_1: ["Total crime (domestic abuse motivation)"],
            line_2: ["Violence against the person offences (Total)"],
            label_1: "All domestic abuse",
            label_2: "Violence against the person",
            unit: "Incidents",
            canvas_id: "domestic-abuse-line"
        });

        // Populate info boxes
        const update_date = new Date(data.updated).toLocaleDateString("en-GB",
            {
                day: "2-digit", 
                month: "long",
                year: "numeric"
            });
    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
        `<p>The <strong>Police Service of Northern Ireland (PSNI)</strong> has adopted the definition of domestic violence and abuse as outlined in the 2016 Northern Ireland Government Strategy <em>“Stopping Domestic and Sexual Violence and Abuse in Northern Ireland”</em> as:</p>
        <p>“Threatening, controlling, coercive behaviour, violence or abuse (psychological, virtual, physical, verbal, sexual, financial or emotional) inflicted on anyone (irrespective of age, ethnicity, religion, gender, gender identity, sexual orientation or any form of disability) by a current or former partner or family member.”</p>`,

        `<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the <strong>Police Service of Northern Ireland (PSNI)</strong> from the <strong>Northern Ireland Statistics and Research Agency (NISRA)</strong>.</p>
        <p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office’s notable offence list are followed and applied within Northern Ireland.</p>
        <p>The crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
        <p>This data is available on the <a href="https://ppdata.nisra.gov.uk/table/DOMAC" target="_blank">data portal</a>.</p>
        <p>Related publications can be found via the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/police-recorded-crime-statistics" target="_blank">relevant publication page</a>.</p>
        <p><strong>Updates:</strong> Data updated quarterly. <strong>Last updated:</strong> ${update_date}.</p>`,

        `<p>This tab focuses on incidents flagged as domestic abuse, broken down by sex of victim and type of offence.</p>
        <ul>
            <li><strong>What it tells us:</strong> Domestic abuse is a major component of gender-based violence, with women more frequently recorded as victims, though men are also affected.</li>
            <li><strong>Why it matters:</strong> Highlights the need for tailored support services and prevention strategies within families and relationships.</li>
            <li><strong>How to use it:</strong> Use these figures to inform domestic abuse strategies and training for frontline staff.</li>
            <li><strong>Limitations:</strong> Data depends on police identification and victim disclosure; some cases may not be flagged as domestic abuse.</li>
        </ul>`
            ]
        );
    


    insertFooter();
})