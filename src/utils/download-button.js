import { config } from "../config/config.js";
import { map } from "./plot-map.js"

export function downloadButton (capture_id, matrix, update_date, map_plot = false) {

    const capture = document.getElementById(capture_id);
    const footer = capture.parentElement.querySelector(".card-footer");

    let data_sub = "";

    if (config.portal_url == "https://ppdata.nisra.gov.uk/") {
        data_sub = "pp"
    }

    const link_label = map_plot ? "map" : "chart";

    footer.innerHTML = `
        <div class="dropdown"><strong>Data last updated:</strong> ${update_date}.<br><strong>Download:</strong>
            <button class="btn btn-secondary dropdown-toggle btn-primary mt-2" type="button" id="${capture_id}-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Select type
            </button>
            <ul class="dropdown-menu" aria-labelledby="${capture_id}-dropdown">
                <li><a class="dropdown-item" href="https://${data_sub}ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadDataset/${matrix}/CSV/1.0/">data (in CSV format)</a></li>
                <li><a class="dropdown-item" href="https://${data_sub}ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadDataset/${matrix}/XLSX/2007/">data (in Excel format)</a></li>
                <li><a class="dropdown-item" href="#" id="download-${capture_id}">${link_label} (as image)</a></li>
            </ul>
        </div>
    `;


    if (map_plot) {
        document.getElementById(`download-${capture_id}`).addEventListener("click", async (e) => {
        e.preventDefault();

        const cardEl = document.getElementById(capture_id);
        const mapContainerEl = document.getElementById("map-container");

        const rawText = document.getElementById("map-title").textContent;

        const fileName = rawText
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")   // remove special characters
                    .replace(/\s+/g, "-")           // spaces → hyphens
                    .replace(/-+/g, "-");           // collapse multiple hyphens

        await exportCardWithMap(cardEl, map, mapContainerEl, `${fileName}.png`);
        });
    } else {
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

    

}

async function exportCardWithMap(cardEl, map, mapContainerEl, filename) {
  // Wait until map is fully rendered
  await new Promise((resolve) => map.once("idle", resolve));

  // Snapshot the WebGL canvas
  const mapCanvas = map.getCanvas();
  let dataUrl;
  try {
    dataUrl = mapCanvas.toDataURL("image/png");
  } catch (err) {
    console.error("Map canvas export failed (likely CORS taint):", err);
    throw err;
  }

  // Capture WITHOUT touching the live DOM
  const canvas = await html2canvas(cardEl, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,

    // Force html2canvas "virtual viewport" to match your real one,
    // so Bootstrap keeps the same breakpoint (xl, etc.)
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,

    onclone: (clonedDoc) => {
      // Find the equivalents in the cloned DOM
      const clonedCard = clonedDoc.getElementById(cardEl.id);
      const clonedMapContainer = clonedDoc.getElementById(mapContainerEl.id);

      if (!clonedCard || !clonedMapContainer) return;

      // Make sure the cloned map container keeps its size
      const w = mapContainerEl.clientWidth;
      const h = mapContainerEl.clientHeight;
      clonedMapContainer.style.width = `${w}px`;
      clonedMapContainer.style.height = `${h}px`;

      // Replace the cloned map container contents with the snapshot image
      clonedMapContainer.innerHTML = "";
      const img = clonedDoc.createElement("img");
      img.src = dataUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.display = "block";
      clonedMapContainer.appendChild(img);

      // (Optional) If your capture area is inside a responsive container,
      // lock the cloned card width to the real rendered width.
      clonedCard.style.width = `${cardEl.getBoundingClientRect().width}px`;
    }
  });

  // Download
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
