import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createLineChart, createBarChartData, createBarChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against women and men");
    insertHeader();
    maleComparison();
    insertNavButtons();
    let data = await readData("EXPVLADEQ");    
    let types_data = await readData("EXPVAS");
    

    // Update values
    const stat = "Adult victims of gender-based violence";
    const types_stat = "Adult victims of violence";
    
    updateYearSpans(data, stat);

    insertValue("violence-female", 100 - types_data.data[types_stat][latest_year]["No forms of violence"]["Female"]);    
    insertValue("violence-male", 100 - types_data.data[types_stat][latest_year]["No forms of violence"]["Male"]);    

    insertValue("economic-female", data.data[stat][latest_year]["Economic violence"]["Gender - Female"]);
    insertValue("economic-male", data.data[stat][latest_year]["Economic violence"]["Gender - Male"]);

    insertValue("sexual-female", data.data[stat][latest_year]["Sexual violence"]["Gender - Female"]);
    insertValue("sexual-male", data.data[stat][latest_year]["Sexual violence"]["Gender - Male"]);
    insertValue("physical-female", data.data[stat][latest_year]["Physical violence"]["Gender - Female"]);
    insertValue("physical-male", data.data[stat][latest_year]["Physical violence"]["Gender - Male"]);

    insertValue("psychological-female", data.data[stat][latest_year]["Psychological violence"]["Gender - Female"]);
    insertValue("psychological-male", data.data[stat][latest_year]["Psychological violence"]["Gender - Male"]);

    insertValue("online-female", data.data[stat][latest_year]["Online violence"]["Gender - Female"]);
    insertValue("online-male", data.data[stat][latest_year]["Online violence"]["Gender - Male"]);
    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "Other types of violence")

    const chart_data = createBarChartData({data, stat, year: latest_year, categories: violence_types});

    createBarChart({
        chart_data,
        categories: violence_types,
        canvas_id: "prevalence-nilt-bar",
        label_format: "%"
    });
    
    const types_years = Object.keys(types_data.data[types_stat]);

    // Create line chart
    // createLineChart({
    //         data: types_data,
    //         stat: types_stat,
    //         years: types_years,
    //         line_1: ["No forms of violence", "Female"],
    //         line_2: ["No forms of violence", "Male"],
    //         canvas_id: "prevalence-nilt-line"
    //     });

    // Place holder chart - remove after demonstration on 06/01/2026
      createLineChart({
            data,
            stat,
            years,
            line_1: ["Physical violence", "Gender - Female"],
            line_2: ["Physical violence", "Gender - Male"],
            canvas_id: "prevalence-nilt-line"
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
        `<p>The <strong>Northern Ireland Life and Times (NILT) Survey</strong> defines gender-based violence as "violence directed against a person because of that person's gender, or violence that affects people of a particular gender disproportionately. It does not only relate to physical assaults but also includes words and actions that can cause someone to feel afraid, anxious or humiliated."</p>
        <ul>
            <li><strong>Physical Violence:</strong> Being beaten, slapped, pushed, kicked, choked, restrained, a weapon or any other force being used against you in a way that causes harm.</li>
            <li><strong>Sexual Violence:</strong> Being forced or coerced into having sex against your will or into sexual practices or acts you didn't want to engage in, including unwanted attempted sex and sexual acts, or being choked or restrained.</li>
            <li><strong>Psychological Violence:</strong> Being insulted, stalked, harassed, threatened, humiliated, denigrated or controlled against your will.</li>
            <li><strong>Economic Violence:</strong> Someone controlling your finances and spending and other resources against your will.</li>
            <li><strong>Online Violence:</strong> Receiving threats online or via social media, online trolling, or being sent or being asked for intimate images against your will.</li>
        </ul>`,

        `<p>The <strong>Northern Ireland Life and Times (NILT) Survey</strong> records the attitudes, values, and beliefs of adults to a wide range of social policy issues.  This annual survey has been running since 1998 and is administered by ARK. ARK is Northern Ireland's social policy hub and is made up of academics across QUB and Ulster University.</p>
        <p>Its mission is to monitor the attitudes and behaviour of people in Northern Ireland annually to provide a time-series and a public record of how our attitudes and behaviour develop on a wide range of social policy issues. </p>
        <p>Fieldwork for the NILT survey is carried out between September and January with approximately 1,200 respondents aged 18 years or over, interviewed annually. </p>
        <p>The Violence Against Women and Girls (VAWG) module of NILT is sponsored by The Executive Office.</p>
        <p>This data is available on the <a href="https://ppdata.nisra.gov.uk/table/EXPVLADEQ" target="_blank">NISRA Data Portal</a>.</p>
        <p>Statistical publications relating to the EVAWG stragegy can be found on the <a href="https://www.executiveoffice-ni.gov.uk/topics/ending-violence-against-women-and-girls-evawg" target="_blank">Executive Office website</a>.</p>
        <p><strong>Updates:</strong> Data updated annually. <strong>Last update:</strong> ${update_date}.</p>`,

        `<p>This tab presents findings from the Northern Ireland Life and Times survey, capturing self-reported experiences of violence and abuse among women and men.</p>
        <ul>
            <li><strong>What it tells us:</strong> These figures reflect people's own accounts of experiences like domestic abuse, sexual violence, and coercive control. They provide insight into the prevalence of gender-based violence beyond what is reported to authorities.</li>
            <li><strong>Why it matters:</strong> Survey data helps uncover the hidden picture—many victims do not report incidents to the police. Understanding these patterns is crucial for designing prevention strategies and support services.</li>
            <li><strong>How to use it:</strong> Use these insights to identify gaps between reported and actual experiences, and to inform outreach, education, and policy development. They can guide resource allocation for services that address underreported forms of abuse.</li>
            <li><strong>Limitations:</strong> Self-reported data can be influenced by recall bias or reluctance to disclose sensitive experiences. Figures should be interpreted alongside administrative data for a fuller picture.</li>
        </ul>`
        
        ]
    );

    insertFooter();

})