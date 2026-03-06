(async function () {

const dictUrl = "https://raw.githubusercontent.com/bbarnesFire/InspectionPhotos/main/dictionary.json";

const rules = await fetch(dictUrl).then(r=>r.json());

const links = document.querySelectorAll('a[href*="_answers/"]');

links.forEach(link => {

let container = link.closest("div") || link.parentElement;
let text = container.innerText.toLowerCase();

let label = null;

/* dictionary keyword matching */
for (let rule of rules) {

let match = true;

for (let k of rule.keywords) {
if (!text.includes(k.toLowerCase())) {
match = false;
break;
}
}

if (match) {
label = rule.text;
break;
}

}

/* ITV fallback */
if (!label && link.innerText.toLowerCase().includes("inspectors test valve")) {
label = "ITV";
}

if (label) {

let tag = document.createElement("span");

tag.textContent = "  [" + label + "]";

tag.style.color = "red";
tag.style.fontWeight = "bold";
tag.style.marginLeft = "8px";

link.after(tag);

}

});

})();
