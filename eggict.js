(() => {
    /* =========================================================
       🔥 إزالة أي نسخة سابقة من إصلاح سكرول المتواجدين
    ========================================================= */
    $('#TH_USERS_SCROLL_FIX').remove();
    const oldUsers = document.getElementById('users');
    if (oldUsers) {
        oldUsers.removeAttribute('data-th-users-scroll-fixed');
        oldUsers.removeAttribute('data-th-users-scroll');
    }
    /* =========================================================
       🛡️ تفعيل سكرول #users
    ========================================================= */
    $('head').append(`
        <style id="TH_USERS_SCROLL_FIX">
            #users {
                height: 100% !important;
                width: 100% !important;
                box-sizing: border-box !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                min-height: 0 !important;
                -webkit-overflow-scrolling: touch !important;
                overscroll-behavior-y: contain !important;
                touch-action: pan-y !important;
            }
            #users,
            #users * {
                max-width: 100%;
            }
            #users::-webkit-scrollbar {
                width: 5px !important;
            }
            #users::-webkit-scrollbar-track {
                background: transparent !important;
            }
            #users::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,.16) !important;
                border-radius: 10px !important;
            }
            #users::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,.28) !important;
            }
        </style>
    `);
    /* =========================================================
       🔒 مراقبة #users
    ========================================================= */
    const TH_USERS_PROTECT = new MutationObserver(() => {
        const users = document.getElementById('users');
        if (!users) return;
        users.style.setProperty(
            'overflow-y',
            'auto',
            'important'
        );
        users.style.setProperty(
            'overflow-x',
            'hidden',
            'important'
        );
        users.style.setProperty(
            'height',
            '100%',
            'important'
        );
        users.style.setProperty(
            'min-height',
            '0',
            'important'
        );
        users.style.setProperty(
            '-webkit-overflow-scrolling',
            'touch',
            'important'
        );
        users.style.setProperty(
            'touch-action',
            'pan-y',
            'important'
        );
    });
    TH_USERS_PROTECT.observe(
        document.documentElement,
        {
            attributes: true,
            attributeFilter: ['style', 'class'],
            subtree: true
        }
    );
    /* =========================================================
       ✅ تطبيق مباشر
    ========================================================= */
    const users = document.getElementById('users');
    if (users) {
        users.style.setProperty(
            'overflow-y',
            'auto',
            'important'
        );
        users.style.setProperty(
            'overflow-x',
            'hidden',
            'important'
        );
        users.style.setProperty(
            'height',
            '100%',
            'important'
        );
        users.style.setProperty(
            'min-height',
            '0',
            'important'
        );
        users.style.setProperty(
            '-webkit-overflow-scrolling',
            'touch',
            'important'
        );
        users.style.setProperty(
            'touch-action',
            'pan-y',
            'important'
        );
    }
})();
(function () {
    $(document).off('mousedown.TH_UPRO_OUTSIDE');
    $(document).on(
        'mousedown.TH_UPRO_OUTSIDE',
        function (e) {
            var $modal = $('#upro');
            if (
                !$modal.length ||
                !$modal.is(':visible')
            ) {
                return;
            }
            if (
                $(e.target)
                    .closest('#upro .th-upro-content')
                    .length
            ) {
                return;
            }
            $modal.modal('hide');
        }
    );
})();
(function () {
    'use strict';
    /* =========================================================
       CLEAN OLD VERSION
    ========================================================= */
    $('#TH_EFFECTS_CSS').remove();
    $('#TH_EFFECTS_MENU').remove();
    $(document).off('.TH_EFFECTS_CSS');
    $(document).off('.TH_EXTRA_EFFECTS');
    /* =========================================================
       CSS
    ========================================================= */
    $('<style id="TH_EFFECTS_CSS">').text(`
/* =========================================================
   EFFECT 1 — SOFT WHITE SHINE
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_1 {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
    border-radius: 5px !important;
    background:
        linear-gradient(
            135deg,
            #ffffff 0%,
            #fcfcfc 45%,
            #ffffff 100%
        ) !important;
    border: 1px solid rgba(0,0,0,.10) !important;
    box-shadow:
        0 2px 9px rgba(0,0,0,.10),
        inset 0 0 12px rgba(255,255,255,.95) !important;
    animation:
        TH_SHINE_PULSE
        4s
        ease-in-out
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_1::after {
    content: "";
    position: absolute;
    top: -20%;
    left: -55%;
    width: 38%;
    height: 140%;
    pointer-events: none;
    z-index: 100;
    transform: skewX(-18deg);
    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.10),
            rgba(255,255,255,.75),
            rgba(255,255,255,.10),
            transparent
        );
    filter: blur(1px);
    animation:
        TH_SHINE_MOVE
        4.5s
        ease-in-out
        infinite;
}
@keyframes TH_SHINE_MOVE {
    0%,25% {
        left: -55%;
        opacity: 0;
    }
    38% {
        opacity: .75;
    }
    65% {
        left: 120%;
        opacity: .65;
    }
    75%,100% {
        left: 120%;
        opacity: 0;
    }
}
@keyframes TH_SHINE_PULSE {
    0%,100% {
        box-shadow:
            0 2px 8px rgba(0,0,0,.08),
            inset 0 0 10px rgba(255,255,255,.95);
    }
    50% {
        box-shadow:
            0 3px 11px rgba(0,0,0,.12),
            inset 0 0 16px rgba(255,255,255,1);
    }
}
/* =========================================================
   EFFECT 2 — WARNING
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_2 {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
    border-radius: 5px !important;
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #fffafa,
            #ffffff
        ) !important;
    border:
        1px solid
        rgba(145,0,0,.55) !important;
    outline: none !important;
    box-shadow:
        0 2px 9px
        rgba(120,0,0,.10),
        inset 0 0 12px
        rgba(255,255,255,.95) !important;
    animation:
        TH_WARNING_BORDER
        3.8s
        ease-in-out
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_2::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    padding: 1px;
    pointer-events: none;
    z-index: 50;
    background:
        conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 310deg,
            rgba(255,255,255,.10) 325deg,
            rgba(255,80,80,.60) 342deg,
            rgba(255,255,255,.90) 350deg,
            transparent 360deg
        );
    -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation:
        TH_WARNING_ORBIT
        4.5s
        linear
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_2::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    background:
        linear-gradient(
            90deg,
            rgba(180,0,0,.018),
            transparent 30%,
            transparent 70%,
            rgba(180,0,0,.018)
        );
    animation:
        TH_WARNING_SOFT
        3.5s
        ease-in-out
        infinite alternate;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_2 .u-topic {
    position: relative !important;
    font-weight: 800 !important;
    color: #900000 !important;
    text-shadow:
        0 1px 2px
        rgba(0,0,0,.08);
    animation:
        TH_WARNING_TEXT
        3.5s
        ease-in-out
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_2 .u-topic::before {
    content: "⚠";
    position: absolute;
    left: 6px;
    top: 50%;
    transform:
        translateY(-50%)
        scale(.82);
    font-size: 13px;
    color:
        rgba(150,0,0,.55);
    opacity: .55;
    pointer-events: none;
    animation:
        TH_WARNING_MARK
        2.8s
        ease-in-out
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_2 .fa-bullhorn {
    color: #a00000 !important;
    font-weight: 800 !important;
    text-shadow:
        0 0 3px
        rgba(180,0,0,.20);
    animation:
        TH_WARNING_ICON
        2.5s
        ease-in-out
        infinite alternate;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_2 .u-msg {
    position: relative !important;
    border-top:
        1px solid
        rgba(150,0,0,.08);
    border-bottom:
        1px solid
        rgba(150,0,0,.06);
}
@keyframes TH_WARNING_ORBIT {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes TH_WARNING_BORDER {
    0%,100% {
        box-shadow:
            0 2px 8px
            rgba(120,0,0,.08),
            inset 0 0 12px
            rgba(255,255,255,.95);
    }
    50% {
        box-shadow:
            0 3px 12px
            rgba(140,0,0,.14),
            inset 0 0 16px
            rgba(255,255,255,1);
    }
}
@keyframes TH_WARNING_SOFT {
    from {
        opacity: .35;
    }
    to {
        opacity: .80;
    }
}
@keyframes TH_WARNING_TEXT {
    0%,100% {
        opacity: 1;
    }
    50% {
        opacity: .88;
    }
}
@keyframes TH_WARNING_MARK {
    0%,100% {
        opacity: .30;
        transform:
            translateY(-50%)
            scale(.78);
    }
    50% {
        opacity: .70;
        transform:
            translateY(-50%)
            scale(.92);
    }
}
@keyframes TH_WARNING_ICON {
    from {
        transform: scale(1);
    }
    to {
        transform: scale(1.06);
    }
}
/* =========================================================
   EFFECT 3 — CELEBRATION
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3 {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
    border-radius: 5px !important;
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #fffdf8,
            #ffffff
        ) !important;
    border:
        1px solid
        rgba(205,160,35,.55) !important;
    outline: none !important;
    box-shadow:
        0 2px 10px
        rgba(0,0,0,.09),
        inset 0 0 14px
        rgba(255,255,255,.95) !important;
    animation:
        TH_PARTY_BOX
        4s
        ease-in-out
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    padding: 1px;
    pointer-events: none;
    z-index: 50;
    background:
        conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 305deg,
            rgba(255,255,255,.10) 320deg,
            rgba(255,205,70,.55) 340deg,
            rgba(255,255,255,.95) 350deg,
            transparent 360deg
        );
    -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation:
        TH_PARTY_ORBIT
        5s
        linear
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3::after {
    content: "✦";
    position: absolute;
    top: 50%;
    left: 50%;
    transform:
        translate(-50%,-50%)
        scale(.8);
    font-size: 30px;
    color:
        rgba(230,175,45,.08);
    pointer-events: none;
    z-index: 5;
    animation:
        TH_PARTY_GLOW
        3s
        ease-in-out
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3 .u-topic {
    position: relative !important;
    font-weight: 800 !important;
    text-shadow:
        0 1px 2px
        rgba(0,0,0,.08);
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3 .u-topic::before {
    content: "✦";
    position: absolute;
    left: 7px;
    top: 50%;
    transform:
        translateY(-50%);
    font-size: 10px;
    color:
        rgba(215,165,45,.65);
    pointer-events: none;
    animation:
        TH_PARTY_STAR_LEFT
        2.8s
        ease-in-out
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3 .u-topic::after {
    content: "✦";
    position: absolute;
    right: 7px;
    top: 50%;
    transform:
        translateY(-50%);
    font-size: 10px;
    color:
        rgba(210,100,150,.45);
    pointer-events: none;
    animation:
        TH_PARTY_STAR_RIGHT
        3.1s
        ease-in-out
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3 .u-msg {
    position: relative !important;
    overflow: hidden !important;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3 .u-msg::before {
    content:
        "·   ✦   ·   ✧   ·";
    position: absolute;
    top: 2px;
    left: 50%;
    transform:
        translateX(-50%);
    width: 80%;
    text-align: center;
    font-size: 9px;
    letter-spacing: 3px;
    color:
        rgba(220,170,50,.65);
    opacity: .30;
    pointer-events: none;
    z-index: 20;
    animation:
        TH_PARTY_SPARKLE
        2.8s
        ease-in-out
        infinite alternate;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_3 .fa-bullhorn {
    font-weight: 800 !important;
    animation:
        TH_PARTY_ICON
        2s
        ease-in-out
        infinite alternate;
}
@keyframes TH_PARTY_ORBIT {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes TH_PARTY_BOX {
    0%,100% {
        box-shadow:
            0 2px 9px
            rgba(0,0,0,.08),
            inset 0 0 12px
            rgba(255,255,255,.95);
    }
    50% {
        box-shadow:
            0 3px 12px
            rgba(0,0,0,.11),
            0 0 10px
            rgba(230,175,50,.10),
            inset 0 0 16px
            rgba(255,255,255,1);
    }
}
@keyframes TH_PARTY_GLOW {
    0%,100% {
        opacity: .12;
        transform:
            translate(-50%,-50%)
            scale(.75)
            rotate(0deg);
    }
    50% {
        opacity: .30;
        transform:
            translate(-50%,-50%)
            scale(1)
            rotate(20deg);
    }
}
@keyframes TH_PARTY_STAR_LEFT {
    0%,100% {
        opacity: .25;
        transform:
            translateY(-50%)
            scale(.8)
            rotate(0deg);
    }
    50% {
        opacity: .70;
        transform:
            translateY(-50%)
            scale(1)
            rotate(45deg);
    }
}
@keyframes TH_PARTY_STAR_RIGHT {
    0%,100% {
        opacity: .20;
        transform:
            translateY(-50%)
            scale(.8)
            rotate(0deg);
    }
    50% {
        opacity: .60;
        transform:
            translateY(-50%)
            scale(1)
            rotate(-45deg);
    }
}
@keyframes TH_PARTY_SPARKLE {
    from {
        opacity: .18;
        transform:
            translateX(-50%)
            scale(.9);
    }
    to {
        opacity: .42;
        transform:
            translateX(-50%)
            scale(1.04);
    }
}
@keyframes TH_PARTY_ICON {
    from {
        transform:
            rotate(-2deg)
            scale(1);
    }
    to {
        transform:
            rotate(2deg)
            scale(1.06);
    }
}
/* =========================================================
   EFFECT 4 — FIXED BLACK BORDER
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_4 {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
    border-radius: 5px !important;
    background:
        linear-gradient(
            135deg,
            #ffffff 0%,
            #fafafa 50%,
            #ffffff 100%
        ) !important;
    border:
        1px solid #111 !important;
    outline: none !important;
    box-shadow:
        0 2px 9px
        rgba(0,0,0,.13),
        inset 0 0 12px
        rgba(255,255,255,.95) !important;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_4::before {
    content: "";
    position: absolute;
    width: 58px;
    height: 2px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 100;
    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.15),
            #ffffff,
            rgba(255,255,255,.15),
            transparent
        );
    box-shadow:
        0 0 4px
        rgba(255,255,255,.90),
        0 0 8px
        rgba(255,255,255,.45);
    opacity: .95;
    animation:
        TH_BORDER_LIGHT
        4s
        linear
        infinite;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_4::after {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: 4px;
    pointer-events: none;
    z-index: 20;
    background:
        linear-gradient(
            135deg,
            rgba(255,255,255,.20),
            transparent 25%,
            transparent 75%,
            rgba(255,255,255,.12)
        );
    box-shadow:
        inset 0 0 10px
        rgba(0,0,0,.05);
    opacity: .60;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_4 .u-msg {
    position: relative !important;
    z-index: 60 !important;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_4 .u-topic {
    position: relative !important;
    color: #111 !important;
    font-weight: 800 !important;
    letter-spacing: .2px !important;
    border-bottom:
        1px solid
        rgba(0,0,0,.10) !important;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_4 .fa-bullhorn {
    position: relative !important;
    color: #111 !important;
    font-weight: 900 !important;
    z-index: 110 !important;
    animation:
        TH_BORDER_ICON
        2.2s
        ease-in-out
        infinite alternate;
}
@keyframes TH_BORDER_LIGHT {
    0% {
        top: -1px;
        left: -58px;
        transform: rotate(0deg);
        opacity: 0;
    }
    5% {
        opacity: .95;
    }
    24% {
        top: -1px;
        left: calc(100% - 5px);
        transform: rotate(0deg);
    }
    25% {
        top: -5px;
        left: calc(100% - 1px);
        transform: rotate(90deg);
    }
    47% {
        top: calc(100% - 5px);
        left: calc(100% - 1px);
        transform: rotate(90deg);
    }
    48% {
        top: calc(100% - 1px);
        left: calc(100% - 5px);
        transform: rotate(180deg);
    }
    72% {
        top: calc(100% - 1px);
        left: -58px;
        transform: rotate(180deg);
    }
    73% {
        top: calc(100% - 5px);
        left: -1px;
        transform: rotate(270deg);
    }
    94% {
        top: -5px;
        left: -1px;
        transform: rotate(270deg);
        opacity: .95;
    }
    100% {
        top: -1px;
        left: -58px;
        transform: rotate(360deg);
        opacity: 0;
    }
}
@keyframes TH_BORDER_ICON {
    from {
        transform: scale(1);
    }
    to {
        transform: scale(1.05);
    }
}
/* =========================================================
   EFFECT 5 — FROGS 🐸
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_5 {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
    border-radius: 5px !important;
    background:
        linear-gradient(
            135deg,
            #ffffff 0%,
            #f8fff8 50%,
            #ffffff 100%
        ) !important;
    border:
        1px solid
        rgba(65,130,65,.30) !important;
    box-shadow:
        0 2px 10px
        rgba(0,0,0,.08),
        inset 0 0 15px
        rgba(100,180,100,.06) !important;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_5
> .TH_ANNOUNCEMENT_FROGS_LAYER {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    pointer-events: none !important;
    overflow: hidden !important;
    z-index: 15 !important;
}
.TH_ANNOUNCEMENT_FROG {
    position: absolute !important;
    display: block !important;
    width: 24px !important;
    height: 24px !important;
    line-height: 24px !important;
    font-size: 21px !important;
    pointer-events: none !important;
    user-select: none !important;
    opacity: .68 !important;
    filter:
        drop-shadow(
            0 1px 1px
            rgba(0,0,0,.12)
        );
    will-change:
        transform,
        left,
        top,
        opacity;
}
.TH_ANNOUNCEMENT_FROG_1 {
    left: 4%;
    bottom: 8%;
    animation:
        TH_ANN_FROG_JUMP_1
        5.8s
        ease-in-out
        infinite;
}
.TH_ANNOUNCEMENT_FROG_2 {
    left: 72%;
    bottom: 5%;
    animation:
        TH_ANN_FROG_JUMP_2
        6.7s
        ease-in-out
        infinite;
    animation-delay: -2.1s;
}
.TH_ANNOUNCEMENT_FROG_3 {
    left: 42%;
    bottom: 12%;
    animation:
        TH_ANN_FROG_JUMP_3
        7.2s
        ease-in-out
        infinite;
    animation-delay: -4s;
}
.TH_ANNOUNCEMENT_FROG_4 {
    left: 88%;
    bottom: 18%;
    animation:
        TH_ANN_FROG_JUMP_4
        6.3s
        ease-in-out
        infinite;
    animation-delay: -3s;
}
.TH_ANNOUNCEMENT_FROG_5 {
    left: 20%;
    bottom: 30%;
    opacity: .40 !important;
    font-size: 17px !important;
    animation:
        TH_ANN_FROG_JUMP_5
        8s
        ease-in-out
        infinite;
    animation-delay: -5s;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_5
> *:not(.TH_ANNOUNCEMENT_FROGS_LAYER) {
    position: relative;
    z-index: 50;
}
@keyframes TH_ANN_FROG_JUMP_1 {
    0%,100% {
        transform:
            translate(0,0)
            rotate(-4deg)
            scale(.92);
        opacity: .45;
    }
    12% {
        transform:
            translate(12px,-5px)
            rotate(4deg)
            scale(1);
    }
    25% {
        transform:
            translate(35px,-32px)
            rotate(-7deg)
            scale(1.02);
        opacity: .72;
    }
    38% {
        transform:
            translate(62px,0)
            rotate(6deg)
            scale(.92);
    }
    58% {
        transform:
            translate(90px,-4px)
            rotate(-4deg)
            scale(.96);
        opacity: .55;
    }
    75% {
        transform:
            translate(125px,-27px)
            rotate(5deg)
            scale(1);
    }
    88% {
        transform:
            translate(155px,0)
            rotate(-3deg)
            scale(.90);
    }
}
@keyframes TH_ANN_FROG_JUMP_2 {
    0%,100% {
        transform:
            translate(0,0)
            rotate(3deg)
            scale(.90);
        opacity: .38;
    }
    18% {
        transform:
            translate(-20px,-28px)
            rotate(-6deg)
            scale(1);
    }
    34% {
        transform:
            translate(-48px,0)
            rotate(5deg)
            scale(.94);
        opacity: .70;
    }
    52% {
        transform:
            translate(-73px,-35px)
            rotate(-5deg)
            scale(1.02);
    }
    69% {
        transform:
            translate(-105px,0)
            rotate(4deg)
            scale(.90);
        opacity: .48;
    }
    86% {
        transform:
            translate(-135px,-25px)
            rotate(-4deg)
            scale(.98);
    }
}
@keyframes TH_ANN_FROG_JUMP_3 {
    0%,100% {
        transform:
            translate(0,0)
            rotate(-3deg)
            scale(.88);
        opacity: .40;
    }
    20% {
        transform:
            translate(22px,-30px)
            rotate(5deg)
            scale(1);
    }
    40% {
        transform:
            translate(48px,0)
            rotate(-5deg)
            scale(.92);
        opacity: .66;
    }
    62% {
        transform:
            translate(75px,-24px)
            rotate(5deg)
            scale(1);
    }
    80% {
        transform:
            translate(102px,0)
            rotate(-4deg)
            scale(.90);
        opacity: .45;
    }
}
@keyframes TH_ANN_FROG_JUMP_4 {
    0%,100% {
        transform:
            translate(0,0)
            rotate(4deg)
            scale(.90);
        opacity: .40;
    }
    16% {
        transform:
            translate(-16px,-26px)
            rotate(-5deg)
            scale(1);
    }
    32% {
        transform:
            translate(-40px,0)
            rotate(5deg)
            scale(.92);
        opacity: .65;
    }
    55% {
        transform:
            translate(-67px,-30px)
            rotate(-5deg)
            scale(1.01);
    }
    73% {
        transform:
            translate(-95px,0)
            rotate(4deg)
            scale(.90);
        opacity: .45;
    }
}
@keyframes TH_ANN_FROG_JUMP_5 {
    0%,100% {
        transform:
            translate(0,0)
            rotate(-2deg)
            scale(.80);
        opacity: .20;
    }
    25% {
        transform:
            translate(25px,-22px)
            rotate(5deg)
            scale(.92);
        opacity: .45;
    }
    50% {
        transform:
            translate(58px,0)
            rotate(-4deg)
            scale(.82);
        opacity: .25;
    }
    75% {
        transform:
            translate(90px,-25px)
            rotate(4deg)
            scale(.92);
        opacity: .40;
    }
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_5::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
    background:
        radial-gradient(
            circle at 20% 80%,
            rgba(80,170,80,.07),
            transparent 28%
        ),
        radial-gradient(
            circle at 80% 70%,
            rgba(80,170,80,.06),
            transparent 25%
        );
    animation:
        TH_FROG_GLOW
        5s
        ease-in-out
        infinite alternate;
}
@keyframes TH_FROG_GLOW {
    from {
        opacity: .45;
    }
    to {
        opacity: .85;
    }
}
/* =========================================================
   EFFECT 6 — BUNNIES 🐇
   نط فعلي ومتتابع
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_6 {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
    border-radius: 5px !important;
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #fffafc,
            #ffffff
        ) !important;
    border:
        1px solid
        rgba(200,150,170,.35) !important;
    box-shadow:
        0 2px 10px rgba(0,0,0,.08),
        inset 0 0 14px rgba(255,255,255,.95) !important;
}
.TH_ANNOUNCEMENT_BUNNIES_LAYER {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    pointer-events: none !important;
    overflow: hidden !important;
    z-index: 15 !important;
}
.TH_ANNOUNCEMENT_BUNNY {
    position: absolute !important;
    display: block !important;
    width: 25px !important;
    height: 25px !important;
    line-height: 25px !important;
    font-size: 21px !important;
    pointer-events: none !important;
    user-select: none !important;
    opacity: .72 !important;
    filter:
        drop-shadow(
            0 1px 1px
            rgba(0,0,0,.10)
        );
    will-change:
        transform,
        opacity;
}
/* أرنب 1 */
.TH_ANNOUNCEMENT_BUNNY_1 {
    left: 2%;
    bottom: 3%;
    animation:
        TH_BUNNY_REAL_JUMP_1
        4.8s
        ease-in-out
        infinite;
}
/* أرنب 2 */
.TH_ANNOUNCEMENT_BUNNY_2 {
    left: 30%;
    bottom: 5%;
    animation:
        TH_BUNNY_REAL_JUMP_2
        5.3s
        ease-in-out
        infinite;
    animation-delay: -1.8s;
}
/* أرنب 3 */
.TH_ANNOUNCEMENT_BUNNY_3 {
    left: 58%;
    bottom: 4%;
    animation:
        TH_BUNNY_REAL_JUMP_3
        5.1s
        ease-in-out
        infinite;
    animation-delay: -3s;
}
/* أرنب 4 */
.TH_ANNOUNCEMENT_BUNNY_4 {
    left: 84%;
    bottom: 6%;
    animation:
        TH_BUNNY_REAL_JUMP_4
        4.9s
        ease-in-out
        infinite;
    animation-delay: -1s;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_6
> *:not(.TH_ANNOUNCEMENT_BUNNIES_LAYER) {
    position: relative;
    z-index: 50;
}
/* نط الأرنب الأول */
@keyframes TH_BUNNY_REAL_JUMP_1 {
    0%,
    100% {
        transform:
            translate(0,0)
            rotate(-6deg)
            scale(.90);
        opacity: .45;
    }
    10% {
        transform:
            translate(5px,-2px)
            rotate(3deg)
            scale(.96);
    }
    20% {
        transform:
            translate(18px,-30px)
            rotate(-8deg)
            scale(1.05);
        opacity: .78;
    }
    28% {
        transform:
            translate(31px,0)
            rotate(7deg)
            scale(.90);
    }
    40% {
        transform:
            translate(45px,-36px)
            rotate(-7deg)
            scale(1.08);
        opacity: .82;
    }
    49% {
        transform:
            translate(61px,0)
            rotate(6deg)
            scale(.91);
    }
    62% {
        transform:
            translate(79px,-28px)
            rotate(-7deg)
            scale(1.04);
        opacity: .70;
    }
    72% {
        transform:
            translate(94px,0)
            rotate(5deg)
            scale(.91);
    }
    86% {
        transform:
            translate(115px,-25px)
            rotate(-5deg)
            scale(1);
        opacity: .58;
    }
}
/* نط الأرنب الثاني */
@keyframes TH_BUNNY_REAL_JUMP_2 {
    0%,
    100% {
        transform:
            translate(0,0)
            rotate(5deg)
            scale(.88);
        opacity: .40;
    }
    14% {
        transform:
            translate(-7px,0)
            rotate(-3deg)
            scale(.95);
    }
    24% {
        transform:
            translate(-24px,-34px)
            rotate(8deg)
            scale(1.06);
        opacity: .80;
    }
    33% {
        transform:
            translate(-38px,0)
            rotate(-6deg)
            scale(.90);
    }
    46% {
        transform:
            translate(-55px,-29px)
            rotate(7deg)
            scale(1.05);
    }
    56% {
        transform:
            translate(-69px,0)
            rotate(-6deg)
            scale(.90);
    }
    69% {
        transform:
            translate(-88px,-37px)
            rotate(8deg)
            scale(1.08);
        opacity: .76;
    }
    79% {
        transform:
            translate(-104px,0)
            rotate(-5deg)
            scale(.90);
    }
    91% {
        transform:
            translate(-122px,-25px)
            rotate(5deg)
            scale(1);
    }
}
/* نط الأرنب الثالث */
@keyframes TH_BUNNY_REAL_JUMP_3 {
    0%,
    100% {
        transform:
            translate(0,0)
            rotate(-4deg)
            scale(.90);
        opacity: .42;
    }
    16% {
        transform:
            translate(8px,-3px)
            rotate(4deg)
            scale(.96);
    }
    28% {
        transform:
            translate(25px,-32px)
            rotate(-8deg)
            scale(1.07);
        opacity: .80;
    }
    37% {
        transform:
            translate(40px,0)
            rotate(6deg)
            scale(.90);
    }
    51% {
        transform:
            translate(59px,-30px)
            rotate(-6deg)
            scale(1.04);
    }
    61% {
        transform:
            translate(75px,0)
            rotate(5deg)
            scale(.91);
    }
    74% {
        transform:
            translate(95px,-35px)
            rotate(-7deg)
            scale(1.06);
        opacity: .72;
    }
    86% {
        transform:
            translate(111px,0)
            rotate(4deg)
            scale(.90);
    }
}
/* نط الأرنب الرابع */
@keyframes TH_BUNNY_REAL_JUMP_4 {
    0%,
    100% {
        transform:
            translate(0,0)
            rotate(5deg)
            scale(.88);
        opacity: .40;
    }
    13% {
        transform:
            translate(-6px,0)
            rotate(-3deg)
            scale(.95);
    }
    25% {
        transform:
            translate(-22px,-31px)
            rotate(7deg)
            scale(1.06);
        opacity: .78;
    }
    34% {
        transform:
            translate(-36px,0)
            rotate(-6deg)
            scale(.90);
    }
    48% {
        transform:
            translate(-54px,-38px)
            rotate(8deg)
            scale(1.08);
    }
    58% {
        transform:
            translate(-69px,0)
            rotate(-6deg)
            scale(.90);
    }
    72% {
        transform:
            translate(-90px,-28px)
            rotate(7deg)
            scale(1.04);
    }
    83% {
        transform:
            translate(-106px,0)
            rotate(-5deg)
            scale(.90);
    }
    93% {
        transform:
            translate(-121px,-23px)
            rotate(4deg)
            scale(1);
    }
}
/* =========================================================
   EFFECT 7 — HONEY 🍯
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_7 {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
    border-radius: 5px !important;
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #fffaf0,
            #ffffff
        ) !important;
    border:
        1px solid
        rgba(184,134,11,.35) !important;
    box-shadow:
        0 2px 10px
        rgba(0,0,0,.08),
        inset 0 0 14px
        rgba(255,210,80,.08) !important;
}
.TH_ANNOUNCEMENT_HONEY_LAYER {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    pointer-events: none !important;
    overflow: hidden !important;
    z-index: 15 !important;
}
.TH_ANNOUNCEMENT_HONEY {
    position: absolute !important;
    display: block !important;
    pointer-events: none !important;
    user-select: none !important;
    will-change:
        transform,
        opacity;
}
.TH_HONEY_JAR {
    font-size: 22px !important;
    line-height: 24px !important;
    filter:
        drop-shadow(
            0 1px 1px
            rgba(0,0,0,.12)
        );
    opacity: .76;
}
.TH_HONEY_DROP {
    font-size: 14px !important;
    line-height: 16px !important;
    opacity: .50;
}
.TH_HONEY_1 {
    left: 4%;
    top: 8%;
    animation:
        TH_HONEY_FLOAT_1
        5.8s
        ease-in-out
        infinite;
}
.TH_HONEY_2 {
    right: 7%;
    bottom: 5%;
    animation:
        TH_HONEY_FLOAT_2
        6.4s
        ease-in-out
        infinite;
    animation-delay: -2s;
}
.TH_HONEY_3 {
    left: 38%;
    bottom: 3%;
    animation:
        TH_HONEY_FLOAT_3
        6.8s
        ease-in-out
        infinite;
    animation-delay: -4s;
}
.TH_HONEY_4 {
    right: 27%;
    top: 3%;
    font-size: 12px !important;
    animation:
        TH_HONEY_DROP
        4.5s
        ease-in-out
        infinite;
    animation-delay: -1.5s;
}
.TH_HONEY_5 {
    left: 67%;
    bottom: 6%;
    font-size: 12px !important;
    animation:
        TH_HONEY_DROP
        4.9s
        ease-in-out
        infinite;
    animation-delay: -3s;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_7
> *:not(.TH_ANNOUNCEMENT_HONEY_LAYER) {
    position: relative;
    z-index: 50;
}
@keyframes TH_HONEY_FLOAT_1 {
    0%,100% {
        transform:
            translateY(0)
            rotate(-4deg)
            scale(.90);
        opacity: .50;
    }
    50% {
        transform:
            translateY(-9px)
            rotate(5deg)
            scale(1);
        opacity: .80;
    }
}
@keyframes TH_HONEY_FLOAT_2 {
    0%,100% {
        transform:
            translateY(0)
            rotate(4deg)
            scale(.88);
        opacity: .45;
    }
    50% {
        transform:
            translateY(-11px)
            rotate(-5deg)
            scale(1);
        opacity: .78;
    }
}
@keyframes TH_HONEY_FLOAT_3 {
    0%,100% {
        transform:
            translateY(0)
            rotate(-3deg)
            scale(.90);
        opacity: .42;
    }
    50% {
        transform:
            translateY(-8px)
            rotate(4deg)
            scale(1);
        opacity: .72;
    }
}
@keyframes TH_HONEY_DROP {
    0%,100% {
        transform:
            translateY(-4px)
            scale(.75);
        opacity: .10;
    }
    45% {
        transform:
            translateY(8px)
            scale(1);
        opacity: .65;
    }
    70% {
        transform:
            translateY(18px)
            scale(.82);
        opacity: .20;
    }
}
/* =========================================================
   EFFECT 8 — CUTE CATS 🐱
   جري داخل الإعلان
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_8 {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
    border-radius: 5px !important;
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #fff8fc,
            #ffffff
        ) !important;
    border:
        1px solid
        rgba(180,130,160,.30) !important;
    box-shadow:
        0 2px 10px
        rgba(0,0,0,.08),
        inset 0 0 15px
        rgba(255,180,220,.05) !important;
}
.TH_ANNOUNCEMENT_CATS_LAYER {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    pointer-events: none !important;
    overflow: hidden !important;
    z-index: 15 !important;
}
.TH_ANNOUNCEMENT_CAT {
    position: absolute !important;
    display: block !important;
    pointer-events: none !important;
    user-select: none !important;
    will-change:
        transform,
        opacity;
    filter:
        drop-shadow(
            0 1px 1px
            rgba(0,0,0,.10)
        );
}
/* القطة الأولى — من اليسار لليمين */
.TH_CAT_1 {
    left: -10%;
    bottom: 3%;
    font-size: 22px !important;
    animation:
        TH_CAT_RUN_1
        5.5s
        linear
        infinite;
}
/* القطة الثانية — من اليمين لليسار */
.TH_CAT_2 {
    right: -10%;
    bottom: 5%;
    font-size: 20px !important;
    animation:
        TH_CAT_RUN_2
        6s
        linear
        infinite;
    animation-delay: -2.2s;
}
/* القطة الثالثة — سريعة */
.TH_CAT_3 {
    left: 12%;
    bottom: 4%;
    font-size: 17px !important;
    animation:
        TH_CAT_RUN_3
        4.8s
        linear
        infinite;
    animation-delay: -3.2s;
}
/* القطة الرابعة — عكس الاتجاه */
.TH_CAT_4 {
    right: 18%;
    bottom: 3%;
    font-size: 16px !important;
    animation:
        TH_CAT_RUN_4
        5.2s
        linear
        infinite;
    animation-delay: -1.4s;
}
.uzr.d-flex.pmsgc.mm.TH_EFFECT_8
> *:not(.TH_ANNOUNCEMENT_CATS_LAYER) {
    position: relative;
    z-index: 50;
}
/* جري القطة الأولى */
@keyframes TH_CAT_RUN_1 {
    0% {
        transform:
            translateX(-25px)
            translateY(0)
            rotate(-4deg)
            scale(.86);
        opacity: 0;
    }
    7% {
        opacity: .50;
    }
    14% {
        transform:
            translateX(35px)
            translateY(-4px)
            rotate(5deg)
            scale(.94);
    }
    21% {
        transform:
            translateX(75px)
            translateY(1px)
            rotate(-5deg)
            scale(.88);
    }
    29% {
        transform:
            translateX(125px)
            translateY(-6px)
            rotate(5deg)
            scale(.98);
    }
    37% {
        transform:
            translateX(175px)
            translateY(0)
            rotate(-5deg)
            scale(.90);
    }
    45% {
        transform:
            translateX(230px)
            translateY(-7px)
            rotate(4deg)
            scale(1);
    }
    53% {
        transform:
            translateX(285px)
            translateY(0)
            rotate(-4deg)
            scale(.90);
    }
    62% {
        transform:
            translateX(345px)
            translateY(-6px)
            rotate(5deg)
            scale(.98);
    }
    71% {
        transform:
            translateX(405px)
            translateY(0)
            rotate(-4deg)
            scale(.90);
    }
    81% {
        transform:
            translateX(470px)
            translateY(-7px)
            rotate(4deg)
            scale(1);
    }
    91% {
        transform:
            translateX(535px)
            translateY(0)
            rotate(-3deg)
            scale(.88);
        opacity: .40;
    }
    100% {
        transform:
            translateX(610px)
            translateY(0)
            rotate(0deg)
            scale(.84);
        opacity: 0;
    }
}
/* جري القطة الثانية */
@keyframes TH_CAT_RUN_2 {
    0% {
        transform:
            translateX(25px)
            translateY(0)
            rotate(4deg)
            scale(.86);
        opacity: 0;
    }
    7% {
        opacity: .48;
    }
    15% {
        transform:
            translateX(-35px)
            translateY(-5px)
            rotate(-5deg)
            scale(.95);
    }
    23% {
        transform:
            translateX(-80px)
            translateY(1px)
            rotate(4deg)
            scale(.88);
    }
    31% {
        transform:
            translateX(-130px)
            translateY(-7px)
            rotate(-5deg)
            scale(.99);
    }
    40% {
        transform:
            translateX(-185px)
            translateY(0)
            rotate(4deg)
            scale(.89);
    }
    49% {
        transform:
            translateX(-245px)
            translateY(-7px)
            rotate(-4deg)
            scale(1);
    }
    58% {
        transform:
            translateX(-305px)
            translateY(0)
            rotate(5deg)
            scale(.90);
    }
    68% {
        transform:
            translateX(-370px)
            translateY(-6px)
            rotate(-4deg)
            scale(.98);
    }
    78% {
        transform:
            translateX(-435px)
            translateY(0)
            rotate(4deg)
            scale(.89);
    }
    89% {
        transform:
            translateX(-505px)
            translateY(-7px)
            rotate(-3deg)
            scale(.97);
        opacity: .36;
    }
    100% {
        transform:
            translateX(-580px)
            translateY(0)
            rotate(0deg)
            scale(.84);
        opacity: 0;
    }
}
/* القطة الثالثة — أسرع */
@keyframes TH_CAT_RUN_3 {
    0% {
        transform:
            translateX(0)
            translateY(0)
            rotate(-3deg)
            scale(.78);
        opacity: .15;
    }
    10% {
        opacity: .48;
    }
    18% {
        transform:
            translateX(50px)
            translateY(-5px)
            rotate(5deg)
            scale(.88);
    }
    27% {
        transform:
            translateX(100px)
            translateY(0)
            rotate(-4deg)
            scale(.80);
    }
    37% {
        transform:
            translateX(155px)
            translateY(-6px)
            rotate(5deg)
            scale(.92);
    }
    47% {
        transform:
            translateX(215px)
            translateY(0)
            rotate(-4deg)
            scale(.82);
    }
    58% {
        transform:
            translateX(280px)
            translateY(-5px)
            rotate(4deg)
            scale(.90);
    }
    69% {
        transform:
            translateX(345px)
            translateY(0)
            rotate(-3deg)
            scale(.82);
    }
    81% {
        transform:
            translateX(415px)
            translateY(-6px)
            rotate(4deg)
            scale(.91);
        opacity: .42;
    }
    100% {
        transform:
            translateX(510px)
            translateY(0)
            rotate(0deg)
            scale(.78);
        opacity: 0;
    }
}
/* القطة الرابعة — تجري من اليمين لليسار */
@keyframes TH_CAT_RUN_4 {
    0% {
        transform:
            translateX(0)
            translateY(0)
            rotate(3deg)
            scale(.78);
        opacity: .16;
    }
    12% {
        opacity: .48;
    }
    20% {
        transform:
            translateX(-48px)
            translateY(-5px)
            rotate(-5deg)
            scale(.88);
    }
    30% {
        transform:
            translateX(-98px)
            translateY(0)
            rotate(4deg)
            scale(.80);
    }
    40% {
        transform:
            translateX(-153px)
            translateY(-6px)
            rotate(-5deg)
            scale(.91);
    }
    50% {
        transform:
            translateX(-215px)
            translateY(0)
            rotate(4deg)
            scale(.82);
    }
    61% {
        transform:
            translateX(-280px)
            translateY(-5px)
            rotate(-4deg)
            scale(.90);
    }
    72% {
        transform:
            translateX(-350px)
            translateY(0)
            rotate(3deg)
            scale(.81);
    }
    84% {
        transform:
            translateX(-425px)
            translateY(-6px)
            rotate(-4deg)
            scale(.89);
        opacity: .40;
    }
    100% {
        transform:
            translateX(-520px)
            translateY(0)
            rotate(0deg)
            scale(.76);
        opacity: 0;
    }
}
/* =========================================================
   MENU
========================================================= */
#TH_EFFECTS_MENU {
    position: absolute;
    display: none;
    z-index: 999999;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 5px;
    box-shadow:
        0 5px 20px
        rgba(0,0,0,.2);
}
#TH_EFFECTS_MENU button {
    display: block;
    width: 150px;
    border: 0;
    background: transparent;
    padding: 9px 12px;
    text-align: right;
    cursor: pointer;
    border-radius: 5px;
}
#TH_EFFECTS_MENU button:hover {
    background: #f1f1f1;
}
.th-effects-btn {
    margin-right: 5px;
}
@media(max-width:600px) {
    .TH_ANNOUNCEMENT_BUNNY {
        font-size: 18px !important;
    }
    .TH_HONEY_JAR {
        font-size: 18px !important;
    }
    .TH_ANNOUNCEMENT_CAT {
        font-size: 18px !important;
    }
}
/* =========================================================
   EFFECT 9 — FROST 🧊
   صقيع + شهب باردة أكثر
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_9 {
    position:relative !important;
    overflow:hidden !important;
    isolation:isolate !important;
    border-radius:5px !important;
    background:linear-gradient(135deg,#ffffff,#f7fbfd,#ffffff) !important;
    border:1px solid rgba(125,165,178,.38) !important;
    box-shadow:0 2px 10px rgba(0,0,0,.08),inset 0 0 15px rgba(180,225,238,.08) !important;
}
.TH_FROST_BORDER_9,
.TH_METEOR_LAYER_9 {
    position:absolute !important;
    inset:0 !important;
    pointer-events:none !important;
    overflow:hidden !important;
}
.TH_FROST_BORDER_9 { z-index:20 !important; border-radius:18px 7px 18px 7px; }
.TH_METEOR_LAYER_9 { z-index:18 !important; }
.TH_FROST_BORDER_9::before{
    content:""; position:absolute; inset:-1px; border-radius:18px 7px 18px 7px;
    background:
      radial-gradient(ellipse 48px 34px at 0% 0%,rgba(105,138,150,.58),rgba(135,168,179,.42) 22%,rgba(170,201,210,.24) 42%,transparent 72%),
      radial-gradient(ellipse 42px 32px at 100% 0%,rgba(100,134,146,.55),rgba(135,168,179,.40) 23%,rgba(170,201,210,.22) 43%,transparent 73%),
      radial-gradient(ellipse 46px 34px at 0% 100%,rgba(100,135,148,.56),rgba(138,171,181,.40) 23%,rgba(173,202,211,.23) 44%,transparent 73%),
      radial-gradient(ellipse 50px 35px at 100% 100%,rgba(102,136,149,.58),rgba(138,171,182,.42) 22%,rgba(175,204,213,.24) 43%,transparent 73%);
    filter:blur(.35px);
}
.TH_FROST_BORDER_9::after{
    content:""; position:absolute; inset:0; border-radius:18px 7px 18px 7px;
    background:
      linear-gradient(135deg,transparent 39%,rgba(205,232,239,.62) 42%,rgba(100,140,153,.42) 48%,transparent 54%) top left/34px 28px no-repeat,
      linear-gradient(225deg,transparent 39%,rgba(205,232,239,.58) 42%,rgba(100,140,153,.40) 48%,transparent 54%) top right/31px 27px no-repeat,
      linear-gradient(45deg,transparent 39%,rgba(205,232,239,.58) 42%,rgba(100,140,153,.40) 48%,transparent 54%) bottom left/33px 28px no-repeat,
      linear-gradient(315deg,transparent 39%,rgba(205,232,239,.62) 42%,rgba(100,140,153,.42) 48%,transparent 54%) bottom right/35px 29px no-repeat;
}
.TH_FROST_ICE_9{position:absolute;width:10px;height:10px;pointer-events:none;opacity:.68;transform:rotate(45deg);background:linear-gradient(135deg,transparent 36%,rgba(220,241,247,.85) 41%,rgba(115,153,165,.65) 50%,transparent 56%),linear-gradient(45deg,transparent 36%,rgba(205,232,240,.80) 41%,rgba(105,145,158,.58) 50%,transparent 56%);filter:drop-shadow(0 0 2px rgba(205,235,242,.55)) drop-shadow(0 0 3px rgba(60,95,108,.25));animation:TH_ICE_GLOW_9 4s ease-in-out infinite;}
.TH_FROST_ICE_9.i1{left:3px;top:1px}.TH_FROST_ICE_9.i2{right:2px;top:1px;width:8px;height:8px;animation-delay:.8s}.TH_FROST_ICE_9.i3{left:2px;bottom:2px;width:8px;height:8px;animation-delay:1.6s}.TH_FROST_ICE_9.i4{right:3px;bottom:1px;width:11px;height:11px;animation-delay:2.4s}
@keyframes TH_ICE_GLOW_9{0%,100%{opacity:.42}50%{opacity:.82}}
.TH_FROST_SNOW_9{position:absolute;width:3px;height:3px;border-radius:50%;background:rgba(205,232,240,.78);box-shadow:0 0 3px rgba(210,240,247,.55),0 0 5px rgba(80,125,140,.22);pointer-events:none;animation:TH_SNOW_GLOW_9 3.5s ease-in-out infinite}
.TH_FROST_SNOW_9.s1{left:14px;top:3px}.TH_FROST_SNOW_9.s2{left:6px;top:12px;animation-delay:.5s}.TH_FROST_SNOW_9.s3{right:12px;top:4px;animation-delay:1s}.TH_FROST_SNOW_9.s4{right:5px;top:12px;animation-delay:1.5s}.TH_FROST_SNOW_9.s5{left:7px;bottom:10px;animation-delay:2s}.TH_FROST_SNOW_9.s6{right:13px;bottom:4px;animation-delay:2.5s}.TH_FROST_SNOW_9.s7{right:5px;bottom:12px;animation-delay:1.2s}
@keyframes TH_SNOW_GLOW_9{0%,100%{opacity:.30;transform:scale(.75)}50%{opacity:.85;transform:scale(1.2)}}
.TH_EFFECT_9 > *:not(.TH_FROST_BORDER_9):not(.TH_METEOR_LAYER_9){position:relative;z-index:50}
.TH_METEOR_9{position:absolute;width:var(--head);height:var(--height);border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff 0%,#eefaff 35%,#bce9ff 70%,rgba(125,200,235,.85) 100%);box-shadow:0 0 4px rgba(235,250,255,.95),0 0 9px rgba(130,205,240,.65);opacity:0;transform:rotate(38deg)}
.TH_METEOR_9::before{content:"";position:absolute;width:var(--tail);height:100%;right:calc(var(--tail) * -1 + 2px);top:0;clip-path:polygon(0% 50%,100% 0%,100% 100%);background:linear-gradient(90deg,rgba(225,248,255,.88),rgba(170,225,250,.58) 24%,rgba(120,195,235,.30) 48%,rgba(100,180,225,.10) 72%,transparent);filter:blur(.8px)}
.TH_METEOR_9::after{content:"";position:absolute;width:calc(var(--tail) * .82);height:1px;right:calc(var(--tail) * -.82 + 2px);top:50%;background:linear-gradient(90deg,rgba(255,255,255,.95),rgba(185,230,250,.38),transparent);transform:translateY(-50%)}
.TH_METEOR_9.big{--head:14px;--height:10px;--tail:170px}.TH_METEOR_9.medium{--head:9px;--height:6px;--tail:112px}.TH_METEOR_9.small{--head:6px;--height:4px;--tail:68px}.TH_METEOR_9.tiny{--head:4px;--height:2px;--tail:38px}
@keyframes TH_METEOR_FLOW_9{0%{opacity:0;transform:translate3d(0,0,0) rotate(38deg)}8%{opacity:1}48%{opacity:1}78%{opacity:.72}100%{opacity:0;transform:translate3d(520px,420px,0) rotate(38deg)}}
.TH_METEOR_9.flow{animation:TH_METEOR_FLOW_9 2.15s cubic-bezier(.18,.72,.25,1) forwards}
.TH_METEOR_DOT_9{position:absolute;width:var(--dot);height:var(--dot);border-radius:50%;background:#eaf9ff;box-shadow:0 0 4px rgba(225,249,255,.95),0 0 8px rgba(130,205,240,.55);opacity:0}
@keyframes TH_METEOR_DOT_FLOW_9{0%{opacity:0;transform:translate3d(0,0,0)}12%{opacity:.95}55%{opacity:.9}100%{opacity:0;transform:translate3d(390px,300px,0)}}
.TH_METEOR_DOT_9.flow{animation:TH_METEOR_DOT_FLOW_9 1.9s cubic-bezier(.18,.72,.25,1) forwards}
/* =========================================================
   EFFECT 10 — BLUE METEOR ☄️
   شهاب أزرق — 45 شهاب + 70 جسيم
========================================================= */
.uzr.d-flex.pmsgc.mm.TH_EFFECT_10{position:relative !important;overflow:hidden !important;isolation:isolate !important;border-radius:5px !important;background:linear-gradient(135deg,#ffffff,#f8fbff,#ffffff) !important;border:1px solid rgba(55,145,205,.38) !important;box-shadow:0 2px 10px rgba(0,0,0,.08),inset 0 0 15px rgba(50,150,220,.06) !important}
.TH_BLUE_METEOR_BORDER_10{position:absolute !important;inset:0 !important;pointer-events:none !important;z-index:99998 !important;overflow:hidden !important;border-radius:18px 7px 18px 7px}
.TH_BLUE_METEOR_BORDER_10 .glow{position:absolute;inset:0;border:2.5px solid rgba(55,145,205,.82);border-radius:18px 7px 18px 7px;box-shadow:0 0 3px rgba(70,160,220,.75),0 0 8px rgba(30,90,135,.55),0 0 16px rgba(10,35,55,.65),inset 0 0 7px rgba(10,30,45,.35);animation:TH_BLUE_BORDER_PULSE_10 3.2s ease-in-out infinite}
@keyframes TH_BLUE_BORDER_PULSE_10{0%,100%{opacity:.68;box-shadow:0 0 3px rgba(65,155,215,.6),0 0 8px rgba(25,75,110,.5),0 0 15px rgba(5,25,40,.6),inset 0 0 5px rgba(0,20,35,.3)}50%{opacity:.95;box-shadow:0 0 5px rgba(85,175,230,.85),0 0 10px rgba(35,105,150,.7),0 0 19px rgba(5,25,40,.75),inset 0 0 8px rgba(10,30,45,.4)}}
.TH_BLUE_METEOR_BORDER_10 .light{position:absolute;width:68px;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,rgba(95,180,225,.45),rgba(225,248,255,.95),rgba(75,155,205,.6),transparent);box-shadow:0 0 4px rgba(100,190,235,.7),0 0 9px rgba(40,120,170,.55);opacity:.75}
.TH_BLUE_METEOR_BORDER_10 .light.t{top:-1px;left:-80px;animation:TH_BLUE_TOP_10 3.8s linear infinite}.TH_BLUE_METEOR_BORDER_10 .light.b{bottom:-1px;right:-80px;animation:TH_BLUE_BOTTOM_10 3.8s linear infinite}
@keyframes TH_BLUE_TOP_10{0%{left:-80px;opacity:0}12%{opacity:.8}45%{left:100%;opacity:.8}45.1%,100%{left:100%;opacity:0}}
@keyframes TH_BLUE_BOTTOM_10{0%{right:-80px;opacity:0}12%{opacity:.8}45%{right:100%;opacity:.8}45.1%,100%{right:100%;opacity:0}}
.TH_BLUE_METEOR_BORDER_10 .corner{position:absolute;width:18px;height:18px;opacity:.65;filter:drop-shadow(0 0 3px rgba(120,205,245,.8)) drop-shadow(0 0 7px rgba(40,120,175,.45));animation:TH_BLUE_CORNER_10 3.4s ease-in-out infinite}.TH_BLUE_METEOR_BORDER_10 .tl{top:-1px;left:-1px;border-top:2px solid rgba(180,225,245,.95);border-left:2px solid rgba(75,155,205,.85);border-radius:18px 0 0 0}.TH_BLUE_METEOR_BORDER_10 .tr{top:-1px;right:-1px;border-top:2px solid rgba(150,215,240,.9);border-right:2px solid rgba(65,145,195,.8);border-radius:0 7px 0 0;animation-delay:.7s}.TH_BLUE_METEOR_BORDER_10 .bl{bottom:-1px;left:-1px;border-bottom:2px solid rgba(125,195,225,.85);border-left:2px solid rgba(55,135,185,.75);border-radius:0 0 0 18px;animation-delay:1.4s}.TH_BLUE_METEOR_BORDER_10 .br{bottom:-1px;right:-1px;border-bottom:2px solid rgba(140,205,235,.9);border-right:2px solid rgba(60,140,190,.8);border-radius:0 0 18px 0;animation-delay:2.1s}
@keyframes TH_BLUE_CORNER_10{0%,100%{opacity:.35;filter:drop-shadow(0 0 2px rgba(100,185,225,.4))}50%{opacity:1;filter:drop-shadow(0 0 4px rgba(190,235,255,.95)) drop-shadow(0 0 9px rgba(50,145,200,.65))}}
.TH_BLUE_METEOR_BORDER_10 .spark{position:absolute;width:4px;height:4px;border-radius:50%;background:#e8f8ff;box-shadow:0 0 4px #fff,0 0 8px rgba(100,190,235,.9),0 0 14px rgba(35,120,175,.65);opacity:0;animation:TH_BLUE_SPARK_10 3.6s ease-in-out infinite}.TH_BLUE_METEOR_BORDER_10 .s1{top:0;left:0;animation-delay:.4s}.TH_BLUE_METEOR_BORDER_10 .s2{top:0;right:0;animation-delay:1.3s}.TH_BLUE_METEOR_BORDER_10 .s3{bottom:0;right:0;animation-delay:2.2s}.TH_BLUE_METEOR_BORDER_10 .s4{bottom:0;left:0;animation-delay:3.1s}
@keyframes TH_BLUE_SPARK_10{0%,72%,100%{opacity:0;transform:scale(.4)}77%{opacity:.9;transform:scale(1.25)}84%{opacity:.2;transform:scale(.7)}}
.TH_BLUE_METEOR_BORDER_10::before{content:"";position:absolute;inset:2px;border:1px solid rgba(5,25,40,.48);border-radius:16px 5px 16px 5px;opacity:.75;box-shadow:inset 0 0 8px rgba(0,0,0,.28)}
.TH_BLUE_METEOR_BORDER_10::after{content:"";position:absolute;inset:0;border:2px solid rgba(155,220,245,.72);border-radius:18px 7px 18px 7px;opacity:0;animation:TH_BLUE_FLASH_10 5.5s ease-in-out infinite}
@keyframes TH_BLUE_FLASH_10{0%,67%,100%{opacity:0}71%{opacity:.65}74%{opacity:.12}77%{opacity:.45}81%{opacity:0}}
.TH_BLUE_METEOR_LAYER_10{position:absolute !important;inset:0 !important;overflow:hidden !important;pointer-events:none !important;z-index:99999 !important;display:none;opacity:0}
.TH_BLUE_METEOR_LAYER_10 i{position:absolute;width:7px;height:7px;border-radius:50%;background:#fff;opacity:0;box-shadow:0 0 4px #fff,0 0 9px #b9e5ff,0 0 16px #4ca8ff,0 0 24px rgba(40,140,255,.8);animation:TH_BLUE_COMET_10 2.35s cubic-bezier(.08,.62,.18,1) infinite}
.TH_BLUE_METEOR_LAYER_10 i::before{content:"";position:absolute;width:34px;height:3px;right:4px;top:2px;border-radius:999px;background:linear-gradient(90deg,transparent,rgba(55,150,255,.08),rgba(80,180,255,.45),rgba(210,240,255,.95));box-shadow:0 0 5px rgba(70,175,255,.8)}
.TH_BLUE_METEOR_LAYER_10 i::after{content:"";position:absolute;inset:-4px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95),rgba(100,200,255,.5) 40%,transparent 75%)}
.TH_BLUE_METEOR_LAYER_10 i:nth-child(1){left:0%;top:-12%;animation-delay:0s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(2){left:3%;top:-5%;animation-delay:.04s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(3){left:6%;top:8%;animation-delay:.08s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(4){left:9%;top:-15%;animation-delay:.12s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(5){left:12%;top:5%;animation-delay:.16s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(6){left:15%;top:-8%;animation-delay:.20s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(7){left:18%;top:12%;animation-delay:.24s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(8){left:21%;top:-14%;animation-delay:.28s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(9){left:24%;top:4%;animation-delay:.32s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(10){left:27%;top:-10%;animation-delay:.36s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(11){left:30%;top:10%;animation-delay:.40s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(12){left:33%;top:-16%;animation-delay:.44s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(13){left:36%;top:6%;animation-delay:.48s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(14){left:39%;top:-9%;animation-delay:.52s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(15){left:42%;top:14%;animation-delay:.56s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(16){left:45%;top:-13%;animation-delay:.60s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(17){left:48%;top:5%;animation-delay:.64s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(18){left:51%;top:-7%;animation-delay:.68s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(19){left:54%;top:13%;animation-delay:.72s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(20){left:57%;top:-15%;animation-delay:.76s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(21){left:60%;top:7%;animation-delay:.80s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(22){left:63%;top:-11%;animation-delay:.84s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(23){left:66%;top:11%;animation-delay:.88s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(24){left:69%;top:-14%;animation-delay:.92s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(25){left:72%;top:5%;animation-delay:.96s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(26){left:75%;top:-9%;animation-delay:1s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(27){left:78%;top:14%;animation-delay:1.04s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(28){left:81%;top:-13%;animation-delay:1.08s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(29){left:84%;top:6%;animation-delay:1.12s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(30){left:87%;top:-8%;animation-delay:1.16s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(31){left:90%;top:12%;animation-delay:1.20s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(32){left:93%;top:-15%;animation-delay:1.24s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(33){left:96%;top:7%;animation-delay:1.28s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(34){left:2%;top:20%;animation-delay:1.32s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(35){left:11%;top:18%;animation-delay:1.36s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(36){left:20%;top:22%;animation-delay:1.40s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(37){left:29%;top:17%;animation-delay:1.44s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(38){left:38%;top:21%;animation-delay:1.48s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(39){left:47%;top:18%;animation-delay:1.52s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(40){left:56%;top:22%;animation-delay:1.56s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(41){left:65%;top:17%;animation-delay:1.60s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(42){left:74%;top:21%;animation-delay:1.64s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(43){left:83%;top:18%;animation-delay:1.68s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(44){left:92%;top:22%;animation-delay:1.72s}.TH_BLUE_METEOR_LAYER_10 i:nth-child(45){left:50%;top:-18%;animation-delay:1.76s}
.TH_BLUE_METEOR_PARTICLES_10 b{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;opacity:0;box-shadow:0 0 4px #fff,0 0 8px #5eb5ff;animation:TH_BLUE_PARTICLE_10 1.7s linear infinite}
.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(1){left:2%;top:4%;animation-delay:.02s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(2){left:5%;top:12%;animation-delay:.06s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(3){left:8%;top:20%;animation-delay:.10s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(4){left:11%;top:7%;animation-delay:.14s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(5){left:14%;top:16%;animation-delay:.18s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(6){left:17%;top:5%;animation-delay:.22s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(7){left:20%;top:23%;animation-delay:.26s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(8){left:23%;top:10%;animation-delay:.30s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(9){left:26%;top:18%;animation-delay:.34s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(10){left:29%;top:6%;animation-delay:.38s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(11){left:32%;top:21%;animation-delay:.42s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(12){left:35%;top:8%;animation-delay:.46s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(13){left:38%;top:17%;animation-delay:.50s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(14){left:41%;top:5%;animation-delay:.54s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(15){left:44%;top:23%;animation-delay:.58s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(16){left:47%;top:11%;animation-delay:.62s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(17){left:50%;top:19%;animation-delay:.66s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(18){left:53%;top:6%;animation-delay:.70s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(19){left:56%;top:22%;animation-delay:.74s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(20){left:59%;top:13%;animation-delay:.78s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(21){left:62%;top:5%;animation-delay:.82s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(22){left:65%;top:20%;animation-delay:.86s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(23){left:68%;top:9%;animation-delay:.90s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(24){left:71%;top:17%;animation-delay:.94s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(25){left:74%;top:4%;animation-delay:.98s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(26){left:77%;top:22%;animation-delay:1.02s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(27){left:80%;top:10%;animation-delay:1.06s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(28){left:83%;top:18%;animation-delay:1.10s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(29){left:86%;top:6%;animation-delay:1.14s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(30){left:89%;top:21%;animation-delay:1.18s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(31){left:92%;top:9%;animation-delay:1.22s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(32){left:95%;top:17%;animation-delay:1.26s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(33){left:98%;top:5%;animation-delay:1.30s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(34){left:4%;top:32%;animation-delay:1.34s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(35){left:13%;top:38%;animation-delay:1.38s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(36){left:22%;top:30%;animation-delay:1.42s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(37){left:31%;top:42%;animation-delay:1.46s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(38){left:40%;top:34%;animation-delay:1.50s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(39){left:49%;top:40%;animation-delay:1.54s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(40){left:58%;top:32%;animation-delay:1.58s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(41){left:67%;top:44%;animation-delay:1.62s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(42){left:76%;top:36%;animation-delay:1.66s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(43){left:85%;top:42%;animation-delay:1.70s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(44){left:94%;top:34%;animation-delay:1.74s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(45){left:8%;top:52%;animation-delay:.12s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(46){left:18%;top:60%;animation-delay:.20s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(47){left:28%;top:55%;animation-delay:.28s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(48){left:38%;top:64%;animation-delay:.36s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(49){left:48%;top:58%;animation-delay:.44s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(50){left:58%;top:68%;animation-delay:.52s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(51){left:68%;top:56%;animation-delay:.60s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(52){left:78%;top:65%;animation-delay:.68s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(53){left:88%;top:58%;animation-delay:.76s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(54){left:96%;top:68%;animation-delay:.84s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(55){left:5%;top:74%;animation-delay:.10s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(56){left:15%;top:84%;animation-delay:.18s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(57){left:25%;top:76%;animation-delay:.26s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(58){left:35%;top:88%;animation-delay:.34s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(59){left:45%;top:80%;animation-delay:.42s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(60){left:55%;top:92%;animation-delay:.50s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(61){left:65%;top:78%;animation-delay:.58s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(62){left:75%;top:90%;animation-delay:.66s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(63){left:85%;top:82%;animation-delay:.74s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(64){left:95%;top:94%;animation-delay:.82s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(65){left:10%;top:92%;animation-delay:.90s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(66){left:30%;top:96%;animation-delay:.98s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(67){left:50%;top:90%;animation-delay:1.06s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(68){left:70%;top:96%;animation-delay:1.14s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(69){left:90%;top:90%;animation-delay:1.22s}.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(70){left:99%;top:76%;animation-delay:1.30s}
.TH_BLUE_METEOR_PARTICLES_10 b:nth-child(n+55){width:2px;height:2px}
@keyframes TH_BLUE_COMET_10{0%{opacity:0;transform:translate(-15px,-35px) rotate(18deg) scale(.35)}7%{opacity:1}55%{opacity:1;transform:translate(110px,115px) rotate(18deg) scale(1)}68%{opacity:.35;transform:translate(145px,155px) rotate(18deg) scale(.55)}75%,100%{opacity:0}}
@keyframes TH_BLUE_PARTICLE_10{0%{opacity:0;transform:translate(-15px,-25px) scale(.25)}12%{opacity:.95}58%{opacity:.85;transform:translate(70px,75px) scale(1)}72%{opacity:0;transform:translate(95px,105px) scale(.35)}100%{opacity:0}}
.TH_EFFECT_10 > *:not(.TH_BLUE_METEOR_BORDER_10):not(.TH_BLUE_METEOR_LAYER_10){position:relative;z-index:50}
.TH_FROST_EFFECT_LAYER,
.TH_BLUE_METEOR_EFFECT_LAYER{
    position:absolute !important;
    inset:0 !important;
    width:100% !important;
    height:100% !important;
    pointer-events:none !important;
    overflow:hidden !important;
    z-index:60 !important;
}
.TH_FROST_EFFECT_LAYER{display:block !important}
.TH_BLUE_METEOR_EFFECT_LAYER{display:block !important}
.TH_BLUE_METEOR_LAYER_10{z-index:99999 !important}
    `).appendTo('head');
    /* =========================================================
       VARIABLES
    ========================================================= */
    var TH_CURRENT_EFFECT = 'none';
    var TH_EFFECT_BY_UID = {};
    var TH_EFFECT_BY_MSG = {};
    var TH_SYNC_PREFIX =
        '__TH_EFFECT_SYNC__';
    /* =========================================================
       ADD EFFECT
       يدعم 1 → 10
    ========================================================= */
    function TH_ADD_EFFECT($el, effect) {
        if (!$el || !$el.length) {
            return;
        }
        effect = String(effect);
        $el.removeClass(
            'TH_EFFECT_1 ' +
            'TH_EFFECT_2 ' +
            'TH_EFFECT_3 ' +
            'TH_EFFECT_4 ' +
            'TH_EFFECT_5 ' +
            'TH_EFFECT_6 ' +
            'TH_EFFECT_7 ' +
            'TH_EFFECT_8 ' +
            'TH_EFFECT_9 ' +
            'TH_EFFECT_10'
        );
        $el.children(
            '.TH_ANNOUNCEMENT_FROGS_LAYER,' +
            '.TH_ANNOUNCEMENT_BUNNIES_LAYER,' +
            '.TH_ANNOUNCEMENT_HONEY_LAYER,' +
            '.TH_ANNOUNCEMENT_CATS_LAYER,' +
            '.TH_FROST_EFFECT_LAYER,' +
            '.TH_BLUE_METEOR_EFFECT_LAYER'
        ).each(function(){
            var stop=$(this).data('th-frost-stop') || $(this).data('th-blue-stop');
            if(typeof stop==='function') stop();
            $(this).remove();
        });
        if (/^(?:[1-9]|10)$/.test(effect)) {
            $el.addClass(
                'TH_EFFECT_' + effect
            );
            $el.attr(
                'data-th-effect',
                effect
            );
        } else {
            $el.removeAttr(
                'data-th-effect'
            );
        }
    }
    /* =========================================================
       FROGS
    ========================================================= */
    function TH_ADD_FROGS($el) {
        if (!$el || !$el.length) {
            return;
        }
        if (
            !$el.is(
                '.uzr.d-flex.pmsgc.mm.TH_EFFECT_5'
            )
        ) {
            return;
        }
        if (
            $el.children(
                '.TH_ANNOUNCEMENT_FROGS_LAYER'
            ).length
        ) {
            return;
        }
        $el.append(`
            <div
                class="TH_ANNOUNCEMENT_FROGS_LAYER"
                data-th-frog-layer="1"
                aria-hidden="true"
            >
                <span class="
                    TH_ANNOUNCEMENT_FROG
                    TH_ANNOUNCEMENT_FROG_1
                ">🐸</span>
                <span class="
                    TH_ANNOUNCEMENT_FROG
                    TH_ANNOUNCEMENT_FROG_2
                ">🐸</span>
                <span class="
                    TH_ANNOUNCEMENT_FROG
                    TH_ANNOUNCEMENT_FROG_3
                ">🐸</span>
                <span class="
                    TH_ANNOUNCEMENT_FROG
                    TH_ANNOUNCEMENT_FROG_4
                ">🐸</span>
                <span class="
                    TH_ANNOUNCEMENT_FROG
                    TH_ANNOUNCEMENT_FROG_5
                ">🐸</span>
            </div>
        `);
    }
    /* =========================================================
       BUNNIES
    ========================================================= */
    function TH_ADD_BUNNIES($el) {
        if (!$el || !$el.length) {
            return;
        }
        if (
            $el.children(
                '.TH_ANNOUNCEMENT_BUNNIES_LAYER'
            ).length
        ) {
            return;
        }
        $el.append(`
            <div
                class="TH_ANNOUNCEMENT_BUNNIES_LAYER"
                data-th-bunny-layer="1"
                aria-hidden="true"
            >
                <span class="
                    TH_ANNOUNCEMENT_BUNNY
                    TH_ANNOUNCEMENT_BUNNY_1
                ">🐇</span>
                <span class="
                    TH_ANNOUNCEMENT_BUNNY
                    TH_ANNOUNCEMENT_BUNNY_2
                ">🐰</span>
                <span class="
                    TH_ANNOUNCEMENT_BUNNY
                    TH_ANNOUNCEMENT_BUNNY_3
                ">🐇</span>
                <span class="
                    TH_ANNOUNCEMENT_BUNNY
                    TH_ANNOUNCEMENT_BUNNY_4
                ">🐰</span>
            </div>
        `);
    }
    /* =========================================================
       HONEY
    ========================================================= */
    function TH_ADD_HONEY($el) {
        if (!$el || !$el.length) {
            return;
        }
        if (
            $el.children(
                '.TH_ANNOUNCEMENT_HONEY_LAYER'
            ).length
        ) {
            return;
        }
        $el.append(`
            <div
                class="TH_ANNOUNCEMENT_HONEY_LAYER"
                data-th-honey-layer="1"
                aria-hidden="true"
            >
                <span class="
                    TH_ANNOUNCEMENT_HONEY
                    TH_HONEY_JAR
                    TH_HONEY_1
                ">🍯</span>
                <span class="
                    TH_ANNOUNCEMENT_HONEY
                    TH_HONEY_JAR
                    TH_HONEY_2
                ">🍯</span>
                <span class="
                    TH_ANNOUNCEMENT_HONEY
                    TH_HONEY_JAR
                    TH_HONEY_3
                ">🍯</span>
                <span class="
                    TH_ANNOUNCEMENT_HONEY
                    TH_HONEY_DROP
                    TH_HONEY_4
                ">🍯</span>
                <span class="
                    TH_ANNOUNCEMENT_HONEY
                    TH_HONEY_DROP
                    TH_HONEY_5
                ">🍯</span>
            </div>
        `);
    }
    /* =========================================================
       CATS
    ========================================================= */
    function TH_ADD_CATS($el) {
        if (!$el || !$el.length) {
            return;
        }
        if (
            $el.children(
                '.TH_ANNOUNCEMENT_CATS_LAYER'
            ).length
        ) {
            return;
        }
        $el.append(`
            <div
                class="TH_ANNOUNCEMENT_CATS_LAYER"
                data-th-cat-layer="1"
                aria-hidden="true"
            >
                <span class="
                    TH_ANNOUNCEMENT_CAT
                    TH_CAT_1
                ">🐱</span>
                <span class="
                    TH_ANNOUNCEMENT_CAT
                    TH_CAT_2
                ">😺</span>
                <span class="
                    TH_ANNOUNCEMENT_CAT
                    TH_CAT_3
                ">😸</span>
                <span class="
                    TH_ANNOUNCEMENT_CAT
                    TH_CAT_4
                ">🐾</span>
            </div>
        `);
    }
    /* =========================================================
       EFFECT 9 — FROST LAYERS
    ========================================================= */
    function TH_ADD_FROST($el) {
        if (!$el || !$el.length || !$el.is('.TH_EFFECT_9')) return;
        if ($el.children('.TH_FROST_EFFECT_LAYER').length) return;
        var $layer = $(`
            <div class="TH_FROST_EFFECT_LAYER" aria-hidden="true">
                <div class="TH_FROST_BORDER_9">
                    <i class="TH_FROST_ICE_9 i1"></i><i class="TH_FROST_ICE_9 i2"></i>
                    <i class="TH_FROST_ICE_9 i3"></i><i class="TH_FROST_ICE_9 i4"></i>
                    <i class="TH_FROST_SNOW_9 s1"></i><i class="TH_FROST_SNOW_9 s2"></i>
                    <i class="TH_FROST_SNOW_9 s3"></i><i class="TH_FROST_SNOW_9 s4"></i>
                    <i class="TH_FROST_SNOW_9 s5"></i><i class="TH_FROST_SNOW_9 s6"></i>
                    <i class="TH_FROST_SNOW_9 s7"></i>
                </div>
                <div class="TH_METEOR_LAYER_9"></div>
            </div>
        `);
        $el.append($layer);
        var $meteorLayer = $layer.find('.TH_METEOR_LAYER_9');
        var groups = [
            [-150,-100,0],[-105,-73,.10],[-72,-48,.20],[-48,-28,.30],
            [-170,-130,.38],[-122,-91,.48],[-84,-63,.58],[-53,-40,.68],
            [-190,-155,.76],[-138,-106,.86],[-96,-73,.96],[-61,-48,1.06],
            [-210,-175,1.16],[-150,-120,1.26],[-105,-85,1.36],[-68,-58,1.46]
        ];
        var classes=['big','medium','small','tiny'];
        groups.forEach(function(g,i){
            $('<i class="TH_METEOR_9 '+classes[i%4]+' flow"></i>').css({left:g[0]+'px',top:g[1]+'px',animationDelay:g[2]+'s'}).appendTo($meteorLayer);
        });
        for(var i=0;i<12;i++){
            $('<i class="TH_METEOR_DOT_9 flow"></i>').css({
                '--dot':(i%3===0?'5px':(i%3===1?'3px':'4px')),
                left:(-20-i*25)+'px',top:(-10-i*18)+'px',animationDelay:(.12+i*.16)+'s'
            }).appendTo($meteorLayer);
        }
        var timer=null, stopped=false;
        function play(){
            if(stopped) return;
            var $items=$meteorLayer.find('.TH_METEOR_9,.TH_METEOR_DOT_9');
            $items.each(function(){
                this.style.animation='none'; void this.offsetWidth; this.style.animation='';
            });
            $meteorLayer.show();
            clearTimeout(timer);
            timer=setTimeout(function(){
                if(stopped) return;
                $meteorLayer.hide();
                timer=setTimeout(play,4000);
            },3000);
        }
        play();
        $layer.data('th-frost-stop',function(){stopped=true;clearTimeout(timer);});
    }
    /* =========================================================
       EFFECT 10 — BLUE METEOR LAYERS
    ========================================================= */
    function TH_ADD_BLUE_METEOR($el) {
        if (!$el || !$el.length || !$el.is('.TH_EFFECT_10')) return;
        if ($el.children('.TH_BLUE_METEOR_EFFECT_LAYER').length) return;
        var meteors='', particles='';
        for(var i=0;i<45;i++) meteors+='<i></i>';
        for(var j=0;j<70;j++) particles+='<b></b>';
        var $layer=$(`
            <div class="TH_BLUE_METEOR_EFFECT_LAYER" aria-hidden="true">
                <div class="TH_BLUE_METEOR_BORDER_10">
                    <span class="glow"></span><span class="light t"></span><span class="light b"></span>
                    <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
                    <span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span><span class="spark s4"></span>
                </div>
                <div class="TH_BLUE_METEOR_LAYER_10">
                    <div class="TH_BLUE_METEOR_MAIN_10">${meteors}</div>
                    <div class="TH_BLUE_METEOR_PARTICLES_10">${particles}</div>
                </div>
            </div>
        `);
        $el.append($layer);
        var $meteorLayer=$layer.find('.TH_BLUE_METEOR_LAYER_10');
        var timer=null, stopped=false;
        function show(){
            if(stopped)return;
            $meteorLayer.css({display:'block',opacity:1});
            $meteorLayer.find('.TH_BLUE_METEOR_MAIN_10 i,.TH_BLUE_METEOR_PARTICLES_10 b').each(function(){
                this.style.animation='none'; void this.offsetWidth; this.style.animation='';
            });
            clearTimeout(timer);
            timer=setTimeout(hide,5000);
        }
        function hide(){
            if(stopped)return;
            $meteorLayer.css({display:'none',opacity:0});
            clearTimeout(timer);
            timer=setTimeout(show,5000);
        }
        timer=setTimeout(show,5000);
        $layer.data('th-blue-stop',function(){stopped=true;clearTimeout(timer);$meteorLayer.hide();});
    }
    /* =========================================================
       APPLY VISUAL LAYERS
    ========================================================= */
    function TH_APPLY_EFFECT_LAYERS($el, effect) {
        if (!$el || !$el.length) {
            return;
        }
        if (effect === '5') {
            TH_ADD_FROGS($el);
        }
        if (effect === '6') {
            TH_ADD_BUNNIES($el);
        }
        if (effect === '7') {
            TH_ADD_HONEY($el);
        }
        if (effect === '8') {
            TH_ADD_CATS($el);
        }
        if (effect === '9') {
            TH_ADD_FROST($el);
        }
        if (effect === '10') {
            TH_ADD_BLUE_METEOR($el);
        }
    }
    /* =========================================================
       CLEANER
    ========================================================= */
    function TH_CLEAN_ORPHAN_EFFECT_LAYERS() {
        $(
            '.TH_ANNOUNCEMENT_FROGS_LAYER,' +
            '.TH_ANNOUNCEMENT_BUNNIES_LAYER,' +
            '.TH_ANNOUNCEMENT_HONEY_LAYER,' +
            '.TH_ANNOUNCEMENT_CATS_LAYER,' +
            '.TH_FROST_EFFECT_LAYER,' +
            '.TH_BLUE_METEOR_EFFECT_LAYER'
        ).each(function () {
            var $layer =
                $(this);
            var $parent =
                $layer.parent();
            if (
                !$parent.is(
                    '.uzr.d-flex.pmsgc.mm'
                )
            ) {
                $layer.remove();
            }
        });
    }
    /* =========================================================
       OBSERVER
    ========================================================= */
    var TH_EFFECT_OBSERVER = null;
    function TH_START_EFFECT_SAFETY() {
        if (TH_EFFECT_OBSERVER) {
            return;
        }
        if (!document.body) {
            return;
        }
        TH_EFFECT_OBSERVER =
            new MutationObserver(
                function () {
                    TH_CLEAN_ORPHAN_EFFECT_LAYERS();
                }
            );
        TH_EFFECT_OBSERVER.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }
    /* =========================================================
       SEND SYNC
       يدعم 1 → 10
    ========================================================= */
    function TH_SEND_EFFECT_SYNC(effect) {
        try {
            var uid =
                String(
                    window.TIGERHOST || ''
                );
            effect = String(effect);
            if (!uid) {
                console.log(
                    '❌ TH SYNC: UID غير موجود'
                );
                return false;
            }
            if (!/^(?:[1-9]|10)$/.test(effect)) {
                effect = '0';
            }
            var syncMessage =
                TH_SYNC_PREFIX +
                '|' +
                uid +
                '|' +
                effect;
            if (
                typeof window.SEND_EVENT_TIGERHOST !==
                'function'
            ) {
                console.log(
                    '❌ TH SYNC: SEND_EVENT غير موجود'
                );
                return false;
            }
            window.SEND_EVENT_TIGERHOST(
                'SEND_PMSG_TIGERHOST_EVENT',
                {
                    msg: syncMessage,
                    state: 'all'
                }
            );
            console.log(
                '📡 TH EFFECT SYNC SENT:',
                {
                    uid: uid,
                    effect: effect
                }
            );
            return true;
        } catch (err) {
            console.log(
                '❌ TH SYNC SEND ERROR:',
                err
            );
            return false;
        }
    }
    /* =========================================================
       RECEIVE SYNC
       يدعم 1 → 10
    ========================================================= */
    function TH_PROCESS_SYNC_MESSAGE(data) {
        try {
            if (
                !data ||
                typeof data !== 'object'
            ) {
                return false;
            }
            var msg =
                String(
                    data.msg || ''
                );
            if (
                msg.indexOf(
                    TH_SYNC_PREFIX + '|'
                ) !== 0
            ) {
                return false;
            }
            var parts =
                msg.split('|');
            if (parts.length < 3) {
                return true;
            }
            var uid =
                String(
                    parts[1] || ''
                );
            var effect =
                String(
                    parts[2] || '0'
                );
            if (!uid) {
                return true;
            }
            if (!/^(?:[1-9]|10)$/.test(effect)) {
                return true;
            }
            TH_EFFECT_BY_UID[uid] =
                effect;
            console.log(
                '📥 TH EFFECT SYNC RECEIVED:',
                {
                    uid: uid,
                    effect: effect
                }
            );
            return true;
        } catch (err) {
            return true;
        }
    }
    /* =========================================================
       BUTTON
    ========================================================= */
    function TH_CREATE_BUTTON() {
        var $send =
            $('.th-mnot-send').first();
        if (!$send.length) {
            return;
        }
        if (
            $('.th-effects-btn').first().length
        ) {
            return;
        }
        var $button = $(
            '<button type="button" ' +
            'class="btn btn-primary th-effects-btn">' +
            '<span class="fa fa-magic"></span> ' +
            'تأثيرات' +
            '</button>'
        );
        $send.before(
            $button
        );
    }
    /* =========================================================
       MENU
    ========================================================= */
    function TH_CREATE_MENU() {
        if (
            $('#TH_EFFECTS_MENU').length
        ) {
            return;
        }
        var $menu = $(`
            <div id="TH_EFFECTS_MENU">
                <button type="button"
                    data-effect="1">
                    ✨ لمعة
                </button>
                <button type="button"
                    data-effect="2">
                    ⚠️ تحذير
                </button>
                <button type="button"
                    data-effect="3">
                    🎉 احتفال
                </button>
                <button type="button"
                    data-effect="4">
                    ⭕ بوردر
                </button>
                <button type="button"
                    data-effect="5">
                    🐸 ضفادع
                </button>
                <button type="button"
                    data-effect="6">
                    🐇 أرانب
                </button>
                <button type="button"
                    data-effect="7">
                    🍯 عسل
                </button>
                <button type="button"
                    data-effect="8">
                    🐱 قطط كيوت
                </button>
                <button type="button"
                    data-effect="9">
                    🧊 صقيع
                </button>
                <button type="button"
                    data-effect="10">
                    ☄️ شهاب أزرق
                </button>
                <button type="button"
                    data-effect="none">
                    ❌ بدون تأثير
                </button>
            </div>
        `);
        $('body').append(
            $menu
        );
    }
    /* =========================================================
       OPEN MENU
    ========================================================= */
    $(document).on(
        'click.TH_EFFECTS_CSS',
        '.th-effects-btn',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            TH_CREATE_MENU();
            var $button =
                $(this);
            var offset =
                $button.offset();
            var $menu =
                $('#TH_EFFECTS_MENU');
            $menu.css({
                top:
                    offset.top +
                    $button.outerHeight() +
                    5,
                left:
                    offset.left
            });
            $menu
                .stop(true, true)
                .fadeIn(120);
        }
    );
    /* =========================================================
       SELECT EFFECT
       يدعم 1 → 10
    ========================================================= */
    $(document).on(
        'click.TH_EFFECTS_CSS',
        '#TH_EFFECTS_MENU button',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            TH_CURRENT_EFFECT =
                String(
                    $(this).data('effect')
                );
            $('#TH_EFFECTS_MENU').hide();
            var ownUid =
                String(
                    window.TIGERHOST || ''
                );
            if (!ownUid) {
                return;
            }
            var effect =
                /^(?:[1-9]|10)$/.test(
                    TH_CURRENT_EFFECT
                )
                    ? TH_CURRENT_EFFECT
                    : '0';
            TH_EFFECT_BY_UID[ownUid] =
                effect;
            TH_SEND_EFFECT_SYNC(
                effect
            );
        }
    );
    /* =========================================================
       CLOSE MENU
    ========================================================= */
    $(document).on(
        'click.TH_EFFECTS_CSS',
        function (e) {
            if (
                !$(e.target).closest(
                    '#TH_EFFECTS_MENU, .th-effects-btn'
                ).length
            ) {
                $('#TH_EFFECTS_MENU')
                    .hide();
            }
        }
    );
    /* =========================================================
       RECEIVER HOOK
    ========================================================= */
    function TH_INSTALL_RECEIVER_SYNC() {
        if (
            typeof window.ADDMSG_TIGERHOST !==
            'function'
        ) {
            return false;
        }
        if (
            window.ADDMSG_TIGERHOST
                .__TH_EFFECT_SYNC__
        ) {
            return true;
        }
        var TH_ORIGINAL_ADDMSG =
            window.ADDMSG_TIGERHOST;
        function TH_ADDMSG_EVENT_SYNC() {
            var args =
                Array.prototype.slice.call(
                    arguments
                );
            var container =
                args[0];
            var data =
                args[1];
            /* -----------------------------------------
               HIDDEN SYNC
            ----------------------------------------- */
            if (
                data &&
                typeof data === 'object' &&
                TH_PROCESS_SYNC_MESSAGE(data)
            ) {
                return null;
            }
            /* -----------------------------------------
               REAL ANNOUNCEMENT
            ----------------------------------------- */
            var result =
                TH_ORIGINAL_ADDMSG.apply(
                    this,
                    args
                );
            try {
                if (
                    String(container || '')
                        .indexOf('#d2') === 0 &&
                    data &&
                    typeof data === 'object'
                ) {
                    var uid =
                        data.uid != null
                            ? String(data.uid)
                            : '';
                    var msgId =
                        data.mi != null
                            ? String(data.mi)
                            : (
                                data.id != null
                                    ? String(data.id)
                                    : ''
                            );
                    var $result =
                        $(result);
                    if (!$result.length) {
                        return result;
                    }
                    if (uid) {
                        $result.attr(
                            'data-th-uid',
                            uid
                        );
                    }
                    if (msgId) {
                        $result.attr(
                            'data-th-msg-id',
                            msgId
                        );
                    }
                    var effect =
                        uid &&
                        TH_EFFECT_BY_UID[uid] != null
                            ? String(
                                TH_EFFECT_BY_UID[uid]
                            )
                            : '0';
                    if (msgId) {
                        TH_EFFECT_BY_MSG[msgId] =
                            effect;
                        $result.attr(
                            'data-th-effect',
                            effect
                        );
                    }
                    /* ---------------------------------
                       APPLY EFFECT 1 → 10
                    --------------------------------- */
                    if (
                        /^(?:[1-9]|10)$/.test(effect)
                    ) {
                        TH_ADD_EFFECT(
                            $result,
                            effect
                        );
                        TH_APPLY_EFFECT_LAYERS(
                            $result,
                            effect
                        );
                        console.log(
                            '🎨 TH EFFECT APPLIED:',
                            {
                                uid: uid,
                                msgId: msgId,
                                effect: effect
                            }
                        );
                    }
                }
            } catch (err) {
                console.log(
                    '❌ TH EFFECT APPLY ERROR:',
                    err
                );
            }
            return result;
        }
        TH_ADDMSG_EVENT_SYNC
            .__TH_EFFECT_SYNC__ = true;
        window.ADDMSG_TIGERHOST =
            TH_ADDMSG_EVENT_SYNC;
        return true;
    }
    /* =========================================================
       DOM FALLBACK — APPLY 9/10 AFTER ANNOUNCEMENT INSERT
       يمنع ضياع التأثير إذا وصلت المزامنة بعد بناء الرسالة
    ========================================================= */
    var TH_DOM_EFFECT_OBSERVER = null;
    function TH_APPLY_DOM_EFFECT($ad) {
        if (!$ad || !$ad.length) {
            return;
        }
        if (!$ad.is('.uzr.d-flex.pmsgc.mm')) {
            return;
        }
        if (!$ad.find('.fa-bullhorn').length) {
            return;
        }
        var uid = String($ad.attr('data-th-uid') || '');
        var msgId = String($ad.attr('data-th-msg-id') || '');
        var effect = String($ad.attr('data-th-effect') || '');
        if (!/^(?:[1-9]|10)$/.test(effect) && uid) {
            effect = String(TH_EFFECT_BY_UID[uid] || '0');
        }
        if (!/^(?:[1-9]|10)$/.test(effect) && msgId) {
            effect = String(TH_EFFECT_BY_MSG[msgId] || '0');
        }
        if (!/^(?:[1-9]|10)$/.test(effect)) {
            return;
        }
        TH_ADD_EFFECT($ad, effect);
        TH_APPLY_EFFECT_LAYERS($ad, effect);
        $ad.attr('data-th-effect', effect);
    }
    function TH_START_DOM_EFFECT_FALLBACK() {
        if (TH_DOM_EFFECT_OBSERVER || !document.body) {
            return;
        }
        TH_DOM_EFFECT_OBSERVER = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                $(mutation.addedNodes).each(function() {
                    var $node = $(this);
                    if (!$node.length) return;
                    if ($node.is('.uzr.d-flex.pmsgc.mm')) {
                        TH_APPLY_DOM_EFFECT($node);
                    }
                    $node.find('.uzr.d-flex.pmsgc.mm').each(function() {
                        TH_APPLY_DOM_EFFECT($(this));
                    });
                });
            });
        });
        TH_DOM_EFFECT_OBSERVER.observe(document.body, {
            childList: true,
            subtree: true
        });
        $('.uzr.d-flex.pmsgc.mm:has(.fa-bullhorn)').each(function() {
            TH_APPLY_DOM_EFFECT($(this));
        });
    }
    /* =========================================================
       INSTALL SYNC
    ========================================================= */
    function TH_INSTALL_SYNC() {
        TH_INSTALL_RECEIVER_SYNC();
        setTimeout(
            TH_INSTALL_RECEIVER_SYNC,
            500
        );
        setTimeout(
            TH_INSTALL_RECEIVER_SYNC,
            1500
        );
        setTimeout(
            TH_INSTALL_RECEIVER_SYNC,
            3000
        );
    }
    /* =========================================================
       INIT
    ========================================================= */
    TH_CREATE_BUTTON();
    TH_CREATE_MENU();
    TH_INSTALL_SYNC();
    TH_START_DOM_EFFECT_FALLBACK();
    TH_START_EFFECT_SAFETY();
    TH_CLEAN_ORPHAN_EFFECT_LAYERS();
    $(document).ready(
        function () {
            TH_CREATE_BUTTON();
            TH_CREATE_MENU();
            TH_INSTALL_SYNC();
            TH_START_DOM_EFFECT_FALLBACK();
            TH_START_EFFECT_SAFETY();
            TH_CLEAN_ORPHAN_EFFECT_LAYERS();
        }
    );
    /* =========================================================
       STATUS
    ========================================================= */
    window.TH_EFFECT_SYNC_STATUS =
        function () {
            var myUid =
                String(
                    window.TIGERHOST || ''
                );
            return {
                selectedEffect:
                    TH_CURRENT_EFFECT,
                myUid:
                    myUid,
                myEffect:
                    TH_EFFECT_BY_UID[
                        myUid
                    ] || '0',
                receiverHook:
                    !!(
                        window.ADDMSG_TIGERHOST &&
                        window.ADDMSG_TIGERHOST
                            .__TH_EFFECT_SYNC__
                    ),
                effectMap:
                    TH_EFFECT_BY_UID,
                messageEffectMap:
                    TH_EFFECT_BY_MSG
            };
        };
    console.log(
        '✅ TH EFFECTS 1 → 10 INSTALLED'
    );
    console.log(
        '✨ 1 لمعة'
    );
    console.log(
        '⚠️ 2 تحذير'
    );
    console.log(
        '🎉 3 احتفال'
    );
    console.log(
        '⭕ 4 بوردر'
    );
    console.log(
        '🐸 5 ضفادع'
    );
    console.log(
        '🐇 6 أرانب — نط متتابع'
    );
    console.log(
        '🍯 7 عسل'
    );
    console.log(
        '🐱 8 قطط — جري'
    );
    console.log(
        '🧊 9 صقيع — صقيع + شهب باردة'
    );
    console.log(
        '☄️ 10 شهاب أزرق — 45 شهاب + 70 جسيم'
    );
})();
