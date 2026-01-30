export function populateInfoBoxes(labels, content) { 
    const info_boxes = document.getElementById("info-boxes");

    let buttons = "";
    let contents = "";
    for (let i = 0; i < labels.length; i ++) {

        let button_style = "";
        if (i == labels.length - 1) {
            button_style += "border-right: 2px solid #00205B;border-top-right-radius: 0.5rem; border-bottom-right-radius: 0.5rem;";
        }
        if (i == 0) {
            button_style += "border-top-left-radius: 0.5rem; border-bottom-left-radius: 0.5rem;";
        }
        
        buttons += `
        <div class="col p-0">
                    <h2 class="accordion-header h-100" id="def-heading" role="heading">
                        <button class="accordion-button collapsed h-100" type="button" role="button"
                            style="${button_style}"
                            data-bs-toggle="collapse" data-bs-target="#button-${i}}-collapse"
                            aria-expanded="false" aria-controls="button-${i}}-collapse">
                            ${labels[i]}
                        </button>
                    </h2>
                </div>
        `;

        contents += `
        <div id="button-${i}}-collapse" class="accordion-collapse collapse" aria-labelledby="def-heading" data-bs-parent="#infoAccordion">
                <div class="accordion-body">
                    <h2 style="color:#00205B;">${labels[i]}</h2>
                    ${content[i]}
                </div>
            </div>
        `;
    }

    info_boxes.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-12 col-xl-8 accordion py-4" id="infoAccordion">
                <div class="row g-3">
                ${buttons}
            </div>

            <!-- CONTENT AREAS -->

            <div class="info-card-wrap">
            <div id="info-card" class="card my-3">
         

            ${contents}


            </div>
            </div>

            </div>

        </div>
    `;
}