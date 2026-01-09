import { getSelectedGender } from "./get-selected-gender.js";

export function maleComparison () {

  const male_comparison_switch = document.getElementById("male-comparison-switch");

  male_comparison_switch.innerHTML = `
    <form id="gender-form" class="d-flex justify-content-end" role="radiogroup" aria-labelledby="gender-label">
    <span id="gender-label" class="me-3">Display figures for:</span>
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
  `
  const gender_form = document.getElementById("gender-form");
  const male_figs = document.getElementsByClassName("male-fig");
  const female_figs = document.getElementsByClassName("female-fig");
  const all_comparison = document.getElementById("all-comparison");
  const female_comparison = document.getElementById("female-comparison");
  const male_comparison = document.getElementById("male-comparison");

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
  }

  function hideFemaleFigs () {
    for (let i = 0; i < female_figs.length; i ++) {
      if (selectedGender === "male") {
          female_figs[i].classList.add("d-none");
      } else {
          female_figs[i].classList.remove("d-none");
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
    localStorage.setItem("genderSelection", selectedGender);
  });

}

