import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js"
import { genderDisplay } from "./utils/gender-display.js";
import { createLineChart, createBarChartData, createBarChart } from "./utils/charts.js";
import { latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js"

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against women and men");
    insertHeader();
    genderDisplay();
    insertNavButtons();
    
    let data = await readData("EXPVLADEQ");    
    let age_data = await readData("EXPGBVAG");

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });

    const age_update_date = new Date(age_data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });
    

    // Update values
    const stat = "Adult victims of gender-based violence";
    const age_stat = "Adult victims of violence";
    
    updateYearSpans(data, stat);
    const age_years = Object.keys(age_data.data[age_stat]);
    const latest_age_year = age_years.slice(-1);
    
    insertValue("violence-female", age_data.data[age_stat][latest_age_year]["All ages"]["Female"]);    
    insertValue("violence-male", age_data.data[age_stat][latest_age_year]["All ages"]["Male"]);    

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

    downloadButton("prevalence-nilt-bar-capture", "EXPVLADEQ", update_date);

    
    const age_groups = ["Age 18-29", "Age 30+"];

    const age_chart_data = {
        "female": [
            age_data.data[age_stat][latest_age_year]["Age 18-29"]["Female"],
            age_data.data[age_stat][latest_age_year]["Age 30+"]["Female"]
        ],
        "male": [
            age_data.data[age_stat][latest_age_year]["Age 18-29"]["Male"],
            age_data.data[age_stat][latest_age_year]["Age 30+"]["Male"]
        ]
    }

    createBarChart({
        chart_data: age_chart_data,
        categories: age_groups,
        canvas_id: "age-group-nilt-bar",
        label_format: "%"
    });

    downloadButton("age-group-nilt-bar-capture", "EXPGBVAG", age_update_date);    

    // Create line chart
    createLineChart({
            data: age_data,
            stat: age_stat,
            years: age_years,
            line_1: ["All ages", "Female"],
            line_2: ["All ages", "Male"],
            canvas_id: "prevalence-nilt-line"
        });

    downloadButton("prevalence-nilt-line-capture", "EXPGBVAG", age_update_date);

    // Populate info boxes
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
        <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
        <ul>
            <li><a href="${config.portal_url}table/EXPVLADEQ" target="_blank">Experience of gender-based violence - adults</a> - by violence type and equality group</li>
            <li><a href="${config.portal_url}table/EXPGBVAG" target="_blank">Experience of gender-based violence - adults</a> - by victim age and victim gender</li>
        </ul>
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