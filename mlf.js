(function () {

const WORKER_URL = "https://myboot.a7med-mads.workers.dev";

// =========================
// 🔥 STATE
// =========================
let muted = true;
let botName = localStorage.getItem("bot_name") || "سلطان";
let chatOpen = false;

// =========================
// 🔊 NOTIFICATION SOUND (جديد)
// =========================
function notifySound() {
    if (muted) return;

    const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-09.mp3");
    audio.volume = 0.35;
    audio.play();
}

// =========================
// 🔊 CLICK SOUND
// =========================
function clickSound() {
    if (muted) return;
    const a = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
    a.volume = 0.4;
    a.play();
}

// =========================
// 🔊 SPEECH
// =========================
function speak(text) {
    if (muted) return;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.85;
    u.pitch = 0.6;

    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}

// =========================
// 🧠 AI (مع اسم البوت الحقيقي)
// =========================
async function askAI(prompt) {

    const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt,
            user: "user",
            history: [],
            botName: botName   // 👈 مهم
        })
    });

    const data = await res.json();
    return data.reply || "...";
}

// =========================
// 🎨 STYLE (نفس كودك بدون تغيير)
// =========================
const style = document.createElement("style");
style.innerHTML = `
#botBtn{
    position:fixed;
    bottom:20px;
    right:20px;
    width:60px;
    height:60px;
    border-radius:50%;
    background:rgba(255,255,255,0.1);
    backdrop-filter:blur(15px);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:999999;
    cursor:pointer;
    font-size:22px;
}

#panel{
    position:fixed;
    bottom:90px;
    right:20px;
    width:360px;
    height:500px;
    background:rgba(0,0,0,0.7);
    backdrop-filter:blur(20px);
    border-radius:18px;
    display:none;
    flex-direction:column;
    overflow:hidden;
    color:white;
    z-index:999999;
}

#top{
    padding:10px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    background:rgba(255,255,255,0.05);
}

#msgs{
    flex:1;
    padding:10px;
    overflow:auto;
}

.msgU{text-align:right;margin:6px;color:#7dd3fc;}
.msgB{text-align:left;margin:6px;color:white;}

#inputBox{
    display:flex;
    border-top:1px solid rgba(255,255,255,0.1);
}

#input{
    flex:1;
    padding:10px;
    border:none;
    outline:none;
    background:transparent;
    color:white;
}

button{
    background:rgba(255,255,255,0.1);
    border:none;
    color:white;
    cursor:pointer;
    padding:10px;
}
`;
document.head.appendChild(style);

// =========================
// 🪟 UI
// =========================
const btn = document.createElement("div");
btn.id = "botBtn";
btn.innerHTML = "🤖";

const panel = document.createElement("div");
panel.id = "panel";

panel.innerHTML = `
<div id="top">
<span id="title">🤖 ${botName}</span>

<div>
<button id="muteBtn">🔊</button>
<button id="addBtn">＋</button>
<button id="setBtn">⚙️</button>
</div>

</div>

<div id="msgs"></div>

<div id="inputBox">
<input id="input" placeholder="اكتب..." />
<button id="send">➤</button>
</div>
`;

document.body.appendChild(btn);
document.body.appendChild(panel);

const msgs = panel.querySelector("#msgs");
const input = panel.querySelector("#input");

// =========================
// 💬 ADD
// =========================
function add(text, type){
    const div = document.createElement("div");
    div.className = type === "u" ? "msgU" : "msgB";
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

// =========================
// 🚀 SEND
// =========================
async function send(){

    const text = input.value.trim();
    if(!text) return;

    add(text,"u");
    input.value = "";

    clickSound();

    const reply = await askAI(text);

    // 👇 مهم: رد ديناميكي باسم البوت الحالي
    const finalReply = reply.replace(/سلطان/g, botName);

    add("👑 " + finalReply,"b");

    notifySound();   // 🔊 صوت وصول الرسالة
    speak(finalReply);
}

// =========================
// 🎛 CONTROLS
// =========================

// فتح/إغلاق
btn.onclick = ()=>{
    chatOpen = !chatOpen;
    panel.style.display = chatOpen ? "flex" : "none";
    clickSound();
};

// ميوت
panel.querySelector("#muteBtn").onclick = ()=>{
    muted = !muted;
    panel.querySelector("#muteBtn").textContent = muted ? "🔇" : "🔊";
};

// تغيير الاسم (محفوظ + فوري)
panel.querySelector("#setBtn").onclick = ()=>{

    const name = prompt("اسم البوت:", botName);

    if(!name || !name.trim()) return;

    botName = name.trim();
    localStorage.setItem("bot_name", botName);

    panel.querySelector("#title").textContent = "🤖 " + botName;
};

// إضافة (placeholder)
panel.querySelector("#addBtn").onclick = ()=>{
    alert("المحادثة الجماعية تحت التطوير 🔥");
};

panel.querySelector("#send").onclick = send;

input.addEventListener("keydown",(e)=>{
    if(e.key==="Enter") send();
});

console.log("👑 FIXED BOT READY");

})();

