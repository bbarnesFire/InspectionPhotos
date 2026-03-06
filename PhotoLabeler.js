(async function () {

console.log("📸 Photo Labeler Started");

// ---------- MODERN STATUS WIDGET ----------

const statusBox = document.createElement("div");

statusBox.style.position = "fixed";
statusBox.style.bottom = "20px";
statusBox.style.right = "20px";
statusBox.style.background = "#1e1e1e";
statusBox.style.color = "#ffffff";
statusBox.style.padding = "14px 18px";
statusBox.style.borderRadius = "10px";
statusBox.style.fontFamily = "system-ui,-apple-system,Segoe UI,Roboto";
statusBox.style.fontSize = "13px";
statusBox.style.zIndex = "999999";
statusBox.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)";
statusBox.style.minWidth = "220px";
statusBox.style.lineHeight = "1.6";
statusBox.style.transition = "opacity 0.6s";

statusBox.innerHTML = `
<div style="font-weight:600;margin-bottom:6px">📸 Photo Labeler</div>
<div id="pl-status">Starting...</div>
`;

document.body.appendChild(statusBox);

const statusText = statusBox.querySelector("#pl-status");

function updateStatus(text){
    statusText.textContent = text;
}

// ---------- LOAD DICTIONARY ----------

updateStatus("📚 Loading dictionary...");

const dictURL = "https://raw.githubusercontent.com/bbarnesFire/InspectionPhotos/main/dictionary.json?" + Date.now();

const dictResponse = await fetch(dictURL);
const dictionary = await dictResponse.json();

console.log("Dictionary loaded:", dictionary);

// ---------- GET LINKS ----------

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

    updateStatus(`🔎 Scanning ${processed} / ${links.length}`);

    const href = link.getAttribute("href");

    if(!href) continue;

    // ITV detection
    if(href.includes("inspectors_test_valve_answers")){
        addLabel(link,"ITV");
        updateStatus("🧪 ITV detected");
        continue;
    }

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

                updateStatus(`🏷️ ${rule.text}`);

                console.log("Match:", rule.text);

                break;

            }
        }

    } catch(err){

        console.log("Error processing answer:", err);

    }

}

// ---------- FINISHED ----------

updateStatus("✅ Finished labeling photos");

setTimeout(()=>{
    statusBox.style.opacity = "0";
},4000);

})();
