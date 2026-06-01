import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { genderDisplay } from "./utils/gender-display.js";
import { createLineChart, createBarChart, createBarChartData } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js"
import { insertExpandButtons } from "./utils/expand-buttons.js";


window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against girls and boys");
    insertHeader();
    genderDisplay();
    insertNavButtons();
    insertExpandButtons();

    let data = await readData("PRCHOM");
    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
            {
                day: "2-digit", 
                month: "long",
                year: "numeric"
            });
    
    // Update values

    const stat = "All homicides";

    updateYearSpans(data, stat);

    let female_victims = 0;
    let male_victims = 0;  

    for (let i = years.length - 5; i < years.length; i ++) {
        female_victims += data.data[stat][years[i]]["All ages"]["Female"];
        male_victims += data.data[stat][years[i]]["All ages"]["Male"];
    }

    insertValue("victims-female", female_victims);
    insertValue("victims-male",  male_victims);

    const victims_girls = data.data[stat][latest_year]["Under 18 years"]["Female"];
    const victims_boys = data.data[stat][latest_year]["Under 18 years"]["Male"];

    const victims_girls_text = victims_girls == 1 ? "1 female" : `${victims_girls} females`;
    const victims_boys_text = victims_boys == 1 ? "1 male" : `${victims_boys} males`;

    insertValue("victims-girls", victims_girls_text);
    insertValue("victims-boys", victims_boys_text);

    const victims_women = data.data[stat][latest_year]["18+ years"]["Female"];
    const victims_men = data.data[stat][latest_year]["18+ years"]["Male"];
    const victims_women_text = victims_women == 1 ? "1 female" : `${victims_women} females`;
    const victims_men_text = victims_men == 1 ? "1 male" : `${victims_men} males`;

    insertValue("victims-women", victims_women_text);
    insertValue("victims-men", victims_men_text);

    // Line chart - victims under 18

    createLineChart({
        data,
        stat,
        years,
        line_1: ["Under 18 years", "Female"],
        label_1: "Female",
        line_2: ["Under 18 years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "under-18-line"
    });

    createLineChart({
        data,
        stat,
        years,
        line_1: ["Under 18 years", "Female"],
        label_1: "Female",
        line_2: ["Under 18 years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "under-18-line-expanded"
    });

    downloadButton("under-18-line-capture", "PRCHOM", update_date);

    // Line chart - victims 18+

    createLineChart({
        data,
        stat,
        years,
        line_1: ["18+ years", "Female"],
        label_1: "Female",
        line_2: ["18+ years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "18-plus-line"
    });

    createLineChart({
        data,
        stat,
        years,
        line_1: ["18+ years", "Female"],
        label_1: "Female",
        line_2: ["18+ years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "18-plus-line-expanded"
    });

    downloadButton("18-plus-line-capture", "PRCHOM", update_date);

    // Populate info boxes
    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
                `Definitions text`,

                `Source text`,

                `What does the data mean? text`
            
            ]
        );

        insertFooter();



    

                


})