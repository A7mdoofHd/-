(function () {
    'use strict';

    /* =========================================================
       TH SONG — PLAYER ONLY SYNC
       FINAL 7 — STABLE STORAGE + REALTIME SWITCH
       NO PMSG / NO SOCKET PATCH / NO PLAY-PAUSE SEEK SYNC
       ========================================================= */

    var PREFIX = '__TH_SONG_PLAYER_SYNC__';
    var EXCLUDED_ROOM = 'y24qvky05f';

    /* =========================================================
       CLEAN OLD VERSION
       ========================================================= */

    try {

        if (
            window.TH_SONG_PLAYER_SYNC_API &&
            typeof window.TH_SONG_PLAYER_SYNC_API.destroy ===
            'function'
        ) {

            window.TH_SONG_PLAYER_SYNC_API.destroy();

        }

    } catch (e) {}

    /*
     * إذا كانت FINAL_2 قد غلفت ADDMSG
     * نرجع الأصل قبل تركيب النسخة الجديدة.
     */

    try {

        var currentAdd =
            window.ADDMSG_TIGERHOST;

        if (
            currentAdd &&
            currentAdd.__TH_SONG_SYNC_FINAL_2_ORIGINAL__
        ) {

            window.ADDMSG_TIGERHOST =
                currentAdd.__TH_SONG_SYNC_FINAL_2_ORIGINAL__;

            console.log(
                '🧹 TH SONG OLD ADDMSG WRAPPER REMOVED'
            );

        }

    } catch (e) {}

    /*
     * إلغاء أي نسخة FINAL_7 قديمة.
     */

    try {

        if (
            window.__TH_SONG_PLAYER_SYNC_FINAL_7_TIMER__
        ) {

            clearInterval(
                window.__TH_SONG_PLAYER_SYNC_FINAL_7_TIMER__
            );

        }

    } catch (e) {}

    if (
        window.__TH_SONG_PLAYER_SYNC_FINAL_7__
    ) {

        console.log(
            '⚠️ TH SONG PLAYER SYNC FINAL 7 موجود مسبقًا'
        );

        return;

    }

    window.__TH_SONG_PLAYER_SYNC_FINAL_7__ =
        true;

    /* =========================================================
       STATE
       ========================================================= */

    var state = {

        audio: null,

        currentUrl: '',
        currentName: '',

        applyingRemote: false,

        lastSyncMessage: '',
        lastSyncAt: 0,

        observer: null,
        uploadTimer: null,

        oldAddMsg: null,

        switchTimer: null

    };

    /* =========================================================
       HELPERS
       ========================================================= */

    function cleanUrl(url) {

        try {

            url =
                String(url || '').trim();

            if (!url) {
                return '';
            }

            if (/^https?:\/\//i.test(url)) {

                return url;

            }

            if (url.charAt(0) !== '/') {

                url =
                    '/' + url;

            }

            return location.origin + url;

        } catch (e) {

            return '';

        }

    }

    function normalizeUrl(url) {

        try {

            return cleanUrl(url)
                .replace(/&amp;/gi, '&')
                .trim();

        } catch (e) {

            return '';

        }

    }

    function decodeSafe(value) {

        try {

            return decodeURIComponent(
                String(value || '')
            );

        } catch (e) {

            return String(value || '');

        }

    }

    function getState() {

        try {

            return (
                window.__TH_SONG_JQ_STATE__ ||
                null
            );

        } catch (e) {

            return null;

        }

    }

    function getAudio() {

        try {

            var s =
                getState();

            if (
                s &&
                s.audio instanceof HTMLAudioElement
            ) {

                state.audio =
                    s.audio;

                return s.audio;

            }

        } catch (e) {}

        if (
            state.audio &&
            state.audio instanceof HTMLAudioElement
        ) {

            return state.audio;

        }

        return null;

    }

    function getPlayerUrl() {

        try {

            var s =
                getState();

            if (
                s &&
                s.audioUrl
            ) {

                return normalizeUrl(
                    s.audioUrl
                );

            }

        } catch (e) {}

        var audio =
            getAudio();

        if (audio) {

            return normalizeUrl(
                audio.currentSrc ||
                audio.src ||
                ''
            );

        }

        return '';

    }

    function getPlayerName() {

        try {

            var s =
                getState();

            if (
                s &&
                s.audioName
            ) {

                return String(
                    s.audioName
                );

            }

        } catch (e) {}

        return '';

    }

    function setPlayerName(name) {

        try {

            var el =
                document.getElementById(
                    'TH_SONG_NAME'
                );

            if (el) {

                el.textContent =
                    String(
                        name ||
                        'بدون اسم'
                    );

            }

        } catch (e) {}

    }

    function setStatus(text) {

        try {

            var el =
                document.getElementById(
                    'TH_SONG_STATUS'
                );

            if (el) {

                el.textContent =
                    String(
                        text || ''
                    );

            }

        } catch (e) {}

    }

    function getRoomId() {

        try {

            if (
                window.CURRENT_ROOM
            ) {

                return String(
                    window.CURRENT_ROOM
                );

            }

        } catch (e) {}

        try {

            if (
                window.room_id
            ) {

                return String(
                    window.room_id
                );

            }

        } catch (e) {}

        try {

            if (
                window.roomid
            ) {

                return String(
                    window.roomid
                );

            }

        } catch (e) {}

        try {

            if (
                window.room
            ) {

                return String(
                    window.room
                );

            }

        } catch (e) {}

        return '';

    }

    function songExcluded() {

        return (
            getRoomId() ===
            EXCLUDED_ROOM
        );

    }

    /* =========================================================
       LOAD PLAYER
       ========================================================= */

    function loadPlayer(url, name) {

        try {

            url =
                normalizeUrl(url);

            if (!url) {

                return false;

            }

            var audio =
                getAudio();

            if (!audio) {

                return false;

            }

            var s =
                getState();

            state.currentUrl =
                url;

            state.currentName =
                String(
                    name || ''
                );

            if (s) {

                s.audioUrl =
                    url;

                s.audioName =
                    String(
                        name || ''
                    );

            }

            var current =
                normalizeUrl(
                    audio.currentSrc ||
                    audio.src ||
                    ''
                );

            if (
                current !==
                url
            ) {

                try {

                    audio.pause();

                } catch (e) {}

                audio.src =
                    url;

                try {

                    audio.load();

                } catch (e) {}

            }

            setPlayerName(
                name
            );

            return true;

        } catch (e) {

            console.error(
                'TH SONG LOAD ERROR:',
                e
            );

            return false;

        }

    }

    /* =========================================================
       SONG SWITCH SYNC
       ---------------------------------------------------------
       IMPORTANT:
       - BC CHAT ONLY
       - NO PMSG
       - NO SOCKET.IO
       - NO WALL HERE
       ========================================================= */

    function sendSwitch(
        url,
        name
    ) {

        try {

            if (
                songExcluded()
            ) {

                return false;

            }

            if (
                typeof window.SEND_EVENT_TIGERHOST !==
                'function'
            ) {

                console.log(
                    '❌ SEND_EVENT_TIGERHOST غير موجود'
                );

                return false;

            }

            url =
                normalizeUrl(url);

            name =
                String(
                    name || ''
                );

            if (!url) {

                return false;

            }

            var msg =
                PREFIX +
                '|switch|' +
                encodeURIComponent(url) +
                '|' +
                encodeURIComponent(name) +
                '|0.000';

            window.SEND_EVENT_TIGERHOST(
                'SEND_BC_TIGERHOST_EVENT',
                {
                    msg: msg,
                    link: '',
                    type: 'chat'
                }
            );

            console.log(
                '📡 TH SONG SWITCH SENT:',
                url
            );

            return true;

        } catch (e) {

            console.error(
                'TH SONG SWITCH SEND ERROR:',
                e
            );

            return false;

        }

    }

    /* =========================================================
       REALTIME SWITCH RETRY
       ---------------------------------------------------------
       نعيد نفس switch عدة مرات فقط.
       المستلم عنده dedupe.
       ========================================================= */

    function sendSwitchReliable(
        url,
        name
    ) {

        try {

            if (
                state.switchTimer
            ) {

                clearTimeout(
                    state.switchTimer
                );

                state.switchTimer =
                    null;

            }

            url =
                normalizeUrl(url);

            name =
                String(
                    name || ''
                );

            if (!url) {

                return false;

            }

            /*
             * أول إرسال فوري
             */

            sendSwitch(
                url,
                name
            );

            /*
             * إعادة قصيرة لضمان realtime
             */

            var attempts = 0;

            function retry() {

                attempts++;

                if (
                    attempts > 3
                ) {

                    state.switchTimer =
                        null;

                    return;

                }

                sendSwitch(
                    url,
                    name
                );

                state.switchTimer =
                    setTimeout(
                        retry,
                        350
                    );

            }

            state.switchTimer =
                setTimeout(
                    retry,
                    250
                );

            return true;

        } catch (e) {

            return false;

        }

    }

    /* =========================================================
       PARSE SYNC
       ========================================================= */

    function parseSync(msg) {

        try {

            msg =
                String(msg || '');

            if (
                msg.indexOf(
                    PREFIX + '|'
                ) !== 0
            ) {

                return null;

            }

            var parts =
                msg.split('|');

            if (
                parts.length < 5
            ) {

                return null;

            }

            return {

                action:
                    String(
                        parts[1] || ''
                    ),

                url:
                    decodeSafe(
                        parts[2]
                    ),

                name:
                    decodeSafe(
                        parts[3]
                    ),

                time:
                    Number(
                        parts[4]
                    )

            };

        } catch (e) {

            return null;

        }

    }

    /* =========================================================
       APPLY REMOTE SWITCH
       ========================================================= */

    function applyRemote(
        action,
        url,
        name,
        time
    ) {

        try {

            if (
                songExcluded()
            ) {

                return;

            }

            if (
                action !==
                'switch'
            ) {

                return;

            }

            url =
                normalizeUrl(url);

            name =
                decodeSafe(name);

            if (!url) {

                return;

            }

            var audio =
                getAudio();

            if (!audio) {

                setTimeout(
                    function () {

                        applyRemote(
                            action,
                            url,
                            name,
                            time
                        );

                    },
                    500
                );

                return;

            }

            state.applyingRemote =
                true;

            loadPlayer(
                url,
                name
            );

            state.currentUrl =
                url;

            state.currentName =
                name;

            setPlayerName(
                name
            );

            /*
             * مهم:
             * لا تشغيل تلقائي.
             *
             * الأغنية الجديدة تصل للمشغل
             * فقط، والمستخدم يضغط تشغيل.
             */

            try {

                audio.pause();

            } catch (e) {}

            try {

                audio.currentTime =
                    0;

            } catch (e) {}

            setStatus(
                'تم تحديث الأغنية'
            );

            setTimeout(
                function () {

                    state.applyingRemote =
                        false;

                },
                300
            );

            console.log(
                '📥 TH SONG SWITCH RECEIVED:',
                url
            );

        } catch (e) {

            state.applyingRemote =
                false;

        }

    }

    /* =========================================================
       CONSUME SYNC MESSAGE
       ========================================================= */

    function consumeSyncMessage(
        msg
    ) {

        try {

            msg =
                String(msg || '');

            if (
                msg.indexOf(
                    PREFIX + '|'
                ) !== 0
            ) {

                return false;

            }

            var now =
                Date.now();

            /*
             * منع التكرار الناتج عن
             * retry.
             */

            if (
                msg ===
                state.lastSyncMessage &&
                now -
                state.lastSyncAt <
                1200
            ) {

                return true;

            }

            state.lastSyncMessage =
                msg;

            state.lastSyncAt =
                now;

            var data =
                parseSync(msg);

            if (!data) {

                return true;

            }

            applyRemote(
                data.action,
                data.url,
                data.name,
                data.time
            );

            console.log(
                '🛡️ SONG SYNC BLOCKED FROM CHAT'
            );

            return true;

        } catch (e) {

            return true;

        }

    }

    /* =========================================================
       PLAYER BIND
       ---------------------------------------------------------
       IMPORTANT:
       NO PLAY
       NO PAUSE
       NO SEEKED
       ========================================================= */

    function bindPlayer() {

        try {

            var audio =
                getAudio();

            if (!audio) {

                return false;

            }

            state.audio =
                audio;

            /*
             * لا نربط أي أحداث تشغيل.
             *
             * هذا مقصود حتى لا ينتج عن
             * تشغيل الأغنية أي SEND_EVENT.
             */

            return true;

        } catch (e) {

            return false;

        }

    }

    /* =========================================================
       WATCH NEW SONG
       ========================================================= */

    function watchUpload() {

        try {

            var url =
                getPlayerUrl();

            if (!url) {

                return;

            }

            if (
                !state.currentUrl
            ) {

                state.currentUrl =
                    url;

                state.currentName =
                    getPlayerName();

                return;

            }

            if (
                url ===
                state.currentUrl
            ) {

                return;

            }

            var name =
                getPlayerName();

            state.currentUrl =
                url;

            state.currentName =
                name;

            console.log(
                '🎵 TH SONG NEW SONG:',
                url
            );

            /*
             * =================================================
             * 1 — حفظ في Wall
             * =================================================
             *
             * هذا هو التخزين الدائم.
             *
             * لا نرسل رسالة نصية.
             * link فقط.
             */

            if (
                typeof window.SEND_EVENT_TIGERHOST ===
                'function'
            ) {

                window.SEND_EVENT_TIGERHOST(
                    'SEND_BC_TIGERHOST_EVENT',
                    {
                        msg: '',
                        link: cleanUrl(url),
                        type: 'wall'
                    }
                );

                console.log(
                    '💾 TH SONG SAVED TO WALL'
                );

            }

            /*
             * =================================================
             * 2 — realtime switch
             * =================================================
             */

            sendSwitchReliable(
                url,
                name
            );

        } catch (e) {

            console.error(
                'TH SONG WATCH ERROR:',
                e
            );

        }

    }

    /* =========================================================
       EXTRACT AUDIO FROM WALL
       ========================================================= */

    function extractWallAudio(
        obj
    ) {

        try {

            if (
                !obj ||
                typeof obj !== 'object'
            ) {

                return null;

            }

            var msg =
                String(
                    obj.msg || ''
                );

            var link =
                String(
                    obj.link || ''
                );

            var combined =
                msg +
                ' ' +
                link;

            var match =
                combined.match(
                    /(?:https?:\/\/[^"'<> \s]+)?\/sendfile\/[^"'<> \s]+?\.(?:mp3|m4a|wav|ogg|aac)(?:\?[^"'<> \s]*)?/i
                );

            if (!match) {

                return null;

            }

            var url =
                normalizeUrl(
                    match[0]
                );

            if (!url) {

                return null;

            }

            return {

                url: url,

                name:
                    extractFileName(
                        url
                    )

            };

        } catch (e) {

            return null;

        }

    }

    function extractFileName(
        url
    ) {

        try {

            var clean =
                String(
                    url || ''
                ).split('?')[0];

            var name =
                clean.substring(
                    clean.lastIndexOf('/') + 1
                );

            return decodeSafe(
                name
            ) || 'أغنية';

        } catch (e) {

            return 'أغنية';

        }

    }

    /* =========================================================
       WALL CONSUMER
       ========================================================= */

    function processWallObject(
        obj
    ) {

        try {

            if (
                !obj ||
                typeof obj !== 'object'
            ) {

                return false;

            }

            if (
                String(
                    obj.type || ''
                ).toLowerCase() !==
                'wall'
            ) {

                return false;

            }

            var media =
                extractWallAudio(
                    obj
                );

            if (!media) {

                return false;

            }

            if (
                !songExcluded()
            ) {

                loadPlayer(
                    media.url,
                    media.name
                );

                state.currentUrl =
                    media.url;

                state.currentName =
                    media.name;

            }

            console.log(
                '🛡️ TH SONG WALL AUDIO CONSUMED:',
                media.url
            );

            /*
             * منع وصول عنصر الأغنية
             * إلى Wall المرئي.
             */

            return true;

        } catch (e) {

            return false;

        }

    }

    /* =========================================================
       ADDMSG INTERCEPTOR
       ========================================================= */

    function hookAddMsg() {

        try {

            var oldAdd =
                window.ADDMSG_TIGERHOST;

            if (
                typeof oldAdd !==
                'function'
            ) {

                return false;

            }

            state.oldAddMsg =
                oldAdd;

            function wrappedAddMsg() {

                try {

                    for (
                        var i = 0;
                        i < arguments.length;
                        i++
                    ) {

                        var obj =
                            arguments[i];

                        if (
                            !obj ||
                            typeof obj !==
                            'object'
                        ) {

                            continue;

                        }

                        var msg =
                            String(
                                obj.msg || ''
                            );

                        /*
                         * -------------------------------------
                         * SONG SYNC
                         * -------------------------------------
                         */

                        if (
                            msg.indexOf(
                                PREFIX + '|'
                            ) === 0
                        ) {

                            consumeSyncMessage(
                                msg
                            );

                            return;

                        }

                        /*
                         * -------------------------------------
                         * SONG WALL STORAGE
                         * -------------------------------------
                         */

                        if (
                            processWallObject(
                                obj
                            )
                        ) {

                            return;

                        }

                    }

                } catch (e) {}

                return oldAdd.apply(
                    this,
                    arguments
                );

            }

            wrappedAddMsg.__TH_SONG_SYNC_FINAL_7__ =
                true;

            wrappedAddMsg.__TH_SONG_SYNC_FINAL_7_ORIGINAL__ =
                oldAdd;

            window.ADDMSG_TIGERHOST =
                wrappedAddMsg;

            console.log(
                '🛡️ TH SONG ADDMSG FILTER FINAL 7 ON'
            );

            return true;

        } catch (e) {

            return false;

        }

    }

    /* =========================================================
       HIDE EXISTING WALL AUDIO
       ========================================================= */

    function hideExistingSongWalls() {

        try {

            var audios =
                document.querySelectorAll(
                    '.thBcType-wall audio'
                );

            for (
                var i = 0;
                i < audios.length;
                i++
            ) {

                var root =
                    audios[i].closest(
                        '.thBcType-wall'
                    );

                if (root) {

                    root.style.display =
                        'none';

                    root.setAttribute(
                        'data-th-song-storage',
                        '1'
                    );

                }

            }

        } catch (e) {}

    }

    /* =========================================================
       OBSERVER
       ========================================================= */

    function observeWall() {

        try {

            if (
                state.observer
            ) {

                return;

            }

            state.observer =
                new MutationObserver(
                    function () {

                        hideExistingSongWalls();

                        bindPlayer();

                    }
                );

            state.observer.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );

        } catch (e) {}

    }

    /* =========================================================
       RECOVER LATEST SONG
       ========================================================= */

    function recoverLatestSong() {

        try {

            if (
                songExcluded()
            ) {

                return false;

            }

            var items =
                document.querySelectorAll(
                    '.thBcType-wall'
                );

            if (
                !items.length
            ) {

                return false;

            }

            for (
                var i =
                    items.length - 1;
                i >= 0;
                i--
            ) {

                var audio =
                    items[i].querySelector(
                        'audio'
                    );

                if (!audio) {

                    continue;

                }

                var source =
                    audio.querySelector(
                        'source'
                    );

                var url =
                    normalizeUrl(
                        audio.currentSrc ||
                        audio.src ||
                        (
                            source
                                ? source.src
                                : ''
                        )
                    );

                if (!url) {

                    continue;

                }

                var name =
                    extractFileName(
                        url
                    );

                loadPlayer(
                    url,
                    name
                );

                state.currentUrl =
                    url;

                state.currentName =
                    name;

                console.log(
                    '♻️ TH SONG LATEST SONG RECOVERED:',
                    url
                );

                return true;

            }

        } catch (e) {}

        return false;

    }

    /* =========================================================
       INSTALL
       ========================================================= */

    function install() {

        try {

            bindPlayer();

            hookAddMsg();

            observeWall();

            hideExistingSongWalls();

            /*
             * نعطي الواجهة فرصة تحمل
             * عناصر الـWall قبل recovery.
             */

            setTimeout(
                function () {

                    hideExistingSongWalls();

                    recoverLatestSong();

                },
                300
            );

            setTimeout(
                function () {

                    hideExistingSongWalls();

                    recoverLatestSong();

                },
                1200
            );

            state.uploadTimer =
                setInterval(
                    function () {

                        bindPlayer();

                        watchUpload();

                        hideExistingSongWalls();

                    },
                    500
                );

            window.__TH_SONG_PLAYER_SYNC_FINAL_7_TIMER__ =
                state.uploadTimer;

            console.log(
                '════════════════════════════════════'
            );

            console.log(
                '🎵 TH SONG PLAYER SYNC FINAL 7 READY'
            );

            console.log(
                '🎵 TRANSPORT: BC CHAT'
            );

            console.log(
                '🔄 REALTIME: SWITCH ONLY'
            );

            console.log(
                '🚫 PMSG: DISABLED'
            );

            console.log(
                '🚫 SOCKET PATCH: DISABLED'
            );

            console.log(
                '🚫 PLAY/PAUSE/SEEK SYNC: DISABLED'
            );

            console.log(
                '💾 WALL: STORAGE ONLY'
            );

            console.log(
                '🛡️ WALL AUDIO: HIDDEN'
            );

            console.log(
                '♻️ LATEST SONG RECOVERY: ON'
            );

            console.log(
                '════════════════════════════════════'
            );

        } catch (e) {

            console.error(
                'TH SONG FINAL 7 INSTALL ERROR:',
                e
            );

        }

    }

    /* =========================================================
       API
       ========================================================= */

    window.TH_SONG_PLAYER_SYNC_API = {

        getState:
            function () {

                return {

                    url:
                        getPlayerUrl(),

                    name:
                        getPlayerName(),

                    room:
                        getRoomId(),

                    excluded:
                        songExcluded(),

                    audio:
                        !!getAudio()

                };

            },

        rescan:
            function () {

                bindPlayer();

                hideExistingSongWalls();

                recoverLatestSong();

            },

        sync:
            function () {

                var url =
                    getPlayerUrl();

                if (!url) {

                    return false;

                }

                return sendSwitch(
                    url,
                    getPlayerName()
                );

            },

        destroy:
            function () {

                try {

                    if (
                        state.uploadTimer
                    ) {

                        clearInterval(
                            state.uploadTimer
                        );

                        state.uploadTimer =
                            null;

                    }

                    if (
                        state.switchTimer
                    ) {

                        clearTimeout(
                            state.switchTimer
                        );

                        state.switchTimer =
                            null;

                    }

                    if (
                        state.observer
                    ) {

                        state.observer.disconnect();

                        state.observer =
                            null;

                    }

                    if (
                        window.__TH_SONG_PLAYER_SYNC_FINAL_7_TIMER__
                    ) {

                        clearInterval(
                            window.__TH_SONG_PLAYER_SYNC_FINAL_7_TIMER__
                        );

                        window.__TH_SONG_PLAYER_SYNC_FINAL_7_TIMER__ =
                            null;

                    }

                    console.log(
                        '🗑️ TH SONG PLAYER SYNC FINAL 7 DESTROYED'
                    );

                } catch (e) {}

            }

    };

    install();

})();
