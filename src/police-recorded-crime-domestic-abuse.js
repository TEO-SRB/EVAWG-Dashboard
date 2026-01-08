import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { insertValue } from "./utils/insert-value.js";
import { readData } from "./utils/read-data.js";
import { latest_year, updateYearSpans, years } from "./utils/update-years.js";
import { chart_colours, createLineChart } from "./utils/charts.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - Domestice abuse")
    insertHeader();
    insertNavButtons();

    const data = await readData("DOMAC");
    const stat = "All domestic abuse crimes";
    updateYearSpans(data, stat);

    console.log(data.data[stat][latest_year]);

    insertValue("domestic-abuse-count", data.data[stat][latest_year]["Total crime (domestic abuse motivation)"].toLocaleString());
    insertValue("violence-with-injury-count", data.data[stat][latest_year]["Violence with injury (including homicide and death or serious injury-unlawful driving)"].toLocaleString());
    insertValue("violence-no-injury-count", data.data[stat][latest_year]["Violence without injury"].toLocaleString());

    let pie_values = data.data[stat][latest_year];
    
    pie_values = Object.fromEntries(
        Object.entries(pie_values)
            .filter(([key]) => !key.toLowerCase().includes("total"))
            .map(([key, value]) => {
            if (key.startsWith("Violence with injury")) {
                return ["Violence with injury", value];
            }
            return [key, value];
            })
    );



    const pie_labels = Object.keys(pie_values);
    const pie_data = Object.values(pie_values);

    const ctx = document.getElementById('domestic-abuse-pie').getContext('2d');

    new Chart(ctx, {
    type: 'pie',
    data: {
        labels: pie_labels,
        datasets: [{
        data: pie_data,
        backgroundColor: chart_colours,
        borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                    const value = context.raw;

                    // Get all values in this dataset
                    const data = context.dataset.data;
                    const total = data.reduce((sum,val) => sum + val, 0);

                    const percentage = ((value / total) * 100).toFixed(1);

                    return `${percentage}%`;
                    }
                }
            }
        }
    }
    })
    ;

     createLineChart({
            data,
            stat,
            years,
            line_1: ["Total crime (domestic abuse motivation)"],
            line_2: ["Violence against the person offences (Total)"],
            label_1: "All domestic abuse",
            label_2: "Violence against the person",
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
            ``,
            ``,
            ``
            ]
        );
    


    insertFooter();
})