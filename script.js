const from = document.getElementById("fromCurrency");
const to = document.getElementById("toCurrency");

// 🌍 currency → country flag mapping
const flagMap = {
USD:"🇺🇸", INR:"🇮🇳", EUR:"🇪🇺", GBP:"🇬🇧", JPY:"🇯🇵",
AUD:"🇦🇺", CAD:"🇨🇦", CNY:"🇨🇳", CHF:"🇨🇭", RUB:"🇷🇺",
SGD:"🇸🇬", AED:"🇦🇪", NZD:"🇳🇿", KRW:"🇰🇷", BRL:"🇧🇷",
ZAR:"🇿🇦", SEK:"🇸🇪", NOK:"🇳🇴", MXN:"🇲🇽", HKD:"🇭🇰"
};

// load currencies
async function loadCurrencies(){
  let res = await fetch("https://api.frankfurter.app/currencies");
  let data = await res.json();

  for(let code in data){

    let flag = flagMap[code] || "🌍";

    let option1 = document.createElement("option");
    let option2 = document.createElement("option");

    option1.value = code;
    option1.text = `${flag} ${code} - ${data[code]}`;

    option2.value = code;
    option2.text = `${flag} ${code} - ${data[code]}`;

    from.appendChild(option1);
    to.appendChild(option2);
  }

  from.value="USD";
  to.value="INR";
}

loadCurrencies();
// 🔁 PERFECT SWAP FUNCTION
document.getElementById("swap").addEventListener("click", function(){

    let fromVal = from.value;
    let toVal = to.value;

    // swap dropdown values
    from.value = toVal;
    to.value = fromVal;

    // if amount exists → auto convert again
    let amount = document.getElementById("amount").value;
    if(amount && amount > 0){
        convertCurrency();
    }

    // refresh AI
    smartAI();
});




// theme toggle
document.getElementById("themeToggle").onclick=()=>{
  document.body.classList.toggle("light");
};



// convert function
async function convertCurrency(){
  let btn = document.getElementById("convertBtn");
  btn.innerText = "Converting...";
  btn.disabled = true;

  let amount = document.getElementById("amount").value;
  let fromCur = from.value;
  let toCur = to.value;

  if(amount===""){
    alert("Enter amount");
    btn.innerText="Convert Now";
    btn.disabled=false;
    return;
  }


  let url = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`;
  let res = await fetch(url);
  let data = await res.json();

  let result = data.rates[toCur];
  addHistory(`${amount} ${fromCur} → ${result.toFixed(2)} ${toCur}`);
  


  document.getElementById("result").innerText =
    `${amount} ${fromCur} = ${result.toFixed(2)} ${toCur}`;

  document.getElementById("rate").innerText =
    `1 ${fromCur} = ${(result/amount).toFixed(2)} ${toCur}`;
    smartAI();
  btn.innerText="Convert Now";
  btn.disabled=false;


}
// 🔥 LIVE TICKER DATA
async function updateTicker(){
  try{
    let res = await fetch("https://api.frankfurter.app/latest?from=USD&to=INR,EUR,GBP,JPY,AUD,CAD");
    let data = await res.json();
    let r = data.rates;

    document.querySelector(".ticker").innerHTML = `
      <span>USD → INR: ${r.INR}</span>
      <span>USD → EUR: ${r.EUR}</span>
      <span>USD → GBP: ${r.GBP}</span>
      <span>USD → JPY: ${r.JPY}</span>
      <span>USD → AUD: ${r.AUD}</span>
      <span>USD → CAD: ${r.CAD}</span>
    `;
  }catch(e){
    console.log("ticker error");
  }
}

updateTicker();
setInterval(updateTicker,60000);
// 🤖 SMART AI ANALYSIS
// 🤖 REAL SMART AI ANALYSIS (LIVE + AUTO)
async function smartAI(){

let amount = document.getElementById("amount").value;
if(amount==="" || amount<=0){
  document.getElementById("aiText").innerText = "Enter amount to get smart AI suggestion";
  return;
}

let fromCur = from.value;

try{
let res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=INR,EUR,GBP,JPY,AUD,CAD,SGD,USD,AED,CNY`);
let data = await res.json();
let rates = data.rates;

let bestCurrency="";
let bestValue=0;

// find best currency
for(let cur in rates){
  if(rates[cur] > bestValue){
    bestValue = rates[cur];
    bestCurrency = cur;
  }
}

document.getElementById("aiText").innerText =
`🤖 AI Insight: Best conversion from ${fromCur} is ${bestCurrency}.
You will receive highest value ≈ ${bestValue.toFixed(2)}.
Recommended for maximum return 🚀`;

}catch(e){
document.getElementById("aiText").innerText="AI analyzing market...";
}
}


// 🔥 AUTO AI UPDATE WHEN USER CHANGES INPUT
document.getElementById("amount").addEventListener("input", smartAI);
from.addEventListener("change", smartAI);
to.addEventListener("change", smartAI);
function addHistory(text){
let ul = document.getElementById("historyList");
let li = document.createElement("li");
li.innerText = text;

ul.prepend(li);

if(ul.children.length > 5){
  ul.removeChild(ul.lastChild);
}
}
// 📜 add to history
function addHistory(text){
let ul = document.getElementById("historyList");
let li = document.createElement("li");
li.innerText = text;

ul.prepend(li);

if(ul.children.length > 5){
  ul.removeChild(ul.lastChild);
}
}

// 🔘 toggle popup
function toggleHistory(){
let box = document.getElementById("historyPopup");
box.style.display = box.style.display === "block" ? "none" : "block";
}
