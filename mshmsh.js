(function () {
    'use strict';

    /* =========================================================
       TH SONG — PLAYER ONLY SYNC
       FINAL — NO PMSG / NO ANNOUNCEMENT

       FIX:
       NEW SONG SWITCH IS ALSO CAPTURED DIRECTLY
       FROM SOCKET IN REAL TIME.

       باقي النظام كما هو:
       - Wall = storage
       - Player = visible target
       - Play/Pause/Seek = BC chat sync
       - No PMSG
       ========================================================= */

    var PREFIX = '__TH_SONG_PLAYER_SYNC__';
    var EXCLUDED_ROOM = 'y24qvky05f';

    /* ---------------------------------------------------------
       منع تشغيل نسخة ثانية
       --------------------------------------------------------- */

    if (window.__TH_SONG_PLAYER_SYNC_FINAL_3__) {
        console.log('⚠️ TH SONG PLAYER SYNC موجود مسبقًا');
        return;
    }

    window.__TH_SONG_PLAYER_SYNC_FINAL_3__ = true;

    /* ---------------------------------------------------------
       STATE
       --------------------------------------------------------- */

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

        socket: null,
        oldSocketOnevent: null,
        socketPatched: false
    };

    /* =========================================================
       HELPERS
       ========================================================= */

    function cleanUrl(url) {

        try {

            url = String(url || '').trim();

            if (!url) {
                return '';
            }

            if (/^https?:\/\//i.test(url)) {
                return url;
            }

            if (url.charAt(0) !== '/') {
                url = '/' + url;
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

            return window.__TH_SONG_JQ_STATE__ || null;

        } catch (e) {

            return null;

        }
    }

    function getAudio() {

        try {

            var s = getState();

            if (
                s &&
                s.audio instanceof HTMLAudioElement
            ) {

                state.audio = s.audio;

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

            var s = getState();

            if (
                s &&
                s.audioUrl
            ) {

                return normalizeUrl(
                    s.audioUrl
                );

            }

        } catch (e) {}

        var audio = getAudio();

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

            var s = getState();

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
                        name || 'بدون اسم'
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
       SEND SYNC
       ========================================================= */

    function sendSync(
        action,
        url,
        name,
        time
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
                String(name || '');

            var msg =
                PREFIX +
                '|' +
                String(action || '') +
                '|' +
                encodeURIComponent(url) +
                '|' +
                encodeURIComponent(name) +
                '|' +
                Number(
                    time || 0
                ).toFixed(3);

            window.SEND_EVENT_TIGERHOST(
                'SEND_BC_TIGERHOST_EVENT',
                {
                    msg: msg,
                    link: '',
                    type: 'chat'
                }
            );

            console.log(
                '📡 TH SONG SYNC SENT:',
                action,
                time
            );

            return true;

        } catch (e) {

            console.error(
                'TH SONG SYNC SEND ERROR:',
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
       APPLY REMOTE
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

            url =
                normalizeUrl(url);

            name =
                decodeSafe(name);

            var t =
                Number(time);

            if (
                !Number.isFinite(t)
            ) {

                t = 0;

            }

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
                            t
                        );

                    },
                    500
                );

                return;

            }

            state.applyingRemote =
                true;

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

                loadPlayer(
                    url,
                    name
                );

                audio =
                    getAudio();

            } else {

                var s =
                    getState();

                if (s) {

                    s.audioUrl =
                        url;

                    s.audioName =
                        name;

                }

                state.currentUrl =
                    url;

                state.currentName =
                    name;

                setPlayerName(
                    name
                );

            }

            try {

                if (
                    Math.abs(
                        Number(
                            audio.currentTime ||
                            0
                        ) - t
                    ) > 0.20
                ) {

                    audio.currentTime =
                        t;

                }

            } catch (e) {}

            if (
                action === 'play' ||
                action === 'switch' ||
                action === 'seek-play'
            ) {

                var p =
                    audio.play();

                if (
                    p &&
                    typeof p.catch ===
                    'function'
                ) {

                    p.catch(
                        function () {

                            console.log(
                                '⚠️ المتصفح منع التشغيل التلقائي'
                            );

                        }
                    );

                }

                setStatus(
                    'يعمل'
                );

            } else {

                try {

                    audio.pause();

                } catch (e) {}

                setStatus(
                    'متوقف'
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
                data.action,
                data.url,
                data.name,
                data.time
            );

            console.log(
                '📥 TH SONG SYNC RECEIVED:',
                data.action,
                data.time
            );

            return true;

        } catch (e) {

            return true;

        }

    }

    /* =========================================================
       PLAYER EVENTS
       ========================================================= */

    function bindPlayer() {

        try {

            var audio =
                getAudio();

            if (!audio) {
                return false;
            }

            if (
                audio.__TH_SONG_SYNC_BOUND_3__
            ) {

                state.audio =
                    audio;

                return true;

            }

            audio.__TH_SONG_SYNC_BOUND_3__ =
                true;

            state.audio =
                audio;

            audio.addEventListener(
                'play',
                function () {

                    if (
                        state.applyingRemote
                    ) {

                        return;

                    }

                    sendSync(
                        'play',
                        getPlayerUrl(),
                        getPlayerName(),
                        audio.currentTime
                    );

                }
            );

            audio.addEventListener(
                'pause',
                function () {

                    if (
                        state.applyingRemote
                    ) {

                        return;

                    }

                    sendSync(
                        'pause',
                        getPlayerUrl(),
                        getPlayerName(),
                        audio.currentTime
                    );

                }
            );

            audio.addEventListener(
                'seeked',
                function () {

                    if (
                        state.applyingRemote
                    ) {

                        return;

                    }

                    sendSync(
                        audio.paused
                            ? 'seek-pause'
                            : 'seek-play',

                        getPlayerUrl(),

                        getPlayerName(),

                        audio.currentTime
                    );

                }
            );

            console.log(
                '🎵 TH SONG PLAYER CONNECTED'
            );

            return true;

        } catch (e) {

            return false;

        }

    }

    /* =========================================================
       WATCH NEW SONG
       ---------------------------------------------------------
       هذا الجزء لم يتغير عن نسختك الشغالة.
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
             * حفظ الأغنية في الـWall
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
             * المزامنة الحالية التي كانت شغالة.
             */

            sendSync(
                'switch',
                url,
                name,
                0
            );

        } catch (e) {}

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

            if (
                oldAdd.__TH_SONG_SYNC_FINAL_3__
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
                         * نخفي رسالة المزامنة
                         */

                        if (
                            msg.indexOf(
                                PREFIX + '|'
                            ) === 0
                        ) {

                            consumeSyncMessage(
                                msg
                            );

                            console.log(
                                '🛡️ SONG SYNC BLOCKED FROM CHAT'
                            );

                            return;

                        }

                        /*
                         * Wall audio
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

            wrappedAddMsg.__TH_SONG_SYNC_FINAL_3__ =
                true;

            wrappedAddMsg.__TH_SONG_SYNC_FINAL_3_ORIGINAL__ =
                oldAdd;

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
       REALTIME SOCKET SWITCH
       ---------------------------------------------------------
       الجديد الوحيد الحقيقي هنا.

       لا نغير SEND_SYNC.
       لا نغير Wall.
       لا نغير ADDMSG.

       فقط نلتقط switch من Socket مباشرة.
       ========================================================= */

    function hookRealtimeSocket() {

        try {

            var socket =
                window.x_x;

            if (!socket) {

                return false;

            }

            if (
                state.socket === socket &&
                state.socketPatched
            ) {

                return true;

            }

            /*
             * إذا تغير الـsocket:
             * نركب عليه من جديد.
             */

            state.socket =
                socket;

            if (
                typeof socket.onevent !==
                'function'
            ) {

                return false;

            }

            if (
                socket.__TH_SONG_REALTIME_SWITCH_PATCHED__
            ) {

                state.socketPatched =
                    true;

                return true;

            }

            var oldOnevent =
                socket.onevent;

            state.oldSocketOnevent =
                oldOnevent;

            socket.__TH_SONG_OLD_ONEVENT__ =
                oldOnevent;

            socket.onevent =
                function (packet) {

                    try {

                        /*
                         * Socket.IO packet:
                         *
                         * packet.data =
                         * [
                         *   'SEND_EVENT_EMIT_SERVER',
                         *   payload
                         * ]
                         */

                        var data =
                            packet &&
                            packet.data;

                        if (
                            Array.isArray(data) &&
                            data.length >= 2 &&
                            data[0] ===
                            'SEND_EVENT_EMIT_SERVER'
                        ) {

                            var payload =
                                data[1];

                            /*
                             * بعض الأنظمة قد تعيد
                             * packet بعد decode.
                             */

                            if (
                                payload &&
                                typeof payload ===
                                'object'
                            ) {

                                var cmd =
                                    String(
                                        payload.cmd ||
                                        ''
                                    );

                                if (
                                    cmd ===
                                    'SEND_BC_TIGERHOST_EVENT'
                                ) {

                                    var bcData =
                                        payload.data;

                                    if (
                                        bcData &&
                                        typeof bcData ===
                                        'object'
                                    ) {

                                        var msg =
                                            String(
                                                bcData.msg ||
                                                ''
                                            );

                                        /*
                                         * نحن مهتمون فقط
                                         * بـ switch.
                                         */

                                        if (
                                            msg.indexOf(
                                                PREFIX +
                                                '|switch|'
                                            ) === 0
                                        ) {

                                            console.log(
                                                '⚡ TH SONG REALTIME SWITCH RECEIVED'
                                            );

                                            /*
                                             * نعالجها فورًا
                                             * قبل أي مسار آخر.
                                             */

                                            consumeSyncMessage(
                                                msg
                                            );

                                        }

                                    }

                                }

                            }

                        }

                    } catch (e) {}

                    /*
                     * لا نوقف الـsocket الأصلي.
                     *
                     * نخلي النظام الأصلي يكمل
                     * عمله طبيعيًا.
                     */

                    return oldOnevent.apply(
                        this,
                        arguments
                    );

                };

            socket.__TH_SONG_REALTIME_SWITCH_PATCHED__ =
                true;

            state.socketPatched =
                true;

            console.log(
                '⚡ TH SONG REALTIME SOCKET SWITCH ON'
            );

            return true;

        } catch (e) {

            console.error(
                'TH SONG SOCKET PATCH ERROR:',
                e
            );

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

                        hookRealtimeSocket();

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

            if (!items.length) {

                return false;

            }

            for (
                var i = items.length - 1;
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

            hookRealtimeSocket();

            observeWall();

            hideExistingSongWalls();

            recoverLatestSong();

            state.uploadTimer =
                setInterval(
                    function () {

                        bindPlayer();

                        hookRealtimeSocket();

                        watchUpload();

                        hideExistingSongWalls();

                    },
                    500
                );

            console.log(
                '════════════════════════════════════'
            );

            console.log(
                '🎵 TH SONG PLAYER SYNC READY'
            );

            console.log(
                '🎵 PLAY / PAUSE / SEEK: BC CHAT'
            );

            console.log(
                '⚡ NEW SONG SWITCH: RAW SOCKET + BC'
            );

            console.log(
                '🚫 PMSG: DISABLED'
            );

            console.log(
                '💾 WALL: STORAGE ONLY'
            );

            console.log(
                '🛡️ WALL AUDIO: HIDDEN'
            );

            console.log(
                '════════════════════════════════════'
            );

        } catch (e) {

            console.error(
                'TH SONG INSTALL ERROR:',
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

                hookRealtimeSocket();

                hideExistingSongWalls();

                recoverLatestSong();

            },

        sync:
            function () {

                var audio =
                    getAudio();

                var url =
                    getPlayerUrl();

                if (
                    !audio ||
                    !url
                ) {

                    return false;

                }

                return sendSync(
                    audio.paused
                        ? 'pause'
                        : 'play',

                    url,

                    getPlayerName(),

                    audio.currentTime
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

                    /*
                     * نرجع socket الأصلي
                     * إذا كان هذا الكود هو الذي عدله.
                     */

                    if (
                        state.socket &&
                        state.socketPatched &&
                        state.oldSocketOnevent &&
                        state.socket.onevent
                    ) {

                        state.socket.onevent =
                            state.oldSocketOnevent;

                        try {

                            delete state.socket
                                .__TH_SONG_REALTIME_SWITCH_PATCHED__;

                        } catch (e) {}

                    }

                    state.socketPatched =
                        false;

                    console.log(
                        '🗑️ TH SONG PLAYER SYNC DESTROYED'
                    );

                } catch (e) {}

            }

    };

    install();

})();
