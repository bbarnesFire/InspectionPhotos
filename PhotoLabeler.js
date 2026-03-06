javascript:(async()=>{

const dictURL = "https://raw.githubusercontent.com/bbarnesFire/InspectionPhotos/main/dictionary.json";

const statusBox = document.createElement("div");
statusBox.style.position="fixed";
statusBox.style.bottom="20px";
statusBox.style.right="20px";
statusBox.style.background="#111";
statusBox.style.color="#fff";
statusBox.style.padding="12px 16px";
statusBox.style.borderRadius="8px";
statusBox.style.fontSize="14px";
statusBox.style.zIndex="999999";
statusBox.style.boxShadow="0 4px 12px rgba(0,0,0,.4)";
statusBox.innerText="Inspection Photo Helper\nLoading dictionary...";
document.body.appendChild(statusBox);

const response = await fetch(dictURL);
const rules = await response.json();

const links = [...document.querySelectorAll('a[href*="/answers/"]')];

let processed = 0;
const total = links.length;

statusBox.innerText=`Inspection Photo Helper\nProcessing 0 / ${total}`;

async function processLink(link){

  try{

    const res = await fetch(link.href);
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html,"text/html");

    const question = doc.querySelector("#frequency")?.innerText.toLowerCase() || "";

    for(const rule of rules){

      const match = rule.keywords.every(k =>
        question.includes(k.toLowerCase())
      );

      if(match){
        link.textContent = rule.text;
        break;
      }

    }

  }catch(e){
    console.error(e);
  }

  processed++;
  statusBox.innerText=`Inspection Photo Helper\nProcessing ${processed} / ${total}`;

}

await Promise.all(links.map(processLink));

statusBox.innerText=`Inspection Photo Helper\n✅ Complete (${total} photos)`;

// auto disappear after 4 seconds
setTimeout(()=>statusBox.remove(),4000);

})();
