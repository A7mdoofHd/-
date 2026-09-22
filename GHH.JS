(function () {
    'use strict';

    /* =========================================================
       TH SONG — PLAYER ONLY SYNC
       FINAL — SONG SWITCH ONLY

       يعمل:
       - Wall = storage
       - Player = visible target
       - NEW SONG = realtime sync
       - NEW SONG = persistence after refresh
       - Wall audio = hidden / consumed

       LOCAL ONLY:
       - Play
       - Pause
       - Seek

       مهم:
       تشغيل / إيقاف / سحب المستخدم لا ينتقل
       إلى أي مستخدم آخر.
       ========================================================= */

    var PREFIX = '__TH_SONG_PLAYER_SYNC__';
    var EXCLUDED_ROOM = 'y24qvky05f';

    /* ---------------------------------------------------------
       منع تشغيل نسخة ثانية
       --------------------------------------------------------- */

    if (window.__TH_SONG_PLAYER_SYNC_LOCAL_ONLY__) {
        console.log('⚠️ TH SONG PLAYER SYNC موجود مسبقًا');
        return;
    }

    window.__TH_SONG_PLAYER_SYNC_LOCAL_ONLY__ = true;

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

                /*
                 * مهم:
                 * تغيير الأغنية لا يعني تشغيلها.
                 */

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
       ---------------------------------------------------------
       هذه الدالة أصبحت تستخدم فقط لتغيير الأغنية.
       لا يتم استدعاؤها من play / pause / seek.
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

            /*
             * نسمح فقط بـ switch.
             */

            if (
                String(action || '') !==
                'switch'
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
                'switch' +
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
                '📡 TH SONG SWITCH SYNC SENT:',
                url
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
       ---------------------------------------------------------
       مهم:
       switch يغير الأغنية فقط.
       لا يوجد audio.play().
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

            /*
             * لا نقبل إلا switch.
             */

            if (
                String(action || '') !==
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

            var current =
                normalizeUrl(
                    audio.currentSrc ||
                    audio.src ||
                    ''
                );

            /*
             * تغيير الأغنية.
             */

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

            /*
             * لا نغير currentTime
             * ولا نشغل الصوت.
             */

            try {

                audio.pause();

            } catch (e) {}

            setStatus(
                'متوقف'
            );

            console.log(
                '🎵 TH SONG REMOTE SWITCH APPLIED:',
                url
            );

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

            console.error(
                'TH SONG APPLY REMOTE ERROR:',
                e
            );

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

            /*
             * لا نقبل إلا switch.
             */

            if (
                data.action !==
                'switch'
            ) {

                return true;

            }

            applyRemote(
                data.action,
                data.url,
                data.name,
                data.time
            );

            console.log(
                '📥 TH SONG SWITCH RECEIVED:',
                data.url
            );

            return true;

        } catch (e) {

            return true;

        }

    }

    /* =========================================================
       PLAYER EVENTS
       ---------------------------------------------------------
       LOCAL ONLY
       ---------------------------------------------------------
       لا يوجد SEND_EVENT هنا نهائيًا.
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

            if (
                audio.__TH_SONG_LOCAL_ONLY_BOUND__
            ) {

                return true;

            }

            audio.__TH_SONG_LOCAL_ONLY_BOUND__ =
                true;

            /*
             * التشغيل محلي فقط.
             */

            audio.addEventListener(
                'play',
                function () {

                    console.log(
                        '▶️ TH SONG LOCAL PLAY — NO SYNC'
                    );

                }
            );

            /*
             * الإيقاف محلي فقط.
             */

            audio.addEventListener(
                'pause',
                function () {

                    console.log(
                        '⏸️ TH SONG LOCAL PAUSE — NO SYNC'
                    );

                }
            );

            /*
             * السحب محلي فقط.
             */

            audio.addEventListener(
                'seeked',
                function () {

                    console.log(
                        '⏩ TH SONG LOCAL SEEK — NO SYNC'
                    );

                }
            );

            console.log(
                '🎵 TH SONG PLAYER CONNECTED — LOCAL CONTROLS ONLY'
            );

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
             * حفظ الأغنية في الـWall.
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
             * مزامنة تغيير الأغنية فقط.
             */

            sendSync(
                'switch',
                url,
                name,
                0
            );

        } catch (e) {

            console.error(
                'TH SONG UPLOAD WATCH ERROR:',
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
                oldAdd.__TH_SONG_LOCAL_ONLY__
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
                         * إخفاء رسالة switch
                         * من الشات.
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
                         * استهلاك أغنية الـWall
                         * قبل ظهورها.
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

            wrappedAddMsg.__TH_SONG_LOCAL_ONLY__ =
                true;

            wrappedAddMsg.__TH_SONG_LOCAL_ONLY_ORIGINAL__ =
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

            state.socket =
                socket;

            if (
                typeof socket.onevent !==
                'function'
            ) {

                return false;

            }

            if (
                socket.__TH_SONG_REALTIME_SWITCH_PATCHED_LOCAL__
            ) {

                state.socketPatched =
                    true;

                return true;

            }

            var oldOnevent =
                socket.onevent;

            state.oldSocketOnevent =
                oldOnevent;

            socket.__TH_SONG_OLD_ONEVENT_LOCAL__ =
                oldOnevent;

            socket.onevent =
                function (packet) {

                    try {

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
                                         * switch فقط.
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
                     * نترك Socket الأصلي يعمل طبيعيًا.
                     */

                    return oldOnevent.apply(
                        this,
                        arguments
                    );

                };

            socket.__TH_SONG_REALTIME_SWITCH_PATCHED_LOCAL__ =
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
                '🎵 SONG SWITCH: REALTIME + WALL STORAGE'
            );

            console.log(
                '🎵 PLAY / PAUSE / SEEK: LOCAL ONLY'
            );

            console.log(
                '🚫 PMSG: DISABLED'
            );

            console.log(
                '💾 WALL: STORAGE ONLY'
            );

            console.log(
                '🛡️ WALL AUDIO: HIDDEN / CONSUMED'
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
                        !!getAudio(),

                    localControls:
                        true,

                    syncMode:
                        'switch-only'

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

                /*
                 * API sync أصبح switch فقط.
                 * لا يرسل play / pause.
                 */

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
                    'switch',
                    url,
                    getPlayerName(),
                    0
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
                     * إعادة Socket كما كان.
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
                                .__TH_SONG_REALTIME_SWITCH_PATCHED_LOCAL__;

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
