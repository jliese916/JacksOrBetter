"use strict";

const RANKS=["2","3","4","5","6","7","8","9","T","J","Q","K","A"];
const SUITS=["\u2665","\u2666","\u2663","\u2660"];

const el={
  status:document.querySelector("#status"),
  trainTab:document.querySelector("#trainTab"),lookupTab:document.querySelector("#lookupTab"),
  trainPanel:document.querySelector("#trainPanel"),lookupPanel:document.querySelector("#lookupPanel"),scorePanel:document.querySelector("#scorePanel"),
  hand:document.querySelector("#hand"),selection:document.querySelector("#selection"),check:document.querySelector("#check"),newHand:document.querySelector("#newHand"),feedback:document.querySelector("#feedback"),
  score:document.querySelector("#score"),percentage:document.querySelector("#percentage"),reset:document.querySelector("#reset"),file:document.querySelector("#file"),
  lookupHand:document.querySelector("#lookupHand"),lookupPrompt:document.querySelector("#lookupPrompt"),rankPicker:document.querySelector("#rankPicker"),suitPicker:document.querySelector("#suitPicker"),findHold:document.querySelector("#findHold"),clearLookup:document.querySelector("#clearLookup"),lookupFeedback:document.querySelector("#lookupFeedback")
};

const state={
  strategy:null,
  mode:"train",
  hand:[],selected:new Set(),answered:false,
  attempts:Number(localStorage.getItem("jacksAttempts")||0),
  correct:Number(localStorage.getItem("jacksCorrect")||0),
  lookupHand:[],pendingRank:null,lookupResults:[]
};

const rank=c=>(c-1)%13;
const suit=c=>Math.floor((c-1)/13);
const label=c=>RANKS[rank(c)]+SUITS[suit(c)];

