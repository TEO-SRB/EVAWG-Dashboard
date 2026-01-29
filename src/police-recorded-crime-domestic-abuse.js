import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { insertValue } from "./utils/insert-value.js";
import { readData } from "./utils/read-data.js";
import { latest_year, updateYearSpans, years } from "./utils/update-years.js";
import { chart_colours, createLineChart, getContrastTextColour, getPct } from "./utils/charts.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { leaderLinePlugin } from "./utils/leader-line-plugin.js";
import { wrapLabel } from "./utils/wrap-label.js";
import { downloadButton } from "./utils/download-button.js";
import { maleComparison } from "./utils/male-comparison.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - Domestice abuse")
    insertHeader();
    insertNavButtons();
    maleComparison();

    const data = await readData("DOMACVAC");
    const stat = "All domestic abuse crimes";

    const trend_data = await readData("DOMACVG");
    const trend_years = Object.keys(trend_data.data[stat]);
    console.log(trend_data)

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
            {
                day: "2-digit", 
                month: "long",
                year: "numeric"
            });

    updateYearSpans(data, stat);

    insertValue("domestic-abuse-female", data.data[stat][latest_year]["Female"]["Total all offences"].toLocaleString());
    insertValue("domestic-abuse-male", data.data[stat][latest_year]["Male"]["Total all offences"].toLocaleString());
    insertValue("violence-injury-female", data.data[stat][latest_year]["Female"]["Violence with injury (inc homicide & death / serious injury by unlawful driving)"].toLocaleString());
    insertValue("violence-injury-male", data.data[stat][latest_year]["Male"]["Violence with injury (inc homicide & death / serious injury by unlawful driving)"].toLocaleString());
    insertValue("violence-no-injury-female", data.data[stat][latest_year]["Female"]["Violence without injury"].toLocaleString());
    insertValue("violence-no-injury-male", data.data[stat][latest_year]["Male"]["Violence without injury"].toLocaleString());
    insertValue("stalking-female", data.data[stat][latest_year]["Female"]["Stalking and harassment"].toLocaleString());
    insertValue("stalking-male", data.data[stat][latest_year]["Male"]["Stalking and harassment"].toLocaleString());

    


     createLineChart({
            data: trend_data,
            stat,
            years: trend_years,
            line_1: ["Female"],
            line_2: ["Male"],
            unit: "Victims",
            canvas_id: "domestic-abuse-line"
        });

        downloadButton("domestic-abuse-line-capture", "DOMACVG", update_date);

        // Populate info boxes
        
    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
        `<p>The <strong>Police Service of Northern Ireland (PSNI)</strong> has adopted the definition of domestic violence and abuse as outlined in the 2016 Northern Ireland Government Strategy <em>“Stopping Domestic and Sexual Violence and Abuse in Northern Ireland”</em> as:</p>
        <p>“Threatening, controlling, coercive behaviour, violence or abuse (psychological, virtual, physical, verbal, sexual, financial or emotional) inflicted on anyone (irrespective of age, ethnicity, religion, gender, gender identity, sexual orientation or any form of disability) by a current or former partner or family member.”</p>`,

        `<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the <strong>Police Service of Northern Ireland (PSNI)</strong> from the <strong>Northern Ireland Statistics and Research Agency (NISRA)</strong>.</p>
        <p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office's notable offence list are followed and applied within Northern Ireland.</p>
        <p>The crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
        <p>This data is available on the <a href="https://ppdata.nisra.gov.uk/table/DOMAC" target="_blank">data portal</a>.</p>
        <p>Related publications can be found via the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/police-recorded-crime-statistics" target="_blank">relevant publication page</a>.</p>
        <p><strong>Updates:</strong> Data updated quarterly. <strong>Last updated:</strong> ${update_date}.</p>`,

        `<p>This tab focuses on incidents flagged as domestic abuse, broken down by sex of victim and type of offence.</p>
        <ul>
            <li><strong>What it tells us:</strong> Domestic abuse is a major component of gender-based violence, with women more frequently recorded as victims, though men are also affected.</li>
            <li><strong>Why it matters:</strong> Highlights the need for tailored support services and prevention strategies within families and relationships.</li>
            <li><strong>How to use it:</strong> Use these figures to inform domestic abuse strategies and training for frontline staff.</li>
            <li><strong>Limitations:</strong> Data depends on police identification and victim disclosure; some cases may not be flagged as domestic abuse.</li>
        </ul>`
            ]
        );
    


    insertFooter();
})