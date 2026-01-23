import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createLineChart, createBarChart, createBarChartData } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";


window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against girls and boys");
    insertHeader();
    maleComparison();
    insertNavButtons();

    let data = await readData("EXPVLYTHEQ");
    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
            {
                day: "2-digit", 
                month: "long",
                year: "numeric"
            });
    
    // Update values

    const stat = "Victims of gender-based violence";

    updateYearSpans(data, stat);

    insertValue("violence-girl", 100 - data.data[stat][latest_year]["No violence"]["Gender - Female"]);
    insertValue("violence-boy",  100 - data.data[stat][latest_year]["No violence"]["Gender - Male"]);

    insertValue("online-girl", data.data[stat][latest_year]["Online violence"]["Gender - Female"]);
    insertValue("online-boy",  data.data[stat][latest_year]["Online violence"]["Gender - Male"]);
    insertValue("sexual-girl", data.data[stat][latest_year]["Sexual violence"]["Gender - Female"]);
    insertValue("sexual-boy",  data.data[stat][latest_year]["Sexual violence"]["Gender - Male"]);

    insertValue("psychological-girl", data.data[stat][latest_year]["Psychological violence"]["Gender - Female"]);
    insertValue("psychological-boy",  data.data[stat][latest_year]["Psychological violence"]["Gender - Male"]);

    insertValue("physical-girl", data.data[stat][latest_year]["Physical violence"]["Gender - Female"]);
    insertValue("physical-boy",  data.data[stat][latest_year]["Physical violence"]["Gender - Male"]);

    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "No violence");

    const chart_data = createBarChartData({data, stat, year: latest_year, categories: violence_types});
    
    createBarChart({
        chart_data,
        categories: violence_types,
        canvas_id: "prevalence-ylt-bar",
        label_format: "%"
    });

    downloadButton("prevalence-ylt-bar-capture", "EXPVLYTHEQ", update_date);

    // Create line chart
    createLineChart({
            data,
            stat,
            years,
            line_1: ["No violence", "Gender - Female"],
            line_2: ["No violence", "Gender - Male"],
            canvas_id: "prevalence-ylt-line"
        });

    // Populate info boxes
        
    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
            `<p>The <strong>Young Life and Times (YLT) Survey</strong> defines gender-based violence as “violence, abuse and harm directed against a person because of that person’s gender, or violence that affects people of a particular gender disproportionately.”</p>
<ul>
    <li><strong>Physical Violence:</strong> Being beaten, slapped, pushed, or restrained.</li>
    <li><strong>Sexual Violence:</strong> Upskirting, unwanted touching, or being coerced into sexual acts.</li>
    <li><strong>Psychological Violence:</strong> Being insulted, stalked, harassed, controlled against your will, or threatened with violence.</li>
    <li><strong>Online Violence:</strong> Receiving threats online or via social media, online trolling, or being sent or asked for intimate images against your will.</li>
</ul>`,

`<p>The <strong>Young Life and Times (YLT) Survey</strong> records the attitudes and opinions of 16-year-olds in Northern Ireland about the issues that concern them. It is a representative annual survey that has been running since 2003.</p>
<p>To assess experiences of, and attitudes to, violence against women and girls, The Executive Office (TEO) sponsored the inclusion of relevant questions in the YLT survey from 2023.</p>
<p>The survey is completed online between April and May each year. Due to demand for questions, the survey is split into two versions; the version containing the Violence Against Women and Girls (VAWG) module is completed by approximately 1,000 16-year-olds annually.</p>
<p>This data is available on the <a href="https://ppdata.nisra.gov.uk/table/EXPVLYTHEQ" target="_blank">NISRA Data Portal</a>.</p>
<p>Related publications can be found via the <a href="https://www.executiveoffice-ni.gov.uk/topics/ending-violence-against-women-and-girls-evawg" target="_blank">relevant publication page</a>.</p>
<p><strong>Updates:</strong> Data updated annually. <strong>Last update:</strong> ${update_date}.</p>`,

`<p>This tab presents findings from the Young Life and Times survey, capturing the views and experiences of young people in Northern Ireland regarding violence and abuse.</p>
<ul>
    <li><strong>What it tells us:</strong> It highlights how young people perceive issues such as domestic abuse, coercive control, and gender-based violence, and whether they have experienced these behaviours themselves. These insights reveal emerging patterns and attitudes among younger age groups.</li>
    <li><strong>Why it matters:</strong> Early attitudes can shape future behaviours. Understanding young people’s experiences and beliefs helps identify risks and opportunities for prevention before harmful norms become entrenched.</li>
    <li><strong>How to use it:</strong> Use this data to inform education programmes, awareness campaigns, and safeguarding policies in schools and youth settings. It can guide interventions that promote healthy relationships and challenge harmful behaviours.</li>
    <li><strong>Limitations:</strong> Responses are self-reported and may understate sensitive experiences due to stigma or reluctance to disclose. Figures should be considered alongside qualitative research and other sources for a fuller picture.</li>
</ul>`
            
            ]
        );

        insertFooter();



    

                


})