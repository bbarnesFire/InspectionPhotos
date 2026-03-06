javascript:(async()=>{

const dictURL = "https://raw.githubusercontent.com/bbarnesFire/InspectionPhotos/main/dictionary.json";

const response = await fetch(dictURL);
const rules = await response.json();

const links = document.querySelectorAll('a[href*="/answers/"]');

for (const link of links) {

  try {

    const res = await fetch(link.href);
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, "text/html");

    const question = doc.querySelector("#frequency")?.innerText.toLowerCase() || "";

    for (const rule of rules) {

      const match = rule.keywords.every(k =>
        question.includes(k.toLowerCase())
      );

      if (match) {
        link.textContent = rule.text;
        break;
      }

    }

    await new Promise(r => setTimeout(r,150));

  } catch(e) {
    console.error(e);
  }

}

})();
