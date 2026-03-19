import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { genderDisplay } from "./utils/gender-display.js";
import { createDAData, createBarChart, createDALast3Data, chart_colours } from "./utils/charts.js";
import { latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { wrapLabel } from "./utils/wrap-label.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js";
import { insertExpandButtons } from "./utils/expand-buttons.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Domestic abuse")
    insertHeader();
    genderDisplay();
    insertNavButtons();
    insertExpandButtons();

    let data = await readData("EXPDA");
    let reported_data = await readData("LDARPG");
    const relationship_data = await readData("DARPV");

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
      {
          day: "2-digit", 
          month: "long",
          year: "numeric"
      });

    const relationship_update_date = new Date(relationship_data.updated).toLocaleDateString("en-GB",
      {
          day: "2-digit", 
          month: "long",
          year: "numeric"
      });

     // Update values
    const stat = "Victims of domestic abuse";
    const relationship_stat = "Percentage of perpetrators";

    updateYearSpans(data, stat);

    insertValue("lifetime-female", data.data[stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Female"]);
    insertValue("lifetime-male",   data.data[stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Male"]);

    insertValue("three-year-female", data.data[stat][latest_year]["Any domestic abuse"]["Recent (last 3 years)"]["Female"]);
    insertValue("three-year-male",   data.data[stat][latest_year]["Any domestic abuse"]["Recent (last 3 years)"]["Male"]);

    insertValue("non-physical-female", data.data[stat][latest_year]["Non-physical abuse"]["Recent (last 3 years)"]["Female"]);
    insertValue("non-physical-male",   data.data[stat][latest_year]["Non-physical abuse"]["Recent (last 3 years)"]["Male"]);

    insertValue("threats-female", data.data[stat][latest_year]["Threats"]["Recent (last 3 years)"]["Female"]);
    insertValue("threats-male",   data.data[stat][latest_year]["Threats"]["Recent (last 3 years)"]["Male"]);

    insertValue("force-female", data.data[stat][latest_year]["Force"]["Recent (last 3 years)"]["Female"]);
    insertValue("force-male",   data.data[stat][latest_year]["Force"]["Recent (last 3 years)"]["Male"]);

    const reported_stat = "Proportion of any lifetime domestic abuse reported to the police";
    const reported_year = Object.keys(reported_data.data[reported_stat]).slice(-1);

    insertValue("reported-female", reported_data.data[reported_stat][reported_year]["Female"]);
    insertValue("reported-male", reported_data.data[reported_stat][reported_year]["Male"]);

    // Create bar charts
    const time_periods = Object.keys(data.data[stat][latest_year]["Any domestic abuse"]);

    const chart_data = createDAData({
        data,
        stat,
        year: latest_year,
        time_periods,
        da_type: "Any domestic abuse"
        });

    createBarChart({
        chart_data,
        categories: time_periods,
        canvas_id: "domestic-abuse-1-bar",
        label_format: "%"
    });

    createBarChart({
        chart_data,
        categories: time_periods,
        canvas_id: "domestic-abuse-1-bar-expanded",
        label_format: "%"
    });

    downloadButton("domestic-abuse-1-bar-capture", "EXPDA", update_date);

    const da_types = ["Non-physical abuse", "Threats", "Force", "Any domestic abuse"];

    const chart_data_2 = createDALast3Data({
        data,
        stat, 
        year: latest_year, 
        da_types
    });
    
    createBarChart({
        chart_data: chart_data_2,
        categories: da_types,
        canvas_id: "domestic-abuse-2-bar",
        label_format: "%"
    });

    createBarChart({
        chart_data: chart_data_2,
        categories: da_types,
        canvas_id: "domestic-abuse-2-bar-expanded",
        label_format: "%"
    }); 

    downloadButton("domestic-abuse-2-bar-capture", "EXPDA", update_date);

    // Third bar chart - Relationship of perpetrator to victim

    // Adjust these for relabelling on chart
    const relationship_labels = {
      "Current husband, wife or civil partner": "Current spouse",
      "Former husband, wife or civil partner": "Former spouse",
      "Someone currently dating or seeing casually": "Current romantic partner",
      "Someone formerly dating or seeing casually": "Former romantic partner",
      "Parent, step parent or foster parent": "Parent"
    }

    const relationship_years = Object.keys(relationship_data.data[relationship_stat]);
    const relationship_year = relationship_years[relationship_years.length - 1];
    
    const year_data = relationship_data.data[relationship_stat][relationship_year];

    const labels_long = Object.keys(year_data);
    let labels = [];

    for (let i = 0; i < labels_long.length; i ++) {
      if (relationship_labels.hasOwnProperty(labels_long[i])) {
        labels.push(relationship_labels[labels_long[i]])
      } else {
        labels.push(labels_long[i])
      }
    }

    const values = Object.values(year_data);

  // If chart_colours is shorter than the number of bars, repeat it
  const colours = labels.map((_, i) => chart_colours[i % chart_colours.length]);

  const ctx = document.getElementById("domestic-abuse-3-bar").getContext("2d");

  const relationship_config = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: `${relationship_data.label} (${relationship_year})`,
          data: values,
          backgroundColor: colours,
          borderWidth: 0
        }
      ]
    },
    options: {
      indexAxis: "y",              // <-- horizontal
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: "end",
          align: "right",
          formatter: (v) => {
            return `${v}%`;
          },
          color: "#000",
          clamp: true
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.x}` // <-- horizontal bar uses x for value
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: Math.ceil((Math.max(...values) + 5) / 10) * 10,
          ticks: {
            stepSize: 10,
          },
          title: {
            display: true,
            text: "% of victims"
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            callback: function (value) {
              const label = this.getLabelForValue(value);
              return wrapLabel(label, 20); // <-- same wrapping as your function
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  }

  new Chart(ctx, relationship_config);

  const ctx_expand = document.getElementById("domestic-abuse-3-bar-expanded").getContext("2d");

  new Chart(ctx_expand, relationship_config);

  downloadButton("domestic-abuse-3-bar-capture", "DARPV", relationship_update_date);


   // Populate info boxes

   let relationship_definitions = "";
   for (let i = 0; i < Object.keys(relationship_labels).length; i++) {
    relationship_definitions += `<li><strong>${Object.values(relationship_labels)[i]}</strong> groups relationships that were recorded as "${Object.keys(relationship_labels)[i]}".</li>`;
   }

    
  populateInfoBoxes(
    ["Definitions", "Source", "What does the data mean?"],
    [
    `<p>As part of the introduction to the module, respondents were advised of the government's definition of domestic violence and abuse, that is: 'threatening, controlling, coercive behaviour, violence or abuse (psychological, virtual, physical, verbal, sexual, financial or emotional) inflicted on anyone (irrespective of age, ethnicity, religion, gender, gender identity, sexual orientation or any form of disability) by a current or former intimate partner or family member.'</p>
    <p>Personal experiences of domestic violence and abuse were subdivided into three main offence groups: non-physical abuse; threats; and force. To reflect the fact that people's circumstances, lifestyles, and thus, associated levels of risk of domestic abuse change over time it is important to examine the experience of domestic abuse both in recent years and over a lifetime.</p>
    <p><strong>Non-physical abuse:</strong> Prevented you from having your fair share of the household money or taken money from you, controlled how household work or childcare was done, enforced rules or activities which humiliated you, repeatedly put you down so you felt worthless, kept track of where you went or how you spent your time, monitored your mail, calls, emails, texts or social media, stopped you from seeing friends and/or relatives.</p>
    <p><strong>Threats:</strong> Threatened to hurt someone close to you (your children, family members, friends, or pets), threatened to hurt your current/previous partner, threatened to hurt you, threatened to kill you.</p>
    <p><strong>Force:</strong> Bullied or intimidated you, pressurised or tried to pressurise you to have sex or take part in another sexual activity when you didn't want to, pressurised you to view material which you considered to be pornography, threatened to kill or attempted to kill themselves as a way of making you do something, threatened to, attempted to, or actually hurt themselves as a way of making you do something, used some kind of force against you (choking, kicking, biting, pushing, slapping), used a weapon against you.</p>
    <p><strong>Relationship of perpetrator:</strong>  For ease of presentation in the chart above the following relationship types have been shortened:</p>
    <ul>${relationship_definitions}</ul>`,

    `<p>This section presents findings from the 2018/19 <strong>Northern Ireland Safe Community Survey (NISCS)</strong>. The NISCS (previously known as the Northern Ireland Crime Survey) is a representative, continuous, personal interview survey of the experiences and perceptions of crime, of adults living in private households throughout Northern Ireland.</p>
    <p>A self-completion module capturing respondents' experiences of domestic abuse, was asked as part of the NISCS in 2018-19. The findings below relate to the 2,135 respondents aged between 16 and 74 years, who completed the domestic abuse module.</p>
    <p>The survey has adopted the definition of domestic abuse as outlined in the Northern Ireland Government Strategy 'Stopping Domestic and Sexual Violence and Abuse in Northern Ireland'.</p>
    <p>Two measures of domestic abuse are adopted: lifetime; and the last three years. Lifetime prevalence is a good indicator of the percentage of NISCS respondents who have experienced domestic abuse at some point in their lives since age 16.</p>
  <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
        <ul>
            <li><a href="${config.portal_url}table/EXPDA" target="_blank">Experience of domestic abuse</a></li>
            <li><a href="${config.portal_url}table/LDARPG" target="_blank">Lifetime domestic abuse reported to the police</a></li>
            <li><a href="${config.portal_url}table/DARPV" target="_blank">Domestic abuse - relationship of perpetrator to victim</a></li>        
        </ul>
    <p>Statistical publications can be found on the <a href="https://www.justice-ni.gov.uk/sites/default/files/publications/justice/experience%20of%20domestic%20abuse%20findings%20from%20the%20201819%20niscs.pdf" target="_blank">relevant publication page</a>.</p>
    <p><strong>Updates:</strong> NA</p>`,

    `<p>This tab provides an overview of how common domestic abuse is, based on self-reported experiences from survey respondents.</p>
    <ul>
        <li><strong>What it tells us:</strong> It shows the proportion of people who say they have experienced domestic abuse, offering insight into the scale of the issue beyond what is reported to authorities.</li>
        <li><strong>Why it matters:</strong> Understanding prevalence helps practitioners gauge the hidden burden of domestic abuse and plan services accordingly. It highlights that many cases remain unreported, reinforcing the need for proactive outreach and support.</li>
        <li><strong>How to use it:</strong> Use these figures to inform policy development, prevention strategies, and resource allocation for victim support. They can also guide awareness campaigns aimed at encouraging reporting and help-seeking.</li>
        <li><strong>Limitations:</strong> Self-reported data can be affected by stigma or reluctance to disclose, so actual prevalence may be higher. Interpret these figures alongside administrative data for a complete picture.</li>
    </ul>`          
    ]
  );

  insertFooter();

})