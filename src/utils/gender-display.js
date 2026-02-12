import { getSelectedGender } from "./get-selected-gender.js";

export function genderDisplay () {

  const male_comparison_switch = document.getElementById("male-comparison-switch");

  male_comparison_switch.innerHTML = `
  <div class="row justify-content-end">
  <div class="col col-xl-5">
  <div class="card mt-2">
  <div class="card-body d-flex justify-content-center">
    <form id="gender-form" class="d-flex" role="radiogroup" aria-labelledby="gender-label">
    <strong id="gender-label" class="me-3">Display figures for:</strong>
    <div class="form-check me-2">
        <input class="form-check-input" type="radio" role="radio" name="gender-select" id="all-comparison" value="all" checked aria-checked="true">
        <label class="form-check-label" for="all-comparison" aria-label="All persons">All persons</label>
    </div>
    <div class="form-check me-2">
        <input class="form-check-input" type="radio" role="radio" name="gender-select" id="female-comparison" value="female" aria-checked="false">
        <label class="form-check-label" for="female-comparison" aria-label="Female only">Female only</label>
    </div>
    <div class="form-check me-2">
        <input class="form-check-input" type="radio" role="radio" name="gender-select" id="male-comparison" value="male" aria-checked="false">
        <label class="form-check-label" for="male-comparison" aria-label="Male only">Male only</label>
    </div>
    </form>
    </div>
    </div>
    </div>
    </div>
  `
  const gender_form = document.getElementById("gender-form");
  const male_figs = document.getElementsByClassName("male-fig");
  const female_figs = document.getElementsByClassName("female-fig");
  const all_comparison = document.getElementById("all-comparison");
  const female_comparison = document.getElementById("female-comparison");
  const male_comparison = document.getElementById("male-comparison");
  const female_cols = document.getElementsByClassName("female-col");
  const male_cols = document.getElementsByClassName("male-col");

  let selectedGender = getSelectedGender(); 
  
  function hideMaleFigs () {
    for (let i = 0; i < male_figs.length; i ++) {
      if (selectedGender === "female") {
          male_figs[i].classList.add("d-none");
      } else {
          male_figs[i].classList.remove("d-none");
          if (selectedGender === "male") {
            male_figs[i].classList.add("display-6");
          } else {
            male_figs[i].classList.remove("display-6");
          }
      }
    }
    for (let i = 0; i < male_cols.length; i ++) {
      if (selectedGender === "female") {
        male_cols[i].classList.add("d-none");
      } else {
        male_cols[i].classList.remove("d-none");
      }
    }
  }

  function hideFemaleFigs () {
    for (let i = 0; i < female_figs.length; i ++) {
      if (selectedGender === "male") {
          female_figs[i].classList.add("d-none");
      } else {
          female_figs[i].classList.remove("d-none");
      }
    }
    for (let i = 0; i < female_cols.length; i ++) {
      if (selectedGender === "male") {
        female_cols[i].classList.add("d-none");
      } else {
        female_cols[i].classList.remove("d-none");
      }
    }
  }

  function resizeRows () {
    const chart_row = document.getElementById("chart-row");

    if (chart_row) {
      if (selectedGender != "all") {
        chart_row.classList.remove("row-cols-xl-3");
        chart_row.classList.add("row-cols-xl-2");
      } else {
        chart_row.classList.add("row-cols-xl-3");
        chart_row.classList.remove("row-cols-xl-2");
      }
    }
  }

  if (localStorage.getItem("genderSelection") == null) {
    localStorage.setItem("genderSelection", "all");
  } else {
    selectedGender = localStorage.getItem("genderSelection");
    if (selectedGender === "male") {
      all_comparison.checked = false;
      male_comparison.checked = true;
      female_comparison.checked = false;
    } else if (selectedGender === "female") {
      all_comparison.checked = false;
      male_comparison.checked = false;
      female_comparison.checked = true;
    }
    hideFemaleFigs();
    hideMaleFigs();
    resizeRows();
  }

  gender_form.addEventListener("change", function () {
    selectedGender = getSelectedGender();

    if (selectedGender === "all") {
      all_comparison.ariaChecked = true;
      male_comparison.ariaChecked = false;
      female_comparison.ariaChecked = false;
    } else if (selectedGender === "male") {
      all_comparison.ariaChecked = false;
      male_comparison.ariaChecked = true;
      female_comparison.ariaChecked = false;
    } else if (selectedGender === "female") {
      all_comparison.ariaChecked = false;
      male_comparison.ariaChecked = false;
      female_comparison.ariaChecked = true;
    }

    hideFemaleFigs();
    hideMaleFigs();
    resizeRows();
    localStorage.setItem("genderSelection", selectedGender);
  });

}

