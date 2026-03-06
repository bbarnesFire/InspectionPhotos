(async function () {

console.log("📸 Photo Labeler Started");

// LOAD DICTIONARY
const dictUrl = "https://raw.githubusercontent.com/bbarnesFire/InspectionPhotos/main/dictionary.json?" + Date.now();
const dictResponse = await fetch(dictUrl);
const dictionary = await dictResponse.json();

console.log("📚 Dictionary loaded:", dictionary);

// GET ALL LINKS
const links = document.querySelectorAll("a.qmb-ui-text--link");

console.log("🔎 Links found:", links.length);

// FUNCTION TO ADD LABEL
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

// LOOP LINKS
for(const link of links){

    const href = link.getAttribute("href");

    if(!href) continue;

    // ITV DETECTION
    if(href.includes("inspectors_test_valve_answers")){
        addLabel(link,"ITV");
        continue;
    }

    // NORMAL ANSWERS
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

            const match = rule.keywords.every(k =>
                questionText.includes(k.toLowerCase())
            );

            if(match){

                addLabel(link,rule.text);

                console.log("✅ Match:",rule.text);

                break;
            }

        }

    }catch(e){

        console.log("⚠️ Error reading answer",e);

    }

}

console.log("✅ Photo Labeler Finished");

})();
