(function () {
    'use strict';

    /* =========================================================
       TH SONG — FINAL 6 TEST
       SWITCH ONLY
       
       الهدف:
       - اختبار سبب الـ Wall Blank
       - رفع الأغنية = Switch فقط
       - Play / Pause / Seek = معطل مؤقتًا
       - ZERO WALL SEND
       ========================================================= */

    /* =========================================================
       CLEAN PREVIOUS VERSION
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

    try {
        delete window.__TH_SONG_PLAYER_SYNC_FINAL_3__;
        delete window.__TH_SONG_PLAYER_SYNC_FINAL_4__;
        delete window.__TH_SONG_PLAYER_SYNC_FINAL_5__;
        delete window.__TH_SONG_PLAYER_SYNC_FINAL_6__;
    } catch (e) {}

    /* =========================================================
       CONFIG
       ========================================================= */

    var PREFIX =
        '__TH_SONG_PLAYER_SYNC__';

    var EXCLUDED_ROOM =
        'y24qvky05f';

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

        oldAddMsg: null

    };

    window.__TH_SONG_PLAYER_SYNC_FINAL_6__ =
        true;

    /* =========================================================
       HELPERS
       ========================================================= */

    function cleanUrl(url) {

        try {

            url =
                String(url || '')
                    .trim();

            if (!url) {
                return '';
            }

            if (
                /^https?:\/\//i
                    .test(url)
            ) {

                return url;

            }

            if (
                url.charAt(0) !== '/'
            ) {

                url =
                    '/' + url;

            }

            return (
                location.origin +
                url
            );

        } catch (e) {

            return '';

        }

    }

    function normalizeUrl(url) {

        try {

            return cleanUrl(url)
                .replace(
                    /&amp;/gi,
                    '&'
                )
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
                s.audio instanceof
                    HTMLAudioElement
            ) {

                state.audio =
                    s.audio;

                return s.audio;

            }

        } catch (e) {}

        if (
            state.audio &&
            state.audio instanceof
                HTMLAudioElement
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
                    String(text || '');

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
       SONG URL CHECK
       ========================================================= */

    function isSongUrl(url) {

        try {

            url =
                normalizeUrl(url);

            if (!url) {
                return false;
            }

            return (
                /^https?:\/\/[^/]+\/sendfile\/[^"'<>?\s]+\.(?:mp3|m4a|wav|ogg|aac)(?:\?[^"'<>?\s]*)?$/i
                    .test(url)
            );

        } catch (e) {

            return false;

        }

    }

    /* =========================================================
       LOAD PLAYER
       ========================================================= */

    function loadPlayer(
        url,
        name
    ) {

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
                String(name || '');

            if (s) {

                s.audioUrl =
                    url;

                s.audioName =
                    String(name || '');

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

                audio.pause();

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
       SWITCH SYNC ONLY
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

                console.error(
                    '❌ SEND_EVENT_TIGERHOST غير موجود'
                );

                return false;

            }

            url =
                normalizeUrl(url);

            name =
                String(name || '');

            if (
                !isSongUrl(url)
            ) {

                console.warn(
                    '🛡️ INVALID SONG URL:',
                    url
                );

                return false;

            }

            var msg =
                PREFIX +
                '|switch|' +
                encodeURIComponent(url) +
                '|' +
                encodeURIComponent(name) +
                '|0.000';

            /*
             * =================================================
             * مهم:
             *
             * هذا ليس Wall.
             * link فارغ.
             * type chat.
             *
             * =================================================
             */

            window.SEND_EVENT_TIGERHOST(
                'SEND_BC_TIGERHOST_EVENT',
                {
                    msg: msg,
                    link: '',
                    type: 'chat'
                }
            );

            console.log(
                '⚡ TH SONG SWITCH SENT:',
                url
            );

            return true;

        } catch (e) {

            console.error(
                'TH SONG SWITCH ERROR:',
                e
            );

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
        data
    ) {

        try {

            if (
                songExcluded()
            ) {

                return;

            }

            if (!data) {
                return;
            }

            if (
                data.action !==
                'switch'
            ) {

                return;

            }

            var url =
                normalizeUrl(
                    data.url
                );

            var name =
                decodeSafe(
                    data.name
                );

            if (
                !isSongUrl(url)
            ) {

                console.warn(
                    '🛡️ REMOTE INVALID SONG:',
                    url
                );

                return;

            }

            state.applyingRemote =
                true;

            var loaded =
                loadPlayer(
                    url,
                    name
                );

            if (loaded) {

                state.currentUrl =
                    url;

                state.currentName =
                    name;

                setStatus(
                    'تم تحديث الأغنية'
                );

                console.log(
                    '📥 TH SONG SWITCH RECEIVED:',
                    url
                );

            }

            setTimeout(
                function () {

                    state.applyingRemote =
                        false;

                },
                250
            );

        } catch (e) {

            state.applyingRemote =
                false;

        }

    }

    /* =========================================================
       CONSUME SYNC
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
                data
            );

            return true;

        } catch (e) {

            return true;

        }

    }

    /* =========================================================
       PLAYER BIND
       
       SWITCH ONLY
       
       لا play
       لا pause
       لا seek
       ========================================================= */

    function bindPlayer() {

        try {

            var audio =
                getAudio();

            if (!audio) {
                return false;
            }

            if (
                audio.__TH_SONG_SYNC_BOUND_6__
            ) {

                state.audio =
                    audio;

                return true;

            }

            audio.__TH_SONG_SYNC_BOUND_6__ =
                true;

            state.audio =
                audio;

            /*
             * لا نضيف أي event listener
             * للتشغيل أو الإيقاف أو الـseek.
             *
             * الاختبار الحالي Switch فقط.
             */

            console.log(
                '🎵 TH SONG PLAYER CONNECTED — SWITCH ONLY'
            );

            return true;

        } catch (e) {

            return false;

        }

    }

    /* =========================================================
       WATCH NEW UPLOAD
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

            if (
                !isSongUrl(url)
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
                '🎵 NEW SONG DETECTED:',
                url
            );

            /*
             * =================================================
             * SWITCH ONLY
             *
             * لا Wall
             * لا PMSG
             * لا Play Sync
             * لا Pause Sync
             * لا Seek Sync
             * =================================================
             */

            sendSwitch(
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
       EXISTING WALL SONG
       ========================================================= */

    function extractWallAudio(
        obj
    ) {

        try {

            if (
                !obj ||
                typeof obj !==
                'object'
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

            if (
                !isSongUrl(url)
            ) {

                return null;

            }

            return {

                url: url,

                name:
                    url.substring(
                        url.lastIndexOf('/') +
                        1
                    )

            };

        } catch (e) {

            return null;

        }

    }

    function processWallObject(
        obj
    ) {

        try {

            if (
                !obj ||
                typeof obj !==
                'object'
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
                '🛡️ EXISTING WALL SONG CONSUMED:',
                media.url
            );

            return true;

        } catch (e) {

            return false;

        }

    }

    /* =========================================================
       ADDMSG HOOK
       ========================================================= */

    function hookAddMsg() {

        try {

            var oldAdd =
                window.ADDMSG_TIGERHOST;

            if (
                typeof oldAdd !==
                'function'
            ) {

                console.warn(
                    '⚠️ ADDMSG_TIGERHOST غير موجود وقت التثبيت'
                );

                return false;

            }

            if (
                oldAdd.__TH_SONG_FINAL_6__
            ) {

                return true;

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
                         * =================================================
                         * SONG SWITCH
                         * لا يظهر في الشات.
                         * =================================================
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
                         * =================================================
                         * OLD WALL AUDIO
                         * =================================================
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

            wrappedAddMsg.__TH_SONG_FINAL_6__ =
                true;

            window.ADDMSG_TIGERHOST =
                wrappedAddMsg;

            console.log(
                '🛡️ TH SONG ADDMSG FILTER ON'
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

                        bindPlayer();

                        hideExistingSongWalls();

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
       INSTALL
       ========================================================= */

    function install() {

        try {

            bindPlayer();

            hookAddMsg();

            observeWall();

            hideExistingSongWalls();

            state.uploadTimer =
                setInterval(
                    function () {

                        bindPlayer();

                        watchUpload();

                        hideExistingSongWalls();

                    },
                    500
                );

            console.log(
                '========================================'
            );

            console.log(
                '🎵 TH SONG FINAL 6'
            );

            console.log(
                '⚡ SWITCH ONLY: ON'
            );

            console.log(
                '🚫 PLAY SYNC: OFF'
            );

            console.log(
                '🚫 PAUSE SYNC: OFF'
            );

            console.log(
                '🚫 SEEK SYNC: OFF'
            );

            console.log(
                '🚫 WALL SEND: OFF'
            );

            console.log(
                '🚫 PMSG: OFF'
            );

            console.log(
                '🚫 RAW SOCKET: OFF'
            );

            console.log(
                '========================================'
            );

        } catch (e) {

            console.error(
                'TH SONG FINAL 6 INSTALL ERROR:',
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
                        !!getAudio(),

                    mode:
                        'SWITCH_ONLY'

                };

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
                        state.observer
                    ) {

                        state.observer.disconnect();

                        state.observer =
                            null;

                    }

                    console.log(
                        '🗑️ TH SONG FINAL 6 DESTROYED'
                    );

                } catch (e) {}

            }

    };

    install();

})();
