export function violencePercentage (data, stat, latest_year, type, sex) {

    let victims = 0;
    let sex_victims = 0;

    if (!Array.isArray(type)) type = [type];

    for (type of type) {
        victims += data.data[stat][latest_year]
            [type]
            ["All ages"]["All persons"];

        sex_victims += data.data[stat][latest_year]
            [type]
            ["All ages"][sex];
    }

    return(Math.round(sex_victims / victims * 100));

}