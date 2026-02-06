import { insertHeader, insertFooter, insertHead } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js";
import { insertValue } from "./utils/insert-value.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Home");
    insertHeader();

    // Insert values into homepage cards
    const EXPVAS = await readData("EXPVAS");
    const EXPVAS_stat = "Adult victims of violence";
    updateYearSpans(EXPVAS, EXPVAS_stat);

    insertValue("violence-women", 100 - EXPVAS.data[EXPVAS_stat][latest_year]["No forms of violence"]["Female"]);   

    // % of 16-year-old girls have experienced violence
    const EXPVLYTHEQ = await readData("EXPVLYTHEQ");
    const EXPVLYTHEQ_stat = "Victims of gender-based violence"
    updateYearSpans(EXPVLYTHEQ, EXPVLYTHEQ_stat);

    insertValue("violence-girl", EXPVLYTHEQ.data[EXPVLYTHEQ_stat][latest_year]["Any type of violence"]["Gender - Female"]);

    // % of victims of sexual offences are women
    const PRCVCTM = await readData("PRCVCTM");
    const PRCVCTM_stat = "All crimes recorded by the police";
    updateYearSpans(PRCVCTM, PRCVCTM_stat);

    const sex_victims = PRCVCTM.data[PRCVCTM_stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["All persons"];

    const female_sex_victims = PRCVCTM.data[PRCVCTM_stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["Female"];

    insertValue("sexual-violence", Math.round(female_sex_victims / sex_victims * 100));

    // % of women have experienced domestic abuse
    const EXPDA = await readData("EXPDA");
    const EXPDA_stat = "Victims of domestic abuse";
    updateYearSpans(EXPDA, EXPDA_stat);

    insertValue("domestic-abuse", Math.round(EXPDA.data[EXPDA_stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Female"])
);

    // % of stalking and harrassment victims are female
    const DOMACVAC = await readData("DOMACVAC"); 
    const DOMACVAC_stat = "All domestic abuse crimes"; 
    updateYearSpans(DOMACVAC, DOMACVAC_stat);

const female_stalking_victims = DOMACVAC.data[DOMACVAC_stat][latest_year]
 ["Female"] ["Stalking and harassment"];
 
 const male_stalking_victims = DOMACVAC.data[DOMACVAC_stat][latest_year]
  ["Male"] ["Stalking and harassment"]; 
  
  const total_stalking_victims = female_stalking_victims + male_stalking_victims;
  
  insertValue( "stalking", Math.round((female_stalking_victims / total_stalking_victims) * 100) );


    // Case processing times - average days to complete
    const INDPRCASEEQ = await readData("INDPRCASEEQ");
    const INDPRCASEEQ_stat = "Average time taken to complete criminal cases";
    updateYearSpans(INDPRCASEEQ, INDPRCASEEQ_stat);

    insertValue("sexual-days", INDPRCASEEQ.data[INDPRCASEEQ_stat][latest_year]["Offence category - Sexual"]);
    insertValue("all-days", INDPRCASEEQ.data[INDPRCASEEQ_stat][latest_year]["Northern Ireland"]);

    function mapResizeHandler() {

        const first_card_body = document.querySelectorAll(".card-body")[0];
        const map_img = document.getElementById("map-img");
    
        map_img.height = first_card_body.clientHeight;
        map_img.width = map_img.naturalWidth / map_img.naturalHeight * map_img.height;

        if (map_img.width > first_card_body.clientWidth) {
            map_img.width = first_card_body.clientWidth;
            map_img.height = map_img.naturalHeight / map_img.naturalWidth * map_img.width;
        }

    }

    // women killed by intimate partner
    const DAHVGR = await readData("DAHVGR");
    const DAHVGR_stat = "Domestic abuse homicides";
    updateYearSpans(DAHVGR, DAHVGR_stat);

    const last_5_years = years.slice(-5);
    let domestic_homicicides = 0;
    for (let i = 0; i < 5; i++) {
        domestic_homicicides += DAHVGR.data[DAHVGR_stat][last_5_years[i]]["Female"]["Partner/ex-partner"];
    }

    insertValue("domestic-homicide", domestic_homicicides);

    // Initial resize
    mapResizeHandler();

    // Resize on window resize
    window.addEventListener("resize", mapResizeHandler);
    
    insertFooter();

})