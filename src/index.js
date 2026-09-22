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

    insertValue("violence-women-year", latest_year);

    // % of 16-year-old girls have experienced violence
    const EXPVLYTHEQ = await readData("EXPVLYTHEQ");
    const EXPVLYTHEQ_stat = "Victims of gender-based violence"
    updateYearSpans(EXPVLYTHEQ, EXPVLYTHEQ_stat);

    insertValue("violence-girl", EXPVLYTHEQ.data[EXPVLYTHEQ_stat][latest_year]["Any type of violence"]["Gender - Female"]);

    insertValue("violence-girl-year", latest_year);

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

    insertValue("sexual-violence-year", latest_year)

    // % of women have experienced domestic abuse
    const EXPDA = await readData("EXPDA");
    const EXPDA_stat = "Victims of domestic abuse";
    updateYearSpans(EXPDA, EXPDA_stat);

    insertValue("domestic-abuse", Math.round(EXPDA.data[EXPDA_stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Female"]));

    insertValue("domestic-abuse-year", latest_year);

    // % of stalking and harrassment victims are female
    const DOMACVAC = await readData("DOMACVAC"); 
    const DOMACVAC_stat = "All domestic abuse crimes"; 
    updateYearSpans(DOMACVAC, DOMACVAC_stat);

    const female_stalking_victims = DOMACVAC.data[DOMACVAC_stat][latest_year]["Female"] ["Stalking and harassment"];
 
    const male_stalking_victims = DOMACVAC.data[DOMACVAC_stat][latest_year]["Male"] ["Stalking and harassment"]; 
  
    const total_stalking_victims = female_stalking_victims + male_stalking_victims;
  
    insertValue( "stalking", Math.round((female_stalking_victims / total_stalking_victims) * 100) );

    insertValue("stalking-year", latest_year)


    // Case processing times - average days to complete
    const INDPRCASEEQ = await readData("INDPRCASEEQ");
    const INDPRCASEEQ_stat = "Average time taken to complete criminal cases";
    updateYearSpans(INDPRCASEEQ, INDPRCASEEQ_stat);

    insertValue("sexual-days", INDPRCASEEQ.data[INDPRCASEEQ_stat][latest_year]["Offence category - Sexual"]);
    insertValue("all-days", INDPRCASEEQ.data[INDPRCASEEQ_stat][latest_year]["Northern Ireland"]);

    insertValue("sexual-days-year", latest_year)

    // women killed by intimate partner
    const DAHVGR = await readData("DAHVGR");
    const DAHVGR_stat = "Domestic abuse homicides";
    updateYearSpans(DAHVGR, DAHVGR_stat);

    let last_5_years = years.slice(-5);
    let domestic_homicicides = 0;
    for (let i = 0; i < 5; i++) {
        domestic_homicicides += DAHVGR.data[DAHVGR_stat][last_5_years[i]]["Female"]["Partner/ex-partner"];
    }

    let year_range = last_5_years[0] + " to " + latest_year;

    insertValue("domestic-homicide", domestic_homicicides);
    insertValue("domestic-homicide-year", year_range)

    const PRCHOM = await readData("PRCHOM"); 
    const PRCHOM_stat = "All homicides";
    updateYearSpans(PRCHOM, PRCHOM_stat);

    let homicide_victims = 0;

    last_5_years = years.slice(-5);

    for (let i = 0; i < 5; i++) {
        homicide_victims += PRCHOM.data[PRCHOM_stat][last_5_years[i]]["All ages"]["Female"];
    }

    year_range = last_5_years[0] + " to " + latest_year;

    insertValue("homicide-victims", homicide_victims);
    insertValue("homicide-year", year_range);

    insertFooter();

})