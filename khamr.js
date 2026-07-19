(function () {

    const TARGETS = {
    "‎ ‎ ‎ ‏‎ ‎ ‏‎ owner | خـمَـر": {
        title: "👑 Owner || خـــمَـــر 👑"
    },

    "ᴹ": {
        title: "🌸 Owner || مــــلاك🌸"
    }
};
    const shown = new Set();

    const observer = new MutationObserver(() => {

        document.querySelectorAll('.loginUserNameE1').forEach(nameEl => {

          const username = nameEl.innerText.trim();
const box = nameEl.closest('.loginItmsS1');

if (!box || shown.has(box)) return;

if (!TARGETS[username]) return;

shown.add(box);



let userImage = "https://g.top4top.io/p_3851gaiwx1.png";

const pic = box.querySelector(".loginImgG1");

if (pic) {

    let bg = pic.style.backgroundImage || getComputedStyle(pic).backgroundImage;

    let url = bg.match(/url\(["']?(.*?)["']?\)/);

    if (url && url[1]) {

        userImage = url[1];

        if(userImage.startsWith("/")){
            userImage = location.origin + userImage;
        }

    }

}

            box.style.display = "none";

            const wrap = document.createElement("div");

                wrap.innerHTML = `
    <div class="shadow-king">

        <div class="flash"></div>

        <div class="title">
    ${TARGETS[username].title}
</div>

       <img src="${userImage}" class="welcome">

        <div class="name">${username}</div>

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
    width:260px;
    padding:10px;
    border-radius:18px;
    text-align:center;
    font-family:Arial;
    color:#fff;

    background:rgba(15,15,20,.45);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);

    border:2px solid rgba(255,215,120,.55);

    box-shadow:
        0 10px 30px rgba(0,0,0,.55),
        0 0 20px rgba(255,215,120,.18);

    opacity:0;
    overflow:hidden;

    animation:
        enter .9s ease forwards,
        pulse 2.8s ease-in-out infinite;
}

.shadow-king::before{
    content:"";
    position:absolute;
    top:-120%;
    left:-40%;
    width:55%;
    height:260%;
    transform:rotate(22deg);
    background:linear-gradient(
        to right,
        rgba(255,255,255,0),
        rgba(255,255,255,.18),
        rgba(255,255,255,0)
    );
    animation:shine 3.5s linear infinite;
}

.flash{
    position:absolute;
    inset:0;
    background:#fff;
    opacity:0;
    pointer-events:none;
    animation:flashAnim 6s infinite;
}

.title{
    position:absolute;
    top:12px;
    left:50%;
    transform:translateX(-50%);
    padding:6px 16px;
    border-radius:12px;
    background:linear-gradient(135deg,#ffe082,#b8860b);
    color:#111;
    font-size:15px;
    font-weight:900;
    white-space:nowrap;
    box-shadow:0 4px 12px rgba(0,0,0,.35);
    z-index:2;
}

.welcome{
    width:240px;
    height:140px;
    display:block;
    margin:38px auto 0;

    object-fit:cover;

    border-radius:14px;
    border:2px solid rgba(255,215,120,.75);

    box-shadow:
        0 6px 18px rgba(0,0,0,.45),
        0 0 16px rgba(255,215,120,.25);

    transition:.35s;
}

.shadow-king:hover .welcome{
    transform:scale(1.03);
}

.name{
    margin-top:10px;
    font-size:24px;
    font-weight:bold;
    color:#fff;
    text-shadow:0 0 10px #000;
}

@keyframes enter{
    0%{
        transform:translate(-50%,-50%) scale(.12);
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

@keyframes pulse{
    0%,100%{
        box-shadow:
            0 10px 30px rgba(0,0,0,.55),
            0 0 16px rgba(255,215,120,.15);
    }
    50%{
        box-shadow:
            0 12px 36px rgba(0,0,0,.6),
            0 0 28px rgba(255,215,120,.3);
    }
}

@keyframes shine{
    0%{
        left:-60%;
    }
    100%{
        left:120%;
    }
}

@keyframes flashAnim{
    0%,92%,100%{
        opacity:0;
    }
    93%{
        opacity:.06;
    }
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










$(`<style>
ul.nav.nav-tabs.fl li a {
    text-align: center;
    padding: 0px 0 !important;
    border: 0 solid #4c4b4b;
    color: #2E576E;
    border-radius: 25px;
    background: #fff;
}

ul.nav.nav-tabs.fl li {
    width: 33.3%;
    margin-left: 0;
    border-radius: 50px;
    margin-bottom: 5px !important;
}

div#l2 input#pass1,
div#l2 input#u2,
div#l3 input#pass2,
div#l3 input#u3 {
    padding: 0 !important;
    border-radius: 25px !important;
    border: 1px solid #e1e0e0;
    text-align: center;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 2px 2px rgb(107 32 49);
    height: 27px !important;
    width: 49% !important;
    float: right;
    margin: 2px 3px 2px 0;
}

div#l2 button,
div#l1 input#u1,
div#l3 button,
div#l1 button {
    border-radius: 24px !important;
    height: 27px;
    padding: 0 5px;
    width: 98%;
    margin-left: 4px;
    border-color: #FFFFFF !important;
    margin-top: 4px !important;
}

.nav-tabs {
    background-color: #bfbfbfa6 !important;
    border-radius: 24px !important;
    margin-top: 2px !important;
    float: right;
    padding: 3px 1px;
    border-top: 3px solid #2E576E;
    height: 30px !important;
}

#u1 {
    padding: 0 !important;
    margin-left: -6px;
    border-radius: 25px !important;
    text-align: center;
    height: 27px !important;
    width: 100% !important;
}

#tlogins .fa.fa-eye {
    position: relative;
    margin: -30px 17px 2px 0 !important;
    color: #fff !important;
}
</style>`).insertBefore('body');

$("body").append(`
<style>
#upro .light.fl.pro.break{
    background-color:#000!important;
    background-image:linear-gradient(225deg,#e5e8f7 0%,#fff 29%,#fafafc 67%,#e5e8f7 100%);
}
</style>
`);

$("body").append(`
<style>

#sultan{
    color:#f00!important;
}

#room .btn-primary,
#d0 .label-primary,
#settings .label-primary,
#settings .btn-primary,
.corner.border.label.label-primary,
.modal-header.label-primary,
.head.d-flex.nosel.bg.fl,
.rsave.btn.btn-primary.fr,
.fa.fa-send.sndpm.fl.btn.btn-primary,
.fr.fa.fa-share-alt.sndfile.fl.btn.btn-primary,
.fr.fa.fa-share-alt.sndfilebc.fl.btn.btn-primary,
.bdel.corner.btn.minix.btn-primary.fa.fa-times,
.fa.fa-send.sndbc.fl.btn.btn-primary,
.btn.btn-primary.u-nickc.fr.fa.fa-save,
.label.fl.label-primary,
button.rsave.btn.btn-primary.fl,
#users .nosel.ninr.fl.uzr.label.bg{
    border-radius:0 8px 0 8px!important;
    border:1px solid #000;
    background-image:url(https://up6.cc/2025/02/173912904532253.png);
    background-size:cover;
    color:#fff;
}

#room #mic{
    background-image:url(https://up6.cc/2025/02/173912904532253.png);
    background-size:cover;
    border-radius:0 6px 6px 6px!important;
}

</style>
`);

$('.nonot').remove();

const ranks = {
  "ᴹ": "#حلوه",
  "‎ ‎ ‎ ‏‎ ‎ ‏‎ owner | خـمَـر": "#صاحبة الموقع"
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



setInterval(() => {
    $("#users .uzr").each(function () {

        if ($(this).text().includes("خـمَـر")) {

          
            $(this).find(".YtubeCo").css({
                "position": "relative",
                "margin-left": "auto",
                "top": "-70px"
            });

           
            $(this).find(".YtubeUh.uhash.thUserHash").css({
                "position": "relative",
                "right": "0px",
                "top": "-65px",
                "margin-right": "4px"
            });

        }

    });
}, 100);



