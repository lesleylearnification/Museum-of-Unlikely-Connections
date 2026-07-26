let CATEGORY_DATA=[];
const state={gallery:[],selected:[],curator:null,saved:[],connectionCount:0,rating:0};
const el=id=>document.getElementById(id);
const grid=el("exhibitGrid"),yarnLayer=el("yarnLayer"),selectedSummary=el("selectedSummary");
const insightInput=el("playerInsight"),submitBtn=el("submitInsightBtn"),feedback=el("journalFeedback");
const curatorLoading=el("curatorLoading"),curatorResult=el("curatorResult");
const connectionParagraph=el("connectionParagraph"),researchBtn=el("researchBtn");
const newConnectionBtn=el("newConnectionBtn"),saveBtn=el("saveBtn");
const researchDialog=el("researchDialog"),cabinetDialog=el("cabinetDialog");
const ratingMessage=el("ratingMessage");
const pickRandom=a=>a[Math.floor(Math.random()*a.length)];
const escapeHtml=value=>String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

const categorySymbols={
  "Leader":"CROWN","Treaty / Law":"SEAL","Technology / Invention":"GEAR","Idea / Belief":"FLAME",
  "Conflict":"SHIELD","Empire / Nation":"TOWER","Social Movement":"BANNER","Trade / Economy":"COIN",
  "Migration / Exploration":"COMPASS","Daily Life":"VESSEL","Art / Media":"QUILL","Disease / Environment":"LEAF"
};
function initials(name){const words=name.trim().split(/\\s+/);return words.length>1?(words[0][0]+words[words.length-1][0]).toUpperCase():name.slice(0,2).toUpperCase()}
function specimenMarkup(item,compact=false){
  const mono=escapeHtml(initials(item.name));
  const category=escapeHtml(item.category||"");
  const symbol=escapeHtml(categorySymbols[item.category]||"RELIC");
  return `<div class="specimen ${compact?'compact':''}" role="img" aria-label="${escapeHtml(item.name)} antique museum specimen">
    <div class="specimen-dust"></div><div class="specimen-glare"></div>
    <div class="specimen-medallion"><strong>${mono}</strong><span>${symbol}</span></div>
    ${compact?`<small>${escapeHtml(item.name)}</small>`:""}
  </div>`;
}

