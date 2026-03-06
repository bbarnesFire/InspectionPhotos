(async function () {

console.log("📸 Photo Labeler Started");

// ---------- FLOATING STATUS BOX ----------

const statusBox = document.createElement("div");

statusBox.style.position = "fixed";
statusBox.style.top = "20px";
statusBox.style.right = "20px";
statusBox.style.background = "#111";
statusBox.style.color = "#00ff88";
statusBox.style.padding = "12px 16px";
statusBox.style.borderRadius = "8px";
statusBox.style.fontFamily = "monospace";
statusBox.style.fontSize = "13px";
statusBox.style.zIndex = "999999";
statusBox.style.boxShadow = "0 0 12px rgba(0,0,0,0.4)";

statusBox.innerText = "Photo Labeler Starting...";
document.body.appendChild(statusBox);

function updateStatus(text){
    statusBox.innerText = text;
}

// ---------- LOAD DICTIONARY ----------

updateStatus("Loading dictionary...");

const dictURL = "https://raw.githubusercontent.com/bbarnesFire/InspectionPhotos/main/dictionary.json?" + Date.now();
const dictResponse = await fetch(dictURL);
const dictionary = await dictResponse.json();

console.log("Dictionary loaded:", dictionary);

// ---------- GET ALL LINKS ----------

const links = document.querySelectorAll("a.qmb-ui-text--link");

console.log("Links found:", links.length);

let processed = 0;

// ---------- LABEL FUNCTION ----------

function addLabel(link, text){

    const container = link.closest('[class*="qmb"]') || link.parentElement;

    if(!container) return;

    if(container.querySelector(".photoLabel")) return;

    const label = document.createElement("span");

    label.className = "photoLabel";
    label.style.color = "red";
    label.style.fontWeight = "bold";
    label.style.marginLeft = "8px";

    label.textContent = "Photo: " + text;

    link.insertAdjacentElement("afterend", label);
}

// ---------- PROCESS LINKS ----------

for(const link of links){

    processed++;

    updateStatus(`Scanning photo ${processed} of ${links.length}`);

    const href = link.getAttribute("href");

    if(!href) continue;

    // ITV detection
    if(href.includes("inspectors_test_valve_answers")){
        addLabel(link,"ITV");
        continue;
    }

    // Only process answer links
    if(!href.includes("/answers/")) continue;

    try{

        const answerURL = new URL(href, location.origin).href;

        const response = await fetch(answerURL);
        const html = await response.text();

        const doc = new DOMParser().parseFromString(html,"text/html");

        const questionSpan = doc.querySelector("#frequency");

        if(!questionSpan) continue;

        const questionText = questionSpan.innerText.toLowerCase();

        for(const rule of dictionary){

            const match = rule.keywords.every(keyword =>
                questionText.includes(keyword.toLowerCase())
            );

            if(match){

                addLabel(link, rule.text);

                console.log("Match:", rule.text);

                break;
            }
        }

    } catch(err) {

        console.log("Error processing answer:", err);

    }
}

// ---------- DONE ----------

updateStatus("Finished ✔");

setTimeout(()=>{
    statusBox.innerText = "Photo Labeler Complete ✔";
},500);

})();
