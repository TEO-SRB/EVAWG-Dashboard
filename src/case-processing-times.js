import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js";
import { createLineChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js"
import { insertExpandButtons } from "./utils/expand-buttons.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Case processing times")
    insertHeader();
    insertNavButtons();
    insertExpandButtons();

    let data = await readData("INDPRCASEEQ");
    let dom_data = await readData("CPTDAC");

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });

    const dom_update_date = new Date(dom_data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });

        // Update values
    const stat = "Average time taken to complete criminal cases";
    const dom_stat = "Median days taken to process";
    const dom_years = Object.keys(dom_data.data[dom_stat]);

    updateYearSpans(data, stat);

    insertValue("sexual-case-processing", data.data[stat][latest_year]["Offence category - Sexual"]);
    insertValue("all-case-processing", data.data[stat][latest_year]["Northern Ireland"]);
    insertValue("domestic-days", dom_data.data[dom_stat][latest_year]["All domestic abuse cases"]);


    // Create line chart
    createLineChart({
        data,
        stat,
        years,
        line_1: ["Northern Ireland"],
        line_2: ["Offence category - Sexual"],
        label_1: "All criminal cases",
        label_2: "Sexual offence cases",
        unit: "Days",
        canvas_id: "case-processing-sexual-line",
    });

     createLineChart({
        data,
        stat,
        years,
        line_1: ["Northern Ireland"],
        line_2: ["Offence category - Sexual"],
        label_1: "All criminal cases",
        label_2: "Sexual offence cases",
        unit: "Days",
        canvas_id: "case-processing-sexual-line-expanded",
    });

    downloadButton("case-processing-sexual-line-capture", "INDPRCASEEQ", update_date)

    

    createLineChart({
        data: dom_data,
        stat: dom_stat,
        years: dom_years,
        line_2: ["All domestic abuse cases"],
        line_1: ["All criminal cases"],
        label_2: "Domestic abuse related cases",
        label_1: "All criminal cases",
        unit: "Days",
        canvas_id: "case-processing-domestic-line",
    });

    createLineChart({
        data: dom_data,
        stat: dom_stat,
        years: dom_years,
        line_2: ["All domestic abuse cases"],
        line_1: ["All criminal cases"],
        label_2: "Domestic abuse related cases",
        label_1: "All criminal cases",
        unit: "Days",
        canvas_id: "case-processing-domestic-line-expanded",
    });

    downloadButton("case-processing-domestic-line-capture", "CPTDAC", dom_update_date)

    // Populate info boxes
       
    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
            `<p>For case processing times data, sexual offence cases are based on cases where the principal offence (main offence) at disposal was a sexual offence. Where an offender is prosecuted or convicted of several offences on the same occasion, only one offence, the principal offence, is counted. Statistical coverage is restricted to those criminal prosecutions which were brought on behalf of the Police Service for Northern Ireland, the National Crime Agency, the Airport Constabulary or Harbour Police.</p>
            <p>For domestic abuse related cases, the average case processing time relates to cases where at least one offence in the case was prosecuted under the Domestic Abuse and Civil Proceedings Act (Northern Ireland) 2021.</p>`,

`<p>The most recent average Case Processing Times for Criminal Cases dealt with in the Crown Court and in magistrates’ courts in Northern Ireland is for cases completed in 2024/25 and refers to the time from which the offence was reported to, or detected by, the police.</p>
<p>This data is based on all court cases – Crown Court, adult magistrates’ court, and youth magistrates’ court.</p>
<p>Average is measured as the median number of days taken, i.e., the number of days at which 50% of those cases included under counting rules has been completed. This is an overview of the time taken for a case to be disposed at court from the date that case began its journey through the criminal justice system, based on a start point of the date the offence was reported to, or detected by, the PSNI.</p>
  <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
    <ul>
        <li><a href="https://data.nisra.gov.uk/table/INDPRCASEEQ" target="_blank">Processing times for criminal cases</a></li>
        <li><a href="${config.portal_url}table/CPTDAC" target="_blank">Processing times for domestic abuse cases</a></li>      
    </ul>
<p>Statistical publications can be found on the relevant publication page:
    <ul>
        <li><a href="https://www.justice-ni.gov.uk/articles/case-processing-times" target="_blank">Criminal cases</a></li>
        <li><a href="https://www.justice-ni.gov.uk/articles/domestic-abuse-prosecutions-convictions-and-case-processing-time-statistics" target="_blank">Domestic abuse cases</a></li>
    </ul>
<p><strong>Updates:</strong> Data updated quarterly. <strong>Last update:</strong> ${update_date}.</p>`,

`<p>This tab shows how long it takes for cases related to violence and abuse to progress through the court system, from initial charge to final outcome.</p>
<ul>
    <li><strong>What it tells us:</strong> It highlights average (median) processing times for different types of cases, giving insight into how quickly justice is delivered.</li>
    <li><strong>Why it matters:</strong> Delays in case processing can impact victims' confidence in the justice system and prolong trauma. Understanding these timelines helps identify where improvements are needed.</li>
    <li><strong>How to use it:</strong> Use this data to inform discussions on court efficiency, resource allocation, and victim support during lengthy proceedings. It can also guide policy aimed at reducing delays.</li>
    <li><strong>Limitations:</strong> Figures reflect completed cases only and may be influenced by, for example, case complexity, availability of court resources, and procedural requirements. They do not capture cases that result in informal resolutions or cases withdrawn before trial.</li>
</ul>`


            
            ]
        );

        insertFooter();

})