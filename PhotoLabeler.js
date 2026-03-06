const photoDictionary = {
  "spare sprinklers": "Head Box",
  "system's riser": "System Riser",
  "escutcheons": "Missing Escutcheons or Cover Plates",
  "cover plates": "Missing Escutcheons or Cover Plates",
  "gauges been checked": "Gauges",
  "fire department connection": "FDC",
  "If applicable, are the valves connected to pressure-type alarm switches or water motor-operated alarms either locked, sealed, or electronically supervised in the correct position?": "Valve Supervision"
};


async function getQuestion(url) {

  const res = await fetch(url, { credentials: "include" });
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const questionEl = doc.querySelector("#frequency");

  return questionEl ? questionEl.textContent.toLowerCase() : null;
}


async function labelPhotos() {

  const links = [...document.querySelectorAll('a[href*="/answers/"]')];

  const jobs = links.map(async (link) => {

    const url = new URL(link.href, window.location.origin);
    const question = await getQuestion(url);

    if (!question) return;

    let label = "";

    for (const key in photoDictionary) {
      if (question.includes(key)) {
        label = photoDictionary[key];
        break;
      }
    }

    if (!label) return;

    const tag = document.createElement("span");
    tag.textContent = "  [" + label + "]";
    tag.style.color = "red";
    tag.style.fontWeight = "bold";

    link.after(tag);

  });

  await Promise.all(jobs);

  console.log("Photo labeling finished");
}

labelPhotos();
