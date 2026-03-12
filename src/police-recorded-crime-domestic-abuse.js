import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { insertValue } from "./utils/insert-value.js";
import { readData } from "./utils/read-data.js";
import { latest_year, updateYearSpans } from "./utils/update-years.js";
import { createLineChart, createBarChart } from "./utils/charts.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { genderDisplay } from "./utils/gender-display.js";
import { config } from "./config/config.js";
import { insertExpandButtons } from "./utils/expand-buttons.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - Domestice abuse")
    insertHeader();
    insertNavButtons();
    genderDisplay();
    insertExpandButtons();

    const data = await readData("DOMACVAC");
    const stat = "All domestic abuse crimes";

    const trend_data = await readData("DOMACVG");
    const trend_years = Object.keys(trend_data.data[stat]);

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
            {
                day: "2-digit", 
                month: "long",
                year: "numeric"
            });

    updateYearSpans(trend_data, stat);

    insertValue("domestic-abuse-female", trend_data.data[stat][latest_year]["Female"].toLocaleString());
    insertValue("domestic-abuse-male", trend_data.data[stat][latest_year]["Male"].toLocaleString());
    insertValue("violence-injury-female", data.data[stat][latest_year]["Female"]["Violence with injury (inc homicide & death / serious injury by unlawful driving)"].toLocaleString());
    insertValue("violence-injury-male", data.data[stat][latest_year]["Male"]["Violence with injury (inc homicide & death / serious injury by unlawful driving)"].toLocaleString());
    insertValue("violence-no-injury-female", data.data[stat][latest_year]["Female"]["Violence without injury"].toLocaleString());
    insertValue("violence-no-injury-male", data.data[stat][latest_year]["Male"]["Violence without injury"].toLocaleString());
    insertValue("stalking-female", data.data[stat][latest_year]["Female"]["Stalking and harassment"].toLocaleString());
    insertValue("stalking-male", data.data[stat][latest_year]["Male"]["Stalking and harassment"].toLocaleString());  

    // Charts

    // Line chart
     createLineChart({
            data: trend_data,
            stat,
            years: trend_years,
            line_1: ["Female"],
            line_2: ["Male"],
            unit: "Victims",
            canvas_id: "domestic-abuse-line"
        });

    createLineChart({
            data: trend_data,
            stat,
            years: trend_years,
            line_1: ["Female"],
            line_2: ["Male"],
            unit: "Victims",
            canvas_id: "domestic-abuse-line-expanded"
        });

        downloadButton("domestic-abuse-line-capture", "DOMACVG", update_date);

        // Bar chart
        const KEEP_KEYS = new Set([
                "Violence with injury",
                "Violence without injury",
                "Stalking and harassment",
                "Sexual offences"
            ]);

        const sexes = ["Female", "Male"];

        let chart_data = {};
        let categories = [];

        for (let i = 0; i < sexes.length; i ++) {
            const bars = Object.entries(data.data[stat][latest_year][sexes[i]])
                .filter(([key]) => key !== "Total all offences")
                .map(([key, value]) => {
                    if (key.startsWith("Violence with injury")) {
                    return ["Violence with injury", value];
                    }
                    return [key, value];
                })
                .reduce((acc, [key, value]) => {
                    const v = Number(value) || 0; // defensive: ensure numeric
                    if (KEEP_KEYS.has(key)) {
                        acc[key] = (acc[key] || 0) + v;
                    } else {
                        acc["All other offences"] = (acc["All other offences"] || 0) + v;
                    }
                    return acc;
                }, {});

            chart_data[sexes[i].toLowerCase()] = Object.values(bars);
            categories = Object.keys(bars);
        }
        
        createBarChart({
            chart_data,
            categories,
            canvas_id: "domestic-abuse-bar",
            label_format: ","
        })

        createBarChart({
            chart_data,
            categories,
            canvas_id: "domestic-abuse-bar-expanded",
            label_format: ","
        })

        downloadButton("domestic-abuse-bar-capture", "DOMACVG", update_date);

        // Populate info boxes    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
        `<p>The <strong>Police Service of Northern Ireland (PSNI)</strong> has adopted the definition of domestic violence and abuse as outlined in the 2016 Northern Ireland Government Strategy <em>“Stopping Domestic and Sexual Violence and Abuse in Northern Ireland”</em> as:</p>
        <p>“Threatening, controlling, coercive behaviour, violence or abuse (psychological, virtual, physical, verbal, sexual, financial or emotional) inflicted on anyone (irrespective of age, ethnicity, religion, gender, gender identity, sexual orientation or any form of disability) by a current or former partner or family member.”</p>`,

        `<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the <strong>Police Service of Northern Ireland (PSNI)</strong> from the <strong>Northern Ireland Statistics and Research Agency (NISRA)</strong>.</p>
        <p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office's notable offence list are followed and applied within Northern Ireland.</p>
        <p>The crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
        <p>The time series chart 'Victims of domestic abuse crimes, 2004/05 to ${latest_year}' includes victims of all ages. However, the bar chart 'Adult victims of domestic abuse crimes ${latest_year}, by crime type' only includes adult victims (18+).</p>
        <p>In the bar chart titled 'Adult victims of domestic abuse crimes ${latest_year}, by crime type', the category 'All other offences' includes the PSNI crime types: <em>Theft (inc burglary), Criminal damage,</em> and <em>All other offences.</em></p>
        <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
        <ul>
            <li><a href="${config.portal_url}table/DOMACVAC" target="_blank">Domestic abuse crimes</a> - by victim gender and offence type</li>
            <li><a href="${config.portal_url}table/DOMACVG" target="_blank">Domestic abuse crimes</a> - by victim gender</li>      
        </ul>
        <p>Related publications can be found via the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/domestic-abuse-statistics" target="_blank">relevant publication page</a>.</p>
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