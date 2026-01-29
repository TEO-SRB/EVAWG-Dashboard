export let years;
export let first_year;
export let latest_year;

export function updateYearSpans(data, stat) {
    years = Object.keys(data.data[stat]);
    first_year = years[0];
    latest_year = years[years.length - 1];

    const first_year_spans = document.getElementsByClassName("first-year");
    for (let i = 0; i < first_year_spans.length; i ++) {
        first_year_spans[i].textContent = first_year;
    }

    const year_spans = document.getElementsByClassName("latest-year");
    for (let i = 0; i < year_spans.length; i ++) {
        year_spans[i].textContent = latest_year;
    }
}