async function init(){const response=await fetch("data.json",{cache:"no-store"});CATEGORY_DATA=await response.json();buildGallery()}
function buildGallery(){state.gallery=CATEGORY_DATA.map(c=>({...pickRandom(c.items),categoryId:c.id,category:c.label}));resetConnection()}
function resetConnection(){
  state.selected=[];state.curator=null;state.rating=0;insightInput.value="";feedback.textContent="";
  curatorLoading.hidden=true;curatorResult.hidden=true;researchBtn.disabled=true;newConnectionBtn.disabled=true;saveBtn.disabled=true;saveBtn.textContent="Save to cabinet";
  clearStars();renderGallery();renderJournal();renderThemes([]);
}
function renderGallery(){
  grid.innerHTML="";
  state.gallery.forEach((item,index)=>{
    const button=document.createElement("button");button.type="button";button.className="exhibit";button.dataset.index=index;
    const selected=state.selected.includes(index);button.classList.toggle("selected",selected);button.setAttribute("aria-pressed",String(selected));
    button.innerHTML=`<span class="category-label">${escapeHtml(item.category)}</span><div class="glass-dome">${specimenMarkup(item)}</div><h3>${escapeHtml(item.name)}</h3><span class="exhibit-date">${escapeHtml(item.date)}</span><p>${escapeHtml(item.note)}</p>`;
    button.addEventListener("click",()=>toggleExhibit(index));grid.appendChild(button);
  });requestAnimationFrame(drawYarn);
}
function toggleExhibit(index){
  if(state.curator)return;
  if(state.selected.includes(index))state.selected=state.selected.filter(i=>i!==index);else if(state.selected.length<3)state.selected.push(index);else{feedback.textContent="The red yarn can connect only three exhibits at a time.";return}
  feedback.textContent="";renderGallery();renderJournal();
}
function renderJournal(){
  selectedSummary.innerHTML=state.selected.length?state.selected.map(index=>{const item=state.gallery[index];return `<div class="selected-chip">${specimenMarkup(item,true)}</div>`}).join(""):'<div class="empty-selection">Select three exhibits.</div>';
  submitBtn.disabled=state.selected.length!==3||insightInput.value.trim().length<10||!!state.curator;
}
function drawYarn(){
  yarnLayer.innerHTML="";const area=grid.getBoundingClientRect(),holder=grid.parentElement.getBoundingClientRect();
  yarnLayer.style.left=`${area.left-holder.left}px`;yarnLayer.style.top=`${area.top-holder.top}px`;yarnLayer.style.width=`${area.width}px`;yarnLayer.style.height=`${area.height}px`;yarnLayer.setAttribute("viewBox",`0 0 ${area.width} ${area.height}`);
  const buttons=state.selected.map(i=>grid.querySelector(`[data-index="${i}"]`)).filter(Boolean);if(buttons.length<2)return;
  for(let i=0;i<buttons.length-1;i++){
    const a=buttons[i].getBoundingClientRect(),b=buttons[i+1].getBoundingClientRect();const x1=a.left-area.left+a.width*.52,y1=a.top-area.top+a.height*.43,x2=b.left-area.left+b.width*.48,y2=b.top-area.top+b.height*.43;const sag=Math.max(20,Math.abs(x2-x1)*.1);const d=`M ${x1} ${y1} C ${x1+(x2-x1)*.28} ${y1+sag}, ${x1+(x2-x1)*.72} ${y2+sag}, ${x2} ${y2}`;
    [["yarn-shadow",d],["yarn-path",d]].forEach(([cls,pathD])=>{const path=document.createElementNS("http://www.w3.org/2000/svg","path");path.setAttribute("d",pathD);path.setAttribute("class",cls);yarnLayer.appendChild(path)});
    [{x:x1,y:y1,r:-15},{x:x2,y:y2,r:13}].forEach(t=>{const tape=document.createElementNS("http://www.w3.org/2000/svg","rect");tape.setAttribute("x",t.x-18);tape.setAttribute("y",t.y-8);tape.setAttribute("width",36);tape.setAttribute("height",16);tape.setAttribute("rx",2);tape.setAttribute("class","tape");tape.style.transform=`rotate(${t.r}deg)`;yarnLayer.appendChild(tape)});
  }
}
function overlapTags(items){const counts=new Map();items.forEach(item=>item.tags.forEach(tag=>counts.set(tag,(counts.get(tag)||0)+1)));return [...counts.entries()].sort((a,b)=>b[1]-a[1]).map(([tag])=>tag)}
function curatedSources(item){const q=encodeURIComponent(item.name);return[
 {title:`Encyclopaedia Britannica: ${item.name}`,url:`https://www.britannica.com/search?query=${q}`,type:"Reference"},
 {title:"World History Encyclopedia search",url:`https://www.worldhistory.org/search/?q=${q}`,type:"Historical overview"},
 {title:"JSTOR research search",url:`https://www.jstor.org/action/doBasicSearch?Query=${q}`,type:"Scholarly research"},
 {title:"Google Scholar search",url:`https://scholar.google.com/scholar?q=${q}`,type:"Academic discovery"}]}
