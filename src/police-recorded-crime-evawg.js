import { genderDisplay } from "./utils/gender-display.js";
import { createLineChart, createBarChart, createPRCData } from "./utils/charts.js";
import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { violencePercentage } from "./utils/violence-percentage.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js";
import { insertExpandButtons } from "./utils/expand-buttons.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - EVAWG")
    insertHeader();
    insertNavButtons();
    genderDisplay();
    insertExpandButtons()

    let data = await readData("PRCVCTM");
    let online_data = await readData("PRCONLCG");

    const stat = "All crimes recorded by the police";
    const online_stat = "Total recorded online crime";
    const online_years = Object.keys(online_data.data[online_stat]);

    for (let i = 0; i < online_years.length; i ++) {
        data.data[stat][online_years[i]]["Online offences"] = {"All ages": online_data.data[online_stat][online_years[i]]};
    }

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });
    
    // Update values
    updateYearSpans(data, stat);

    //// Violence with injury
    insertValue("violence-female", violencePercentage(data, stat, latest_year, "Violence with injury (including homicide & death/serious injury by unlawful driving)", "Female"));
    insertValue("violence-male", violencePercentage(data, stat, latest_year, "Violence with injury (including homicide & death/serious injury by unlawful driving)", "Male"));

    //// Violence without injury
    insertValue("without-injury-female", violencePercentage(data, stat, latest_year, "Violence without injury", "Female"));
    insertValue("without-injury-male", violencePercentage(data, stat, latest_year, "Violence without injury", "Male"));

    //// Stalking and harassment
    insertValue("stalking-female", violencePercentage(data, stat, latest_year, "Stalking and harassment", "Female"));
    insertValue("stalking-male", violencePercentage(data, stat, latest_year, "Stalking and harassment", "Male"));

    //// Sexual offences
    insertValue("sex-female", violencePercentage(data, stat, latest_year, "Sexual offences", "Female"));
    insertValue("sex-male", violencePercentage(data, stat, latest_year, "Sexual offences", "Male"));


    

    // Sexual offences line chart
    createLineChart({
        data,
        stat,
        years,
        line_1: ["Sexual offences", "All ages", "Female"],
        label_1: "Female",
        line_2: ["Sexual offences", "All ages", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "sexual-offences-line"
    });

    createLineChart({
        data,
        stat,
        years,
        line_1: ["Sexual offences", "All ages", "Female"],
        label_1: "Female",
        line_2: ["Sexual offences", "All ages", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "sexual-offences-line-expanded"
    });

    downloadButton("sexual-offences-line-capture", "PRCVCTM", update_date);

    // Stalking and harassment line chart
    createLineChart({
        data,
        stat,
        years,
        line_1: ["Stalking and harassment", "All ages", "Female"],
        label_1: "Female",
        line_2: ["Stalking and harassment", "All ages", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "stalking-line"
    });

    createLineChart({
        data,
        stat,
        years,
        line_1: ["Stalking and harassment", "All ages", "Female"],
        label_1: "Female",
        line_2: ["Stalking and harassment", "All ages", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "stalking-line-expanded"
    });

    downloadButton("stalking-line-capture", "PRCVCTM", update_date);
   
    // Create bar chart
    const violence_types = [
        "Violence with injury (including homicide & death/serious injury by unlawful driving)",
        "Violence without injury",
        
    ];

    const chart_data = createPRCData({data, stat, year: latest_year, violence_types});
    
    createBarChart({
        chart_data,
        categories: ["Violence with injury", "Violence without injury"],
        canvas_id: "violence-bar",
        label_format: ","
    });

     createBarChart({
        chart_data,
        categories: ["Violence with injury", "Violence without injury"],
        canvas_id: "violence-bar-expanded",
        label_format: ","
    });

    downloadButton("violence-bar-capture", "PRCVCTM", update_date);

       // Populate info boxes    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
            `<p>The tab presents data on victims of the following offences as reported through the PSNI Recorded Crime System:</p>
<ul>
    <li>Sexual offences;</li>
    <li>Stalking and harassment;</li>
    <li>Violence with injury; and</li>
    <li>Violence without injury;</li>

</ul>
<p>All reported incidents of domestic abuse incidents and crime are reported, with no differentiation between gender-based violence. However, the data is available on the gender of the victim.<br>
Violence with injury includes homicide and death/serious injury by unlawful driving. </p>`,

`<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the Police Service of Northern Ireland (PSNI) from the Northern Ireland Statistics and Research Agency (NISRA).</p>
<p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office's notable offence list are followed and applied within Northern Ireland.</p>
<p>The Crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
 <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
        <ul>
            <li><a href="${config.portal_url}table/PRCVCTM" target="_blank">Police recorded crime - victims of crime</a></li>
            <li><a href="${config.portal_url}table/PRCONLCG" target="_blank">Police recorded crime - online crime</a></li>
        </ul>
<p>Statistical publications can be found on the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/police-recorded-crime-statistics" target="_blank">relevant publication page</a>.</p>
<p><strong>Updates:</strong> Data updated quarterly. <strong>Last update:</strong> ${update_date}.</p>`,

`<p>This tab shows police-recorded offences where the victim's gender is known, including sexual offences, stalking and harassment, and violence with or without injury. These figures help us understand patterns of gender-based violence reported to the police.</p>
<ul>
    <li><strong>What it tells us:</strong> Women remain disproportionately affected by sexual offences and stalking and harassment, while men also experience significant levels of violence, particularly in certain offence categories.</li>
    <li><strong>Why it matters:</strong> These figures underline the importance of early intervention and risk assessment to prevent escalation.</li>
    <li><strong>How to use it:</strong> Use these figures to identify priority areas for prevention and support services. </li>
    <li><strong>Limitations:</strong> These statistics reflect only those crimes reported to police; they do not capture unreported crimes. Data also depends on police recording practices and a victim’s willingness to report to police. Changes in legislation, changes in rules governing crime recording, or reporting campaigns can influence trends so consider these factors when comparing over time. Practitioners should also interpret trends alongside survey data and community insights. <br></li>
Changes in legislation and crime‑recording practices should be considered when interpreting trends in stalking and harassment.
The Protection from Stalking Act (NI) 2022 introduced a new specific stalking offence and an offence of threatening or abusive behaviour from April 2022, increasing identification and reporting.
Between Apr 2018–Apr 2023, Home Office rules required recording both a conduct offence and any additional offence in the same incident, leading to some double‑counting.
From May 2023, this was reversed so that the conduct/behaviour offence is recorded only if it is the most serious offence, contributing to falls seen in 2023/24.<br>
These factors should be taken into account when comparing trends over time.
    <li>In 2022, the PSNI published its first <a href="https://www.psni.police.uk/safety-and-support/keeping-safe/tackling-violence-against-women-and-girls/violence-against-women#:~:text=As%20part%20of%20our%20commitment%20to%20tackling%20VAWG%2C%20we%20launched,from%20fear%2C%20intimidation%20and%20harassment." target=" blank">Tackling Violence against Women and Girls Action Plan</a>, setting out how the force planned to address this issue locally.</li>
    <li>For further detail on how police recorded crime statistics are collected and processed, please refer to the <a href="https://www.psni.police.uk/sites/default/files/2025-11/Police%20Recorded%20Crime%20User%20Guide.pdf" target=" blank">PSNI Recorded Crime User Guide</a>.</li>
</ul>`
            
            ]
        );

        insertFooter();

})