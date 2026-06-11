

























(function () {

    const TARGET = "Over";

    const AUDIO_URL = "https://h.top4top.io/m_3813hz9bo1.mp3";
    const GIF_URL   = "https://j.top4top.io/p_3813to9oh1.gif";

    const shown = new Set();

    let GLOBAL_AUDIO = null;

    // 🔓 فتح الصوت للآيفون
    function initAudio() {
        if (GLOBAL_AUDIO) return;

        GLOBAL_AUDIO = new Audio(AUDIO_URL);
        GLOBAL_AUDIO.volume = 1;
        GLOBAL_AUDIO.preload = "auto";
    }

    document.addEventListener("touchend", () => {
        initAudio();
        console.log("🔓 Audio unlocked");
    }, { once: true });


    const observer = new MutationObserver(() => {

        document.querySelectorAll('.loginUserNameE1').forEach(el => {

            const username = el.innerText.trim();
            const box = el.closest('.loginItmsS1');

            if (!box || shown.has(box)) return;
            if (username !== TARGET) return;

            shown.add(box);

            initAudio();

            if (GLOBAL_AUDIO) {
                GLOBAL_AUDIO.currentTime = 0;
                GLOBAL_AUDIO.play().catch(() => {});
            }

            const popup = document.createElement("div");

            popup.innerHTML = `
                <div id="vipBox">

                    <div id="vipClose">✕</div>

                    <div id="vipName">${username}</div>

                    <img src="${GIF_URL}" id="vipGif">

                </div>
            `;

            document.body.appendChild(popup);

            const style = document.createElement("style");

            style.textContent = `

                #vipBox{
                    position:fixed;
                    top:15px;
                    left:50%;
                    transform:translateX(-50%);
                    z-index:999999;
                    animation:show .5s ease;
                    user-select:none;
                }

                #vipGif{
                    width:240px;
                    border-radius:12px;
                    box-shadow:0 0 20px rgba(0,0,0,.7);
                }

                #vipName{
                    position:absolute;
                    top:10px;
                    left:50%;
                    transform:translateX(-50%);
                    color:#fff;
                    font-size:18px;
                    font-weight:bold;
                    text-shadow:0 0 10px #000;
                    white-space:nowrap;
                }

                #vipClose{
                    position:absolute;
                    right:8px;
                    top:6px;
                    width:24px;
                    height:24px;
                    line-height:24px;
                    text-align:center;
                    cursor:pointer;
                    color:#fff;
                    background:rgba(0,0,0,.6);
                    border-radius:50%;
                    font-weight:bold;
                }

                #vipClose:hover{
                    background:rgba(0,0,0,.9);
                }

                @keyframes show{
                    from{
                        opacity:0;
                        transform:translateX(-50%) translateY(-15px);
                    }
                    to{
                        opacity:1;
                        transform:translateX(-50%) translateY(0);
                    }
                }

                @keyframes hide{
                    to{
                        opacity:0;
                        transform:translateX(-50%) scale(0.9);
                    }
                }

            `;

            document.head.appendChild(style);

            let closed = false;

            function close() {

                if (closed) return;
                closed = true;

                if (GLOBAL_AUDIO) {
                    GLOBAL_AUDIO.pause();
                    GLOBAL_AUDIO.currentTime = 0;
                }

                const boxEl = popup.querySelector("#vipBox");
                boxEl.style.animation = "hide .4s ease forwards";

                setTimeout(() => popup.remove(), 400);
            }

            popup.querySelector("#vipClose").onclick = close;

            // ⏱️ 6 ثواني
            setTimeout(close, 6000);

        });

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();




(function () {

    const TARGET = "شمنقا حبش";

    const AUDIO_URL = "https://h.top4top.io/m_3812v9hp71.mp3";
    const GIF_URL   = "https://c.top4top.io/p_3812co6xs1.gif";

    const shown = new Set();

    let GLOBAL_AUDIO = null;

    // 
    function initAudio() {
        if (GLOBAL_AUDIO) return;

        GLOBAL_AUDIO = new Audio(AUDIO_URL);
        GLOBAL_AUDIO.volume = 1;
        GLOBAL_AUDIO.preload = "auto";
    }

    // 
    document.addEventListener("touchend", () => {

        initAudio();

        console.log("🔓 Audio unlocked (no autoplay)");

    }, { once: true });


    const observer = new MutationObserver(() => {

        document.querySelectorAll('.loginUserNameE1').forEach(el => {

            const username = el.innerText.trim();
            const box = el.closest('.loginItmsS1');

            if (!box || shown.has(box)) return;
            if (username !== TARGET) return;

            shown.add(box);

            // 
            initAudio();

            if (GLOBAL_AUDIO) {
                GLOBAL_AUDIO.currentTime = 0;
                GLOBAL_AUDIO.play().catch(() => {});
            }

            // 
            const popup = document.createElement("div");

            popup.innerHTML = `
                <div id="vipBox">

                    <div id="vipClose">✕</div>

                    <div id="vipName">${username}</div>

                    <img src="${GIF_URL}" id="vipGif">

                </div>
            `;

            document.body.appendChild(popup);

            const style = document.createElement("style");

            style.textContent = `

                #vipBox{
                    position:fixed;
                    top:15px;
                    left:50%;
                    transform:translateX(-50%);
                    z-index:999999;
                    animation:show .5s ease;
                    user-select:none;
                }

                #vipGif{
                    width:240px;
                    border-radius:12px;
                    box-shadow:0 0 20px rgba(0,0,0,.7);
                }

                #vipName{
                    position:absolute;
                    top:10px;
                    left:50%;
                    transform:translateX(-50%);
                    color:#fff;
                    font-size:18px;
                    font-weight:bold;
                    text-shadow:0 0 10px #000;
                    white-space:nowrap;
                }

                #vipClose{
                    position:absolute;
                    right:8px;
                    top:6px;
                    width:24px;
                    height:24px;
                    line-height:24px;
                    text-align:center;
                    cursor:pointer;
                    color:#fff;
                    background:rgba(0,0,0,.6);
                    border-radius:50%;
                    font-weight:bold;
                }

                #vipClose:hover{
                    background:rgba(0,0,0,.9);
                }

                @keyframes show{
                    from{
                        opacity:0;
                        transform:translateX(-50%) translateY(-15px);
                    }
                    to{
                        opacity:1;
                        transform:translateX(-50%) translateY(0);
                    }
                }

                @keyframes hide{
                    to{
                        opacity:0;
                        transform:translateX(-50%) scale(0.9);
                    }
                }

            `;

            document.head.appendChild(style);

            let closed = false;

            function close() {

                if (closed) return;
                closed = true;

                if (GLOBAL_AUDIO) {
                    GLOBAL_AUDIO.pause();
                    GLOBAL_AUDIO.currentTime = 0;
                }

                const boxEl = popup.querySelector("#vipBox");
                boxEl.style.animation = "hide .4s ease forwards";

                setTimeout(() => popup.remove(), 400);
            }

            popup.querySelector("#vipClose").onclick = close;

            setTimeout(close, 10000);

        });

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();





(function () {

    const TARGET = "𝐍𝐀𝐈𝐅";
    const shown = new Set();

    const IMAGES = {
        eagle: "https://d.top4top.io/p_3812zywti1.png",
        crown: "https://e.top4top.io/p_38124z1a62.jpg"
    };

    const observer = new MutationObserver(() => {

        document.querySelectorAll('.loginUserNameE1').forEach(nameEl => {

            const username = nameEl.innerText.trim();
            const box = nameEl.closest('.loginItmsS1');

            if (!box || shown.has(box)) return;
            shown.add(box);

            // 🎯 فقط نايف
            if (username !== TARGET) return;

            box.style.display = "none";

            const wrap = document.createElement("div");

            wrap.innerHTML = `
                <div class="shadow-king">

                    <div class="smoke-layer"></div>
                    <div class="flash"></div>

                    <div class="top">
                        <img src="${IMAGES.eagle}" class="eagle">
                    </div>

                    <div class="crown-wrap">
                        <img src="${IMAGES.crown}" class="crown">
                    </div>

                    <div class="name">${username}</div>
                    <div class="sub">ترحيب خاص بالشيخ نايف 👑</div>

                    <div class="line"></div>

                </div>
            `;

            document.body.appendChild(wrap);

            const style = document.createElement("style");
            style.innerHTML = `

                .shadow-king{
                    position:fixed;
                    top:22%;
                    left:50%;
                    transform:translate(-50%,-50%) scale(0.12);
                    width:340px;
                    padding:16px;
                    border-radius:14px;
                    text-align:center;
                    font-family:Arial;
                    color:#fff;

                    background: radial-gradient(circle at top, #151515, #000);
                    border:1px solid rgba(255,255,255,0.08);

                    box-shadow:
                        0 0 30px rgba(0,0,0,0.95),
                        inset 0 0 20px rgba(0,0,0,0.85);

                    opacity:0;
                    animation:enter 0.9s ease forwards;
                    overflow:hidden;
                }

                .smoke-layer{
                    position:absolute;
                    inset:-60px;
                    background:
                        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.04), transparent 60%),
                        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03), transparent 60%),
                        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02), transparent 70%);
                    filter:blur(18px);
                    animation:smokeMove 6s infinite linear;
                    opacity:0.5;
                }

                .flash{
                    position:absolute;
                    inset:0;
                    background:white;
                    opacity:0;
                    pointer-events:none;
                    animation:flashAnim 6s infinite;
                }

                .top{
                    display:flex;
                    justify-content:center;
                    position:relative;
                    z-index:2;
                }

                .eagle{
                    width:70px;
                    height:70px;
                    object-fit:cover;
                    filter:drop-shadow(0 0 8px rgba(0,0,0,0.9));
                    animation:float 3s infinite ease-in-out;
                }

                .crown-wrap{
                    margin-top:6px;
                    position:relative;
                    z-index:2;
                }

                .crown{
                    width:85px;
                    filter:drop-shadow(0 0 8px rgba(0,0,0,0.9));
                    animation:float 2.5s infinite ease-in-out;
                }

                .name{
                    font-size:26px;
                    font-weight:bold;
                    margin-top:8px;
                    color:#f5f5f5;
                    text-shadow:0 0 10px rgba(0,0,0,1);
                }

                .sub{
                    font-size:12px;
                    opacity:0.75;
                    margin-top:3px;
                }

                .line{
                    height:1px;
                    margin-top:12px;
                    background:linear-gradient(90deg,transparent,#333,transparent);
                    animation:move 2s linear infinite;
                }

                @keyframes enter{
                    0%{
                        transform:translate(-50%,-50%) scale(0.12);
                        opacity:0;
                        filter:blur(12px);
                    }
                    60%{
                        transform:translate(-50%,-50%) scale(1.03);
                        opacity:1;
                    }
                    100%{
                        transform:translate(-50%,-50%) scale(1);
                        opacity:1;
                        filter:blur(0);
                    }
                }

                @keyframes smokeMove{
                    0%{transform:translateX(-10px) translateY(-10px);}
                    50%{transform:translateX(10px) translateY(10px);}
                    100%{transform:translateX(-10px) translateY(-10px);}
                }

                @keyframes flashAnim{
                    0%,92%,100%{opacity:0;}
                    93%{opacity:0.06;}
                }

                @keyframes float{
                    0%,100%{transform:translateY(0);}
                    50%{transform:translateY(-5px);}
                }

                @keyframes move{
                    0%{background-position:-200px;}
                    100%{background-position:200px;}
                }
            `;

            document.head.appendChild(style);

            // 
            setTimeout(() => {
                const el = wrap.querySelector(".shadow-king");
                el.style.opacity = "0";
                el.style.transform = "translate(-50%,-50%) scale(0.3)";
                el.style.filter = "blur(14px)";
                setTimeout(() => wrap.remove(), 900);
            }, 7000);

        });

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();




















(function () {

    const profile = document.querySelector(
        '#TH_WETCH .th-wetch-profile img.TH_TOP1'
    )?.closest('.th-wetch-profile');

    if (!profile) return;

    profile.style.position = 'relative';

    profile.querySelector('.ahmed-crown')?.remove();

    const size = Math.max(90, profile.offsetWidth * 0.55);

    const crown = document.createElement('img');
    crown.className = 'ahmed-crown';
    crown.src = 'https://g.top4top.io/p_380994wij1.png';

    crown.style.cssText = `
        position: absolute;
        top: -45px;
        left: 50%;
        width: ${size}px;
        height: auto;

        transform: translateX(-73%) rotate(-16deg) scale(0.5);

        z-index: 999999;
        pointer-events: none;
        clip-path: inset(0 0 8px 0);

        animation: crownAscend 1.2s ease-out forwards, crownGlow 3s ease-in-out 1.2s infinite;
    `;

    const energy = document.createElement('div');
    energy.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 220%;
        height: 220%;
        transform: translate(-50%, -50%) scale(2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 999997;

        background: radial-gradient(
            circle,
            rgba(255,215,0,0.35),
            rgba(255,215,0,0.15),
            transparent 70%
        );

        filter: blur(6px);
        animation: energyToCrown 1.2s ease-out forwards;
    `;

    profile.appendChild(energy);
    profile.appendChild(crown);

    for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');

        ring.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${180 + i * 40}%;
            height: ${180 + i * 40}%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999996;

            border: 1px solid rgba(255,215,0,${0.35 - i * 0.08});
            box-shadow: 0 0 20px rgba(255,215,0,0.25);

            animation: ringRotate ${4 + i}s linear infinite;
        `;

        profile.appendChild(ring);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes crownAscend {
            0% {
                opacity: 0;
                transform: translateX(-73%) translateY(-140px) scale(0.6) rotate(-16deg);
                filter: brightness(2);
            }
            60% {
                opacity: 1;
                transform: translateX(-73%) translateY(10px) scale(1.2) rotate(-16deg);
            }
            100% {
                transform: translateX(-73%) translateY(0) scale(1.1) rotate(-16deg);
            }
        }

        @keyframes energyToCrown {
            0% {
                transform: translate(-50%, -50%) scale(2.5);
                opacity: 0;
            }
            40% {
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(0.6);
                opacity: 0;
            }
        }

        @keyframes crownGlow {
            0% { filter: brightness(1.05) contrast(1.1); }
            50% { filter: brightness(1.4) contrast(1.3); }
            100% { filter: brightness(1.05) contrast(1.1); }
        }

        @keyframes ringRotate {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

})();











const ROOM_NAME = "روووم";

(function () {

if (!$("#classicRoomTheme").length) {

$("head").append(`
<style id="classicRoomTheme">

/* =========================
   ROOM BASE
========================= */

.special-room{
    position:relative !important;
    overflow:hidden !important;
    border-radius:12px !important;
    background:#181818 !important;
    border:1px solid #404040 !important;
    box-shadow:0 3px 12px rgba(0,0,0,.30);

    min-height:55px !important;

    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:10px 14px;

    transition:.3s ease;
}

/* VIP */
.special-room.vip-room{
    background:linear-gradient(135deg,#1a1a1a,#101010) !important;
    border:1px solid rgba(255,215,120,.25) !important;
    box-shadow:0 0 14px rgba(255,215,120,.08);
}

/* SHINE */
.special-room::after{
    content:"";
    position:absolute;
    top:0;
    left:-150%;
    width:35%;
    height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent);
    animation:shineMove 10s linear infinite;
}

@keyframes shineMove{
    100%{ left:200%; }
}

/* =========================
   STATUS DOT (IMAGE REPLACEMENT)
========================= */

.room-status-icon{
    width:10px;
    height:10px;
    border-radius:50%;
    margin-left:10px;
    flex-shrink:0;

    background:#7aa8ff;
    box-shadow:0 0 8px rgba(122,168,255,.4);
}

/* =========================
   COUNT BADGE
========================= */

.special-room .th-room-count{
    border-radius:999px !important;
    padding:4px 12px 4px 22px !important;
    font-size:11px !important;
    font-weight:700 !important;
}

.special-room .th-room-count:before{
    content:"●";
    position:absolute;
    left:8px;
    top:50%;
    transform:translateY(-50%);
    font-size:8px;
}



.room-clock{
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);

    font-size:10px;
    letter-spacing:1.5px;
    color:#cfcfcf;
}



.room-enter{
    animation: roomEnterAnim .4s ease;
}

@keyframes roomEnterAnim{
    0%{ transform:scale(.96) translateY(6px); opacity:0; }
    100%{ transform:scale(1) translateY(0); opacity:1; }
}

</style>
`);
}

/* =========================
   CLOCK
========================= */

function updateClock(){

    const now = new Date();

    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');

    $(".room-clock").text(`${h}:${m}`);
}

/* =========================
   COUNT COLORS
========================= */

function updateCountColor(room){

    const el = room.find(".th-room-count");
    const match = el.text().match(/\d+/);
    if(!match) return;

    const c = parseInt(match[0],10);

    if(c <= 1){
        el.css({
            background:"#1e1e1e",
            border:"1px solid #3a3a3a",
            color:"#bdbdbd"
        });
    }
    else if(c <= 3){
        el.css({
            background:"#2a2a2a",
            border:"1px solid #555",
            color:"#fff"
        });
    }
    else{
        el.css({
            background:"#2a220f",
            border:"1px solid #ffcc66",
            color:"#ffd27a"
        });
    }
}

/* =========================
   INIT ROOM (RUN ONCE ONLY)
========================= */

function initRoom(room){

    if(room.data("ready")) return;

    room.data("ready", true);

    room.addClass("special-room vip-room room-enter");

    /* remove image */
    room.find("img, .th-room-pic, [class*='pic']").remove();

    /* status dot */
    if(room.find(".room-status-icon").length === 0){
        room.prepend(`<div class="room-status-icon"></div>`);
    }

    /* clock */
    if(room.find(".room-clock").length === 0){
        room.prepend(`<div class="room-clock"></div>`);
    }

    updateCountColor(room);
}



function startObserver(){

    const observer = new MutationObserver((mutations) => {

        for(const m of mutations){

            for(const node of m.addedNodes){

                if(!(node instanceof HTMLElement)) continue;

                const room = $(node).closest(".th-room-item");

                if(!room.length) continue;

                const name = room.find(".th-room-topic").text().trim();

                if(name === ROOM_NAME){
                    initRoom(room);
                }
            }
        }

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}



startObserver();
setInterval(updateClock, 1000);

})();






const ranks = {
  "Gx": "#1",
  "شمنقا حبش": "#7",
  "𝙼𝚄𝙷𝙰𝙼𝙼𝙴𝙳 ,": "#0",
  "‎ ‎ حمد‎أ": "#فخم"
};

setInterval(() => {
  document.querySelectorAll('#users .uzr').forEach(el => {
    const span = el.querySelector('span.YtubeUh.uhash.thUserHash');
    if (!span) return;

    for (const [name, rank] of Object.entries(ranks)) {
      if (el.textContent.includes(name)) {
        if (span.textContent !== rank) {
          span.textContent = rank;
        }
        break;
      }
    }
  });
}, 100);













const rules = {
  "Gx": true,
  "شمنقا حبش": true,
  "𝙼𝚄𝙷𝙰𝙼𝙼𝙴𝙳 ,": true,
  "أحمد": true
};

function runUsers() {

  setInterval(() => {

    document.querySelectorAll('#users .uzr').forEach(el => {

      const hasMatch = Object.keys(rules).some(name =>
        el.textContent.includes(name)
      );

      if (!hasMatch) return;

      el.querySelectorAll('img.YtubeUh.co.ico, img.co.ico')
        .forEach(img => img.remove());

    });

  }, 200);

}

window.addEventListener('load', runUsers);


const targetUsers = [
  "Gx",
  "شمنقا حبش",
  "𝙼𝚄𝙷𝙰𝙼𝙼𝙴𝙳",
  "أحمد"
];

const removeText = "المملكة العربية السعودية";

function clean(t) {
  return (t || "")
    .replace(/[\u200e\u200f\u200b]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const observer = new MutationObserver(() => {

  document.querySelectorAll('.th-upro-modal').forEach(modal => {

    const name = clean(
      modal.querySelector('.profile-name, .th-upro-profile-name, .th-upro-title')
        ?.textContent
    );

 
    if (!targetUsers.some(u => name.includes(u))) return;

  
    modal.querySelectorAll('*').forEach(el => {

      const txt = clean(el.childNodes?.[0]?.nodeValue || el.textContent);

      if (txt.includes(removeText)) {

        if (clean(el.textContent) === removeText) {
          el.textContent = "";
        } 
        else {
          el.textContent = el.textContent.replace(removeText, "");
        }

      }

    });

  });

});

observer.observe(document.body, {
  childList: true,
  subtree: true
});







(() => {

  const targetUsers = ["Gx", "شمنقا حبش", "𝙼𝚄𝙷𝙰𝙼𝙼𝙴𝙳 ,", "أحمد"];

  function clean(t) {
    return (t || "")
      .replace(/[\u200e\u200f\u200b]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function run() {

    document.querySelectorAll('.uzr.uhtml').forEach(card => {

      const nameEl = card.querySelector('.u-topic, .th-uhtml-topic');
      const name = clean(nameEl?.textContent);

      if (!targetUsers.some(u => name.includes(u))) return;

      
      card.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || "";
        if (src.includes('/flag/')) img.remove();
      });

    });

  }

  setInterval(run, 200);

})();






