import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js";
import { maleComparison } from "./utils/male-comparison.js";
import { readData } from "./utils/read-data.js";
import { createLineChart, createBarChartData, createBarChart  } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Homicides");
    insertHeader();
    insertNavButtons();
    maleComparison();
    let data = await readData("DAHVAG");

    // Update values
    const stat = "Domestic abuse homicides";

    updateYearSpans(data, stat);

    const last_5_years = years.splice(-5);

    let women_last_5 = 0;
    let men_last_5 = 0;
    for (let i = 0; i < 5; i++) {
        women_last_5 += data.data[stat][last_5_years[i]]["18+ years"]["Female"];
        men_last_5 += data.data[stat][last_5_years[i]]["18+ years"]["Male"];
    }


     insertValue("homicide-box1-female", women_last_5);
     insertValue("homicide-box1-male", men_last_5);
     insertValue("homicide-box2-female", data.data[stat][latest_year]["18+ years"]["Female"]);
     insertValue("homicide-box2-male", data.data[stat][latest_year]["18+ years"]["Male"]);
     insertValue("homicide-box3-girl", data.data[stat][latest_year]["Under 18 years"]["Female"]);
     insertValue("homicide-box3-boy", data.data[stat][latest_year]["Under 18 years"]["Male"]);

    // Create bar chart
    const age_groups = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "All ages");

    const chart_data = createBarChartData({data, stat, year: latest_year, categories: age_groups});
    
    createBarChart({
        chart_data,
        categories: age_groups,
        canvas_id: "homicide-bar",
    });
    
    // Create line chart
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
            `<p>PSNI does not maintain a distinct formal definition of "domestic homicide." Instead, they classify a homicide as domestic when it involves a domestic motivation, meaning the victim and perpetrator had an intimate (current or former) or familial relationship. 
PSNI’s broader definition of domestic abuse (which informs their classification of domestic violence and homicide) includes:
Threatening, controlling, coercive behaviour, violence or abuse (psychological, virtual, physical, verbal, sexual, financial or emotional) inflicted on anyone by a current or former intimate partner or family member.
Therefore, if a homicide arises within that relationship context (partner or family) and stems from behaviours aligned with domestic abuse it is recorded as a domestic-motivated homicide.

</p>`,

`<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the Police Service of Northern Ireland (PSNI) from the Northern Ireland Statistics and Research Agency (NISRA).</p>
<p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office’s notable offence list are followed and applied within Northern Ireland.</p>
<p>The crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
<p>This data is available on the <a href="https://ppdata.nisra.gov.uk/table/PRCHOM" target="_blank">NISRA Data Portal</a>.</p>
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