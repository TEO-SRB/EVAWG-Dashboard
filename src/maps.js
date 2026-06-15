import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js";
import { plotMap } from "./utils/plot-map.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Maps");
    insertHeader();
    insertNavButtons();
    let data = await readData("PRCPD");
    // const da_data = await readData("DOMACLGD");

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        }
    );

    const allCrimesStat = "All crimes recorded by the police";
    const crimeRateStat = "Crime population rate (per 1000 population)";
    const years = Object.keys(data.data[allCrimesStat]);
    const latest_year = years[years.length - 1];

    const recentYears = years.slice(-5);
    let selectedYear = latest_year;

    let lgds = Object.keys(data.data[allCrimesStat][latest_year]);
    const oldKey = "Violence with injury (including homicide & death/serious injury by unlawful driving)";
    const newKey = "Violence with injury";
    for (let i = 0; i < lgds.length; i++) {
        const obj = data.data[allCrimesStat][latest_year][lgds[i]];
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];

        const rateObj = data.data[crimeRateStat][latest_year][lgds[i]];
        rateObj[newKey] = rateObj[oldKey];
        delete rateObj[oldKey];
    }

    const crime_filter = document.getElementById("crime-filter");
    const metricRadios = document.querySelectorAll('input[name="map-metric"]');
    let crime_type = crime_filter.value;
    let mapMetric = document.querySelector('input[name="map-metric"]:checked')?.value || "rate";

    const yearSlider = document.getElementById("year-slider");
    const yearSliderValue = document.getElementById("year-slider-value");

    yearSlider.min = 0;
    yearSlider.max = recentYears.length - 1;
    yearSlider.step = 1;
    yearSlider.value = recentYears.length - 1;
    yearSliderValue.innerText = selectedYear;

    // first draw
    plotMap(data, selectedYear, crime_type, mapMetric, recentYears);

    // redraw when filter changes
    crime_filter.addEventListener("change", (e) => {
        crime_type = e.target.value;
        plotMap(data, selectedYear, crime_type, mapMetric, recentYears);
    });

    metricRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            mapMetric = e.target.value;
            plotMap(data, selectedYear, crime_type, mapMetric, recentYears);
        });
    });

    yearSlider.addEventListener("input", (e) => {
        selectedYear = recentYears[Number(e.target.value)];
        yearSliderValue.innerText = selectedYear;
        plotMap(data, selectedYear, crime_type, mapMetric, recentYears);
    });

    downloadButton("map-card", "PRCPD", update_date, true)

    // Populate info boxes
    populateInfoBoxes(
        ["Definitions", "Source", "What does the data mean?"],
        [
            `<p>The tab presents data on offences as reported through the PSNI Recorded Crime System:</p>
            <ul>
                <li>Sexual offences;</li>
                <li>Stalking and harassment;</li>
                <li>Violence with injury;</li>
                <li>Violence without injury; and</li>
            </ul>
            <p>The location is based on where the offences take place.<br>
            Crime population rates are calculated using the Northern Ireland mid-year population estimates published by NISRA.<br>
            Violence with injury includes homicide and death/serious injury by unlawful driving.</p>`,

            `<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the Police Service of Northern Ireland (PSNI) from the Northern Ireland Statistics and Research Agency (NISRA).</p>
            <p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office’s notable offence list are followed and applied within Northern Ireland.</p>
            <p>The Crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
            <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
            <ul>
                <li><a href="${config.portal_url}table/PRCPD" target="_blank">Police recorded crime and sanction outcomes</a></li>
                <li><a href="${config.portal_url}table/DOMACLGD" target="_blank">Domestic abuse offences</a></li> 
            </ul>
            <p>Statistical publications can be found on the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/police-recorded-crime-statistics" target="_blank">relevant publication page</a>.</p>
            <p><strong>Updates:</strong> Data updated annually each May.</p>`,

            `<p>This tab displays maps showing where offences occurred, based on police recorded crime data.</p>
            <ul>
                <li><strong>What it tells us:</strong> It highlights the geographic location of the offence itself, not where the victim lives. This distinction is important because offences can happen away from home—for example, in public spaces or workplaces.</li>
                <li><strong>Why it matters:</strong> Understanding where offences occur helps identify hotspots and inform targeted prevention efforts, policing strategies, and community safety initiatives.</li>
                <li><strong>How to use it:</strong> Use these maps to guide local interventions, resource deployment, and awareness campaigns in areas with higher recorded incidents.</li>
                <li><strong>Limitations:</strong> Location data reflects where the offence occurred, which may differ from where the victim resides. It can, but does not always, indicate risk for individuals living in that area.</li>
            </ul>`            
        ]
    );

        insertFooter();

});