function deck(){
  const a=Array.from({length:52},(_,i)=>i+1);
  for(let i=51;i>0;i--){
    const x=new Uint32Array(1);crypto.getRandomValues(x);
    const j=x[0]%(i+1);[a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function deal(){
  state.hand=deck().slice(0,5).sort((a,b)=>a-b);
  state.selected.clear();state.answered=false;
  feedback("","");renderTraining();
}

function toggle(c){
  if(state.answered)return;
  state.selected.has(c)?state.selected.delete(c):state.selected.add(c);
  renderTraining();
}

function cardButton(c,{selected=false,disabled=false,onClick=null,placeholder=false}={}){
  const b=document.createElement("button");
  b.type="button";
  b.className="card"+(placeholder?" placeholder":"")+(suit(c)<2&&!placeholder?" red":"")+(selected?" selected":"");
  b.textContent=placeholder?"+":label(c);
  b.disabled=disabled||placeholder;
  if(!placeholder){
    b.setAttribute("aria-label",label(c));
    b.setAttribute("aria-pressed",String(selected));
    if(onClick)b.onclick=onClick;
  }
  return b;
}

function renderTraining(){
  el.hand.replaceChildren();
  for(const c of state.hand){
    el.hand.append(cardButton(c,{selected:state.selected.has(c),disabled:state.answered,onClick:()=>toggle(c)}));
  }
  const kept=state.hand.filter(c=>state.selected.has(c));
  el.selection.textContent=kept.length?"Keep: "+kept.map(label).join(" "):"Discard all five cards";
  const p=state.attempts?100*state.correct/state.attempts:0;
  el.score.textContent=`${state.correct} / ${state.attempts}`;
  el.percentage.textContent=p.toFixed(1)+"%";
  el.check.disabled=!state.strategy||state.answered;
}

function save(){
  localStorage.setItem("jacksAttempts",state.attempts);
  localStorage.setItem("jacksCorrect",state.correct);
}

function status(s,type=""){
  el.status.textContent=s;
  el.status.className="status"+(type?" "+type:"");
}

function feedback(s,type){
  el.feedback.textContent=s;
  el.feedback.className="feedback"+(type?" "+type:"");
}

function canonicalize(hand){
  const rows=Array.from({length:4},()=>Array(13).fill(0));
  for(const c of hand)rows[suit(c)][rank(c)]=1;
  const ordered=rows.map((row,originalSuit)=>({row,originalSuit})).sort((a,b)=>{
    for(let r=0;r<13;r++)if(a.row[r]!==b.row[r])return a.row[r]-b.row[r];
    return a.originalSuit-b.originalSuit;
  });
  const canonical=[],original=[];
  ordered.forEach(({row,originalSuit},canonicalSuit)=>row.forEach((present,r)=>{
    if(present){canonical.push(r+1+13*canonicalSuit);original.push(r+1+13*originalSuit);}
  }));
  let key=0;
  for(const c of canonical)key=53*key+c;
  return{key:String(key),original};
}

function fromMask(mask,cards){
  const set=new Set();
  for(let i=0;i<5;i++)if(mask&(1<<(4-i)))set.add(cards[i]);
  return set;
}

function optimal(hand){
  const c=canonicalize(hand),masks=state.strategy[c.key];
  if(!Array.isArray(masks))throw new Error(`Missing key ${c.key} for ${hand}`);
  return masks.map(m=>fromMask(Number(m),c.original));
}

function equal(a,b){
  if(a.size!==b.size)return false;
  for(const x of a)if(!b.has(x))return false;
  return true;
}

function describeForHand(set,hand){
  const a=hand.filter(c=>set.has(c));
  return a.length?a.map(label).join(" "):"discard all five cards";
}

function check(){
  try{
    const holds=optimal(state.hand),ok=holds.some(h=>equal(h,state.selected));
    state.attempts++;state.answered=true;
    if(ok){
      state.correct++;feedback("Correct!","correct");
    }else{
      const d=[...new Set(holds.map(h=>describeForHand(h,state.hand)))];
      feedback((d.length===1?"Optimal play: ":"Optimal plays: ")+d.join(" or "),"incorrect");
    }
    save();renderTraining();
  }catch(e){
    console.error(e);feedback("Strategy lookup failed for this hand. See the browser console.","error");
  }
}

function setMode(mode){
  state.mode=mode;
  const training=mode==="train";
  el.trainTab.classList.toggle("active",training);
  el.lookupTab.classList.toggle("active",!training);
  el.trainTab.setAttribute("aria-selected",String(training));
  el.lookupTab.setAttribute("aria-selected",String(!training));
  el.trainPanel.classList.toggle("hidden",!training);
  el.lookupPanel.classList.toggle("hidden",training);
  el.scorePanel.classList.toggle("hidden",!training);
  if(!training)renderLookup();
}

function chooseRank(r){
  if(state.lookupHand.length>=5)return;
  state.pendingRank=r;
  state.lookupResults=[];
  renderLookup();
}

function chooseSuit(s){
  if(state.pendingRank===null||state.lookupHand.length>=5)return;
  const card=state.pendingRank+1+13*s;
  if(state.lookupHand.includes(card)){
    el.lookupPrompt.textContent=`${label(card)} is already in the hand. Choose another suit.`;
    return;
  }
  state.lookupHand.push(card);
  state.lookupHand.sort((a,b)=>a-b);
  state.pendingRank=null;
  state.lookupResults=[];
  renderLookup();
}

function removeLookupCard(card){
  state.lookupHand=state.lookupHand.filter(c=>c!==card);
  state.lookupResults=[];
  renderLookup();
}

function clearLookup(){
  state.lookupHand=[];
  state.pendingRank=null;
  state.lookupResults=[];
  renderLookup();
}

function miniCard(card){
  const span=document.createElement("span");
  span.className="mini-card"+(suit(card)<2?" red":"");
  span.textContent=label(card);
  return span;
}

function renderLookupResults(){
  el.lookupFeedback.className="lookup-feedback";
  el.lookupFeedback.replaceChildren();
  if(!state.lookupResults.length)return;

  const heading=document.createElement("p");
  heading.className="result-heading";
  heading.textContent=state.lookupResults.length===1?"Optimal hold":"Tied optimal holds";
  el.lookupFeedback.append(heading);

  const results=document.createElement("div");
  results.className="hold-results";

  state.lookupResults.forEach((keeper,index)=>{
    const box=document.createElement("div");
    box.className="hold-result";
    if(state.lookupResults.length>1){
      const title=document.createElement("div");
      title.className="hold-result-label";
      title.textContent=`Option ${index+1}`;
      box.append(title);
    }
    const cards=state.lookupHand.filter(c=>keeper.has(c));
    if(cards.length===0){
      const discard=document.createElement("span");
      discard.className="discard-all";
      discard.textContent="Discard all five cards";
      box.append(discard);
    }else{
      const row=document.createElement("div");
      row.className="mini-hand";
      cards.forEach(c=>row.append(miniCard(c)));
      box.append(row);
    }
    results.append(box);
  });
  el.lookupFeedback.append(results);
}

function renderLookup(){
  el.lookupHand.replaceChildren();
  state.lookupHand.forEach(c=>el.lookupHand.append(cardButton(c,{onClick:()=>removeLookupCard(c)})));
  for(let i=state.lookupHand.length;i<5;i++)el.lookupHand.append(cardButton(1,{placeholder:true}));

  el.rankPicker.replaceChildren();
  RANKS.forEach((r,index)=>{
    const b=document.createElement("button");
    b.type="button";b.className="picker-button"+(state.pendingRank===index?" active":"");
    b.textContent=r;b.disabled=state.lookupHand.length>=5;b.onclick=()=>chooseRank(index);
    el.rankPicker.append(b);
  });

  el.suitPicker.replaceChildren();
  SUITS.forEach((symbol,index)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="picker-button suit-button"+(index<2?" red":"");
    b.textContent=symbol;
    b.disabled=state.pendingRank===null||state.lookupHand.length>=5;
    b.onclick=()=>chooseSuit(index);
    el.suitPicker.append(b);
  });

  if(state.lookupHand.length===5){
    el.lookupPrompt.textContent="Hand complete. Tap a card to remove it, or find the best hold.";
  }else if(state.pendingRank===null){
    el.lookupPrompt.textContent=`Choose a rank (${state.lookupHand.length}/5 cards entered)`;
  }else{
    el.lookupPrompt.textContent=`Choose the suit for ${RANKS[state.pendingRank]}`;
  }

  el.findHold.disabled=!state.strategy||state.lookupHand.length!==5;
  renderLookupResults();
}

function findBestHold(){
  try{
    state.lookupResults=optimal(state.lookupHand);
    renderLookup();
  }catch(e){
    console.error(e);
    el.lookupFeedback.textContent="Strategy lookup failed for this hand. See the browser console.";
    el.lookupFeedback.className="lookup-feedback feedback error";
  }
}

async function loadURL(){
  status("Loading strategy...");
  const r=await fetch("./JacksOrBetterStrategy.json");
  if(!r.ok)throw new Error(r.status);
  state.strategy=await r.json();
  status(`Ready - ${Object.keys(state.strategy).length.toLocaleString()} hands loaded`);
  renderTraining();renderLookup();
}

async function loadFile(file){
  status("Reading selected strategy file...");
  state.strategy=JSON.parse(await file.text());
  status(`Ready - ${Object.keys(state.strategy).length.toLocaleString()} hands loaded`);
  renderTraining();renderLookup();
}

el.trainTab.onclick=()=>setMode("train");
el.lookupTab.onclick=()=>setMode("lookup");
el.check.onclick=check;
el.newHand.onclick=deal;
el.reset.onclick=()=>{state.attempts=0;state.correct=0;save();renderTraining();};
el.findHold.onclick=findBestHold;
el.clearLookup.onclick=clearLookup;
el.file.onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  try{await loadFile(f);}catch(err){console.error(err);status("That file could not be read as strategy JSON.","error");}
};

deal();renderLookup();
loadURL().catch(e=>{
  console.error(e);
  status("Strategy file not found. Put JacksOrBetterStrategy.json beside index.html, or load it below.","error");
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.error));
}
