const rules = [
  {
    keywords: ["spare", "sprinklers", "wrench"],
    text: "Head Box"
  },
  {
    keywords: ["system", "riser"],
    text: "System Riser"
  },
  {
    keywords: ["escutcheons", "cover plates"],
    text: "Missing Escutcheons or Cover Plates"
  },
  {
    keywords: ["gauges", "calibrated", "5 years"],
    text: "Gauges"
  },
  {
    keywords: ["valves", "sealed", "correct position"],
    text: "Alarm Valves"
  }
];

const links = document.querySelectorAll('a[href*="/answers/"]');

(async () => {
  for (const link of links) {
    try {
      const res = await fetch(link.href);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      const question = doc.querySelector("#frequency")?.innerText.toLowerCase() || "";

      for (const rule of rules) {
        const match = rule.keywords.every(word => question.includes(word));

        if (match) {
          link.textContent = rule.text;
          break;
        }
      }

      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      console.error(err);
    }
  }
})();
