import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js";
import { genderDisplay } from "./utils/gender-display.js";
import { readData } from "./utils/read-data.js";
import { createLineChart, createBarChart  } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js"

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police Recorded Crime - Domestic homicides");
    insertHeader();
    insertNavButtons();
    genderDisplay();
    
    let data = await readData("DAHVAG");
    let relationship_data = await readData("DAHVGR");

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });

    // Update values
    const stat = "Domestic abuse homicides";

    updateYearSpans(data, stat);

    const last_5_years = years.slice(-5);

    let women_last_5 = 0;
    let men_last_5 = 0;
    let women_partner_last_5 = 0;
    let men_partner_last_5 = 0;
    for (let i = 0; i < 5; i++) {
        women_last_5 += data.data[stat][last_5_years[i]]["All ages"]["Female"];
        men_last_5 += data.data[stat][last_5_years[i]]["All ages"]["Male"];
        women_partner_last_5 += relationship_data.data[stat][last_5_years[i]]["Female"]["Partner/ex-partner"];
        men_partner_last_5 += relationship_data.data[stat][last_5_years[i]]["Male"]["Partner/ex-partner"];
    }

    const female_victim_under_18 = data.data[stat][latest_year]["Under 18 years"]["Female"];
    const male_vicitm_under_18 = data.data[stat][latest_year]["Under 18 years"]["Male"];
    let female_victim_under_18_string;
    let male_vicitm_under_18_string;
    if (female_victim_under_18 === 1) {
        female_victim_under_18_string = "1 female";
    } else {
        female_victim_under_18_string = `${female_victim_under_18} females`;
    }

    if (male_vicitm_under_18 === 1) {
        male_vicitm_under_18_string = "1 male";
    } else {
        male_vicitm_under_18_string = `${male_vicitm_under_18} males`;
    }

     insertValue("homicide-box-1-female", women_last_5);
     insertValue("homicide-box-1-male", men_last_5);
     insertValue("homicide-box-2-female", women_partner_last_5);
     insertValue("homicide-box-2-male", men_partner_last_5);
     insertValue("homicide-box-3-female", data.data[stat][latest_year]["18+ years"]["Female"]);
     insertValue("homicide-box-3-male", data.data[stat][latest_year]["18+ years"]["Male"]);
     insertValue("homicide-box-4-girl", female_victim_under_18_string);
     insertValue("homicide-box-4-boy", male_vicitm_under_18_string);

    // Create bar chart
    const relationship_types = Object.keys(relationship_data.data[stat][latest_year].Female);

    const chart_data = {
        "female": Object.values(relationship_data.data[stat][latest_year].Female),
        "male": Object.values(relationship_data.data[stat][latest_year].Male),
    }

    createBarChart({
        chart_data,
        categories: relationship_types,
        canvas_id: "homicide-bar",
    });

    downloadButton("homicide-bar-capture", "DAHVGR", update_date);
   
    
    // Create under 18 line chart
    createLineChart({
        data,
        stat,
        years,
        line_1: ["Under 18 years", "Female"],
        label_1: "Female",
        line_2: ["Under 18 years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "under-18-homicide-line"
    });

    downloadButton("under-18-homicide-line-capture", "DAHVAG", update_date);

    // Create 18+ line chart
    createLineChart({
        data,
        stat,
        years,
        line_1: ["18+ years", "Female"],
        label_1: "Female",
        line_2: ["18+ years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "18-plus-homicide-line"
    });

    downloadButton("18-plus-homicide-line-capture", "DAHVAG", update_date);

       // Populate info boxes    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
            `<p>PSNI does not maintain a distinct formal definition of "domestic homicide." Instead, they classify a homicide as domestic when it involves a domestic motivation, meaning the victim and perpetrator had an intimate (current or former) or familial relationship. 
PSNI's broader definition of domestic abuse (which informs their classification of domestic violence and homicide) includes:
Threatening, controlling, coercive behaviour, violence or abuse (psychological, virtual, physical, verbal, sexual, financial or emotional) inflicted on anyone by a current or former intimate partner or family member.
Therefore, if a homicide arises within that relationship context (partner or family) and stems from behaviours aligned with domestic abuse it is recorded as a domestic-motivated homicide.

</p>`,

`<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the Police Service of Northern Ireland (PSNI) from the Northern Ireland Statistics and Research Agency (NISRA).</p>
<p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office's notable offence list are followed and applied within Northern Ireland.</p>
<p>The crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
 <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
        <ul>
            <li><a href="${config.portal_url}table/DAHVAG" target="_blank">Domestic abuse homicides recorded</a> - by victim age and gender</li>
            <li><a href="${config.portal_url}table/DAHVGR" target="_blank">Domestic abuse homicides recorded</a> - by victim gender and relationship of victim to offender</li>
        </ul>
<p>Statistical publications can be found on the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/police-recorded-crime-statistics" target="_blank">relevant publication page</a>.</p>
<p><strong>Updates:</strong> Data updated quarterly. <strong>Last update:</strong> ${update_date}.</p>`,

`<p>This tab presents data on homicide victims by sex, including cases linked to domestic abuse.</p>
<ul>
    <li><strong>What it tells us:</strong> Homicide is rare but represents the most severe outcome of gender-based violence. Women are disproportionately victims in domestic-related cases.</li>
    <li><strong>Why it matters:</strong> These figures underline the importance of early intervention and risk assessment to prevent escalation.</li>
    <li><strong>How to use it:</strong> Incorporate insights into high-risk case management and multi-agency safeguarding approaches.</li>
    <li><strong>Limitations:</strong> Small numbers mean trends should be interpreted cautiously.</li>
</ul>`
            
            ]
        );

        insertFooter();
    
})