function createLocalCurator(items){
  const themes=overlapTags(items),strongest=themes[0]||"human organization",second=themes[1]||"change over time";
  const paragraphs=[
   `Taken together, these exhibits reveal how ${strongest} can connect people, institutions, and ideas across very different periods. ${items[0].name}, ${items[1].name}, and ${items[2].name} each show societies building a durable response to a recurring human need. Their relationship is not necessarily direct causation; it is a shared historical pattern in which systems of ${strongest} are created, contested, and reshaped as circumstances change.`,
   `A compelling connection is the relationship between ${strongest} and ${second}. ${items[0].name}, ${items[1].name}, and ${items[2].name} each emerged from a need to coordinate human action beyond the scale of one person. One worked through authority or institutions, another through shared knowledge or practice, and another through material or cultural forms. Together they show that historical change often begins when societies reorganize people, information, resources, or belief.`,
   `These exhibits can be read as different answers to a recurring historical problem: how to turn ${strongest} into durable collective power. Although separated by place, period, and category, each reveals a way communities made ideas, practices, or networks outlast their original moment. The comparison is interpretive rather than merely chronological, and it highlights how similar human pressures can produce strikingly different historical forms.`];
  const paragraph=paragraphs[items.reduce((sum,i)=>sum+i.name.length,0)%paragraphs.length];
  return{connectionParagraph:paragraph,themes:themes.slice(0,4),library:items.map(item=>({...item,summary:item.note,sources:curatedSources(item)}))};
}
async function requestCurator(items){if(window.CURATOR_TASK_ENDPOINT){const r=await fetch(window.CURATOR_TASK_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({exhibits:items})});if(!r.ok)throw new Error();return r.json()}await new Promise(r=>setTimeout(r,700));return createLocalCurator(items)}
async function submitInsight(){
  if(state.selected.length!==3||insightInput.value.trim().length<10)return;curatorLoading.hidden=false;curatorResult.hidden=true;submitBtn.disabled=true;feedback.textContent="Your connection has been pinned into the journal.";
  try{state.curator=await requestCurator(state.selected.map(i=>state.gallery[i]));connectionParagraph.textContent=state.curator.connectionParagraph;curatorLoading.hidden=true;curatorResult.hidden=false;saveBtn.disabled=false;renderThemes(state.curator.themes);state.connectionCount++;el("connectionCount").textContent=state.connectionCount;requestAnimationFrame(drawYarn)}
  catch(e){curatorLoading.hidden=true;feedback.textContent="The curator could not reach the archive. Try again.";state.curator=null;renderJournal()}
}
function clearStars(){document.querySelectorAll("#starRating button").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-pressed","false")});if(ratingMessage)ratingMessage.textContent="Choose a rating to unlock the library and your next connection."}
function setRating(value){
  if(!state.curator)return;state.rating=Number(value);document.querySelectorAll("#starRating button").forEach(b=>{const active=Number(b.dataset.rating)<=state.rating;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(Number(b.dataset.rating)===state.rating))});
  const messages=["","Your view is quite different—and may reveal another worthwhile pattern.","There is a little overlap between the two interpretations.","The interpretations share part of the same underlying structure.","Your insight is closely aligned with the curator’s perspective.","Your insight and the curator’s perspective are nearly identical."];
  ratingMessage.textContent=messages[state.rating];researchBtn.disabled=false;newConnectionBtn.disabled=false;
}
function renderThemes(themes){el("themeTags").innerHTML=themes.length?themes.map(t=>`<span class="theme-tag">${escapeHtml(t)}</span>`).join(""):"None yet"}
function openLibrary(){if(!state.curator||!state.rating)return;el("libraryCards").innerHTML=state.curator.library.map(item=>`<section class="library-card">${specimenMarkup(item,true)}<p class="library-kicker">${escapeHtml(item.category)} · ${escapeHtml(item.date)}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.summary)}</p><div class="source-links">${item.sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener"><strong>${escapeHtml(s.type)}:</strong> ${escapeHtml(s.title)} ↗</a>`).join("")}</div></section>`).join("");researchDialog.showModal()}
function saveConnection(){if(!state.curator)return;const items=state.selected.map(i=>state.gallery[i]);state.saved.push({items:items.map(i=>i.name),insight:insightInput.value.trim(),curator:state.curator.connectionParagraph,rating:state.rating,themes:state.curator.themes});el("savedCount").textContent=state.saved.length;saveBtn.disabled=true;saveBtn.textContent="Saved"}
function showCabinet(){el("savedConnections").innerHTML=state.saved.length?state.saved.map(s=>`<section class="saved-card"><h3>${s.items.map(escapeHtml).join(" + ")}</h3><p><strong>Your insight:</strong> ${escapeHtml(s.insight)}</p><p><strong>Curator:</strong> ${escapeHtml(s.curator)}</p><p><strong>Similarity:</strong> ${s.rating||"Not rated"}/5</p></section>`).join(""):"<p>No saved connections yet.</p>";cabinetDialog.showModal()}
insightInput.addEventListener("input",renderJournal);submitBtn.addEventListener("click",submitInsight);researchBtn.addEventListener("click",openLibrary);saveBtn.addEventListener("click",saveConnection);newConnectionBtn.addEventListener("click",resetConnection);el("newGalleryBtn").addEventListener("click",buildGallery);el("cabinetBtn").addEventListener("click",showCabinet);el("closeLibraryBtn").addEventListener("click",()=>researchDialog.close());el("closeCabinetBtn").addEventListener("click",()=>cabinetDialog.close());document.querySelectorAll("#starRating button").forEach(b=>b.addEventListener("click",()=>setRating(b.dataset.rating)));window.addEventListener("resize",drawYarn);init().catch(()=>{feedback.textContent="The exhibit catalogue could not load. Confirm data.json is in the repository root."});
