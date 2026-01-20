import { maleComparison } from "./utils/male-comparison.js";
import { createLineChart, createBarChart, createPRCData } from "./utils/charts.js";
import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { violencePercentage } from "./utils/violence-percentage.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - EVAWG")
    insertHeader();
    insertNavButtons();
    maleComparison();
    let data = await readData("PRCVCTM");
    
    // Update values
    const stat = "All crimes recorded by the police";

    updateYearSpans(data, stat);

    //// Violence against the person
    insertValue("violence-female", violencePercentage(data, stat, latest_year, ["Violence with injury (including homicide & death/serious injury by unlawful driving)", "Violence without injury"], "Female"));
    insertValue("violence-male", violencePercentage(data, stat, latest_year, ["Violence with injury (including homicide & death/serious injury by unlawful driving)", "Violence without injury"], "Male"));

    //// Stalking and harassment
    insertValue("stalking-female", violencePercentage(data, stat, latest_year, "Stalking and harassment", "Female"));
    insertValue("stalking-male", violencePercentage(data, stat, latest_year, "Stalking and harassment", "Male"));

    //// Sexual offences
    insertValue("sex-female", violencePercentage(data, stat, latest_year, "Sexual offences", "Female"));
    insertValue("sex-male", violencePercentage(data, stat, latest_year, "Sexual offences", "Male"));
    //// Online violence
    insertValue("online-female", "X");
    insertValue("online-male", "X");

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
   
    // Create bar chart
    const violence_types = [
        "Violence with injury (including homicide & death/serious injury by unlawful driving)",
        "Violence without injury"
    ];

    const chart_data = createPRCData({data, stat, year: latest_year, violence_types});
    
    createBarChart({
        chart_data,
        categories: ["Violence with injury", "Violence without injury"],
        canvas_id: "violence-bar",
        label_format: ","
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
            `<p>The tab presents data on victims of the following offences as reported through the PSNI Recorded Crime System:</p>
<ul>
    <li>Sexual offences;</li>
    <li>Violence against the person;</li>
    <li>Stalking and harassment; and</li>
    <li>Online crime.</li>
</ul>
<p>All reported incidents of domestic abuse incidents and crime are reported, with no differentiation between gender-based violence. However, the data is available on the sex of the victim.</p>`,

`<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the Police Service of Northern Ireland (PSNI) from the Northern Ireland Statistics and Research Agency (NISRA).</p>
<p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office's notable offence list are followed and applied within Northern Ireland.</p>
<p>The Crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
<p>This data is available on the <a href="https://ppdata.nisra.gov.uk/table/PRCVCTM" target="_blank">NISRA Data Portal</a>.</p>
<p>Statistical publications can be found on the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/police-recorded-crime-statistics" target="_blank">relevant publication page</a>.</p>
<p><strong>Updates:</strong> Data updated quarterly. <strong>Last update:</strong> ${update_date}.</p>`,

`<p>This tab shows police-recorded offences where the victim's sex is known, including sexual offences, stalking, and violent crimes with or without injury. These figures help us understand patterns of gender-based violence reported to the police.</p>
<ul>
    <li><strong>What it tells us:</strong> Women remain disproportionately affected by sexual offences and domestic violence, while men also experience significant levels of violence, particularly in certain offence categories.</li>
    <li><strong>Why it matters:</strong> These statistics reflect reported incidents only. They do not capture unreported cases, which research suggests are substantial, especially for sexual offences. Practitioners should interpret trends alongside survey data and community insights.</li>
    <li><strong>How to use it:</strong> Use these figures to identify priority areas for prevention and support services. For example, spikes in stalking or sexual offences may indicate emerging risks requiring targeted interventions.</li>
    <li><strong>Limitations:</strong> Data depends on police recording practices and victim willingness to report. Changes in legislation or reporting campaigns can influence trends, so consider these factors when comparing over time.</li>
    <li>In 2022, the PSNI published its first <a href="https://www.psni.police.uk/safety-and-support/keeping-safe/tackling-violence-against-women-and-girls/violence-against-women#:~:text=As%20part%20of%20our%20commitment%20to%20tackling%20VAWG%2C%20we%20launched,from%20fear%2C%20intimidation%20and%20harassment." target=" blank">Tackling Violence against Women and Girls Action Plan</a>, setting out how the force planned to address this issue locally.</li>
</ul>`
            
            ]
        );

        insertFooter();

})