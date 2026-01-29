import { config } from "../config/config.js"

export function downloadButton (capture_id, matrix, update_date) {

    const capture = document.getElementById(capture_id);
    const footer = capture.parentElement.querySelector(".card-footer");

    let data_sub = "";

    if (config.portal_url == "https://ppdata.nisra.gov.uk/") {
        data_sub = "pp"
    }

    footer.innerHTML = `
        <div class="dropdown"><strong>Data last updated:</strong> ${update_date}.<br><strong>Download:</strong>
            <button class="btn btn-secondary dropdown-toggle btn-primary mt-2" type="button" id="${capture_id}-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Select type
            </button>
            <ul class="dropdown-menu" aria-labelledby="${capture_id}-dropdown">
                <li><a class="dropdown-item" href="https://${data_sub}ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadDataset/${matrix}/CSV/1.0/">data (in CSV format)</a></li>
                <li><a class="dropdown-item" href="https://${data_sub}ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadDataset/${matrix}/XLSX/2007/">data (in Excel format)</a></li>
                <li><a class="dropdown-item" href="#" id="download-${capture_id}">chart (as image)</a></li>
            </ul>
        </div>
    `;

    document
    .getElementById(`download-${capture_id}`)
        .addEventListener("click", function (e) {
            e.preventDefault();
            
            const header = capture.querySelector(".card-header");

            // Generate filename from header text
            const rawText = header.innerText || header.textContent;

            const fileName = rawText
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")   // remove special characters
            .replace(/\s+/g, "-")           // spaces → hyphens
            .replace(/-+/g, "-");           // collapse multiple hyphens

            html2canvas(capture, {
                backgroundColor: "#ffffff",
                scale: 2,
                useCORS: true
            }).then((canvas) => {
                const link = document.createElement("a");
                link.download = `${fileName}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        });

}