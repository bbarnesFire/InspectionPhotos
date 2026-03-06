# Inspection Photo Auto-Labeler

A lightweight browser script that automatically labels inspection photos by reading the **Related Question** associated with each answer.

Many inspection platforms store photos under answers but do not label them on the building page. This tool scans the answer links, retrieves the related question from the answer page, and adds a descriptive label next to the photo reference.

This allows inspectors to immediately identify what each photo represents without opening every answer individually.

---

# Why This Exists

During sprinkler system inspections, dozens of photos may be attached to answers such as:

- system riser
- head box
- gauges
- fire department connections
- escutcheons

However, the building page often only shows something like:

```
Answer #81196
Answer #81197
Answer #81198
```

Without opening each one, it is impossible to know what the photo contains.

This script automatically converts that into:

```
Answer #81196 [Head Box]
Answer #81197 [System Riser]
Answer #81198 [FDC]
```

Saving a significant amount of time when reviewing inspections.

---

# Features

- Automatically scans **Answer links** on inspection pages
- Fetches the **Related Question** for each answer
- Matches the question against a **dictionary of known inspection photo types**
- Adds a **visible label next to the answer link**
- Runs directly in the browser
- No modification to the inspection software required
- Easy to expand with additional question mappings

---

# How It Works

1. The script finds links matching:

```
/answers/{id}
```

2. It fetches the answer page in the background.

3. It extracts the **Related Question** text from:

```
#frequency
```

4. The question text is matched against a **keyword dictionary**.

5. If a match is found, a label is added beside the answer link.

---

# Installation (Bookmark Method)

1. Create a new browser bookmark.
2. Name it:

```
Label Inspection Photos
```

3. Paste the script as a single function into the **URL field**.
   ```
   javascript:(async()=>{const photoDictionary={"spare sprinklers":"Head Box","system's riser":"System Riser","escutcheons":"Missing Escutcheons or Cover Plates","cover plates":"Missing Escutcheons or Cover Plates","gauges been checked":"Gauges","fire department connection":"FDC","If applicable, are the valves connected to pressure-type alarm switches or water motor-operated alarms either locked, sealed, or electronically supervised in the correct position?":"Valve Supervision"};async function getQuestion(url){const res=await fetch(url,{credentials:"include"});const html=await res.text();const parser=new DOMParser();const doc=parser.parseFromString(html,"text/html");const questionEl=doc.querySelector("#frequency");return questionEl?questionEl.textContent.toLowerCase():null}async function labelPhotos(){const links=[...document.querySelectorAll('a[href*="/answers/"]')];const jobs=links.map(async(link)=>{const url=new URL(link.href,window.location.origin);const question=await getQuestion(url);if(!question)return;let label="";for(const key in photoDictionary){if(question.includes(key.toLowerCase())){label=photoDictionary[key];break}}if(!label)return;const tag=document.createElement("span");tag.textContent=" ["+label+"]";tag.style.color="red";tag.style.fontWeight="bold";link.after(tag)});await Promise.all(jobs);console.log("Photo labeling finished")}labelPhotos()})();
   ```
5. Save the bookmark.
6. While on a building inspection page, click the bookmark.

I AM GOING TO ADD A JSON DICTONARY TO MAKE IT EASIER TO UPDATE 
The script will scan the page and label the photos automatically.

---

# Example Dictionary

The script uses a dictionary to determine which label to apply.

```javascript
const photoDictionary = {

  "proper number and type of spare sprinklers": "Head Box",

  "photo of this system's riser": "System Riser",

  "escutcheons and/or cover plates for fire sprinkler heads": 
  "Missing Escutcheons or Cover Plates",

  "gauges been checked by a calibrated gauge": "Gauges",

  "fire department connection": "FDC"

};
```

Additional inspection questions can easily be added.

---

# Example Output

Before running the script:

```
Answer #81196
Answer #81197
Answer #81198
Answer #81199
```

After running the script:

```
Answer #81196 [Head Box]
Answer #81197 [System Riser]
Answer #81198 [FDC]
Answer #81199 [Gauges]
```

---

# Customization

To add support for additional inspection photo types, simply add another entry to the dictionary.

Example:

```javascript
"main drain test": "Main Drain"
```

The script will automatically begin labeling those photos.

---

# Intended Use

This tool was built to assist inspectors reviewing **fire sprinkler system inspections** where photos are attached to answers but not labeled on the inspection overview page.

---

# Disclaimer

This script only modifies the page locally in your browser and does not alter any data in the inspection platform.

---

# Future Improvements

Possible enhancements include:

- faster parallel loading of answer pages
- caching previously scanned answers
- color-coded labels
- automatic execution via userscripts
- support for additional inspection platforms
