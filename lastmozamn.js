(function () {
    'use strict';

    /* =========================================================
       TH SONG — PLAYER ONLY SYNC
       FINAL VERSION
       ---------------------------------------------------------
       - Custom player = visible target
       - Wall = persistence only
       - Wall audio = hidden/consumed
       - PMSG sync = consumed before chat/announcement rendering
       - Play / Pause / Seek / Song Switch synchronization
       ========================================================= */

    var PREFIX = '__TH_SONG_PLAYER_SYNC__';
    var EXCLUDED_ROOM = 'y24qvky05f';

    /* ---------------------------------------------------------
       منع تشغيل نسخة ثانية
       --------------------------------------------------------- */

    if (window.__TH_SONG_PLAYER_SYNC_FINAL__) {
        console.log('⚠️ TH SONG PLAYER SYNC موجود مسبقًا');
        return;
    }

    window.__TH_SONG_PLAYER_SYNC_FINAL__ = true;

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
        bindTimer: null,

        oldAddMsg: null,
        installed: false
    };

    /* ---------------------------------------------------------
       Helpers
       --------------------------------------------------------- */

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

            url = cleanUrl(url);

            if (!url) {
                return '';
            }

            return url
                .replace(/&amp;/gi, '&')
                .trim();

        } catch (e) {

            return '';

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

            if (s && s.audioUrl) {

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

            if (s && s.audioName) {
                return String(
                    s.audioName
                );
            }

        } catch (e) {}

        return '';

    }

    function setPlayerName(name) {

        try {

            name = String(name || '');

            var el =
                document.getElementById(
                    'TH_SONG_NAME'
                );

            if (el) {
                el.textContent =
                    name || 'بدون اسم';
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
                typeof window.CURRENT_ROOM !==
                'undefined' &&
                window.CURRENT_ROOM
            ) {
                return String(
                    window.CURRENT_ROOM
                );
            }

        } catch (e) {}

        try {

            if (
                typeof window.room_id !==
                'undefined' &&
                window.room_id
            ) {
                return String(
                    window.room_id
                );
            }

        } catch (e) {}

        try {

            if (
                typeof window.roomid !==
                'undefined' &&
                window.roomid
            ) {
                return String(
                    window.roomid
                );
            }

        } catch (e) {}

        try {

            if (
                typeof window.room !==
                'undefined' &&
                window.room
            ) {
                return String(
                    window.room
                );
            }

        } catch (e) {}

        try {

            var item =
                document.querySelector(
                    '.room.th-room-item.sel,' +
                    '.room.th-room-item.active,' +
                    '.room.th-room-item'
                );

            if (item) {

                var html =
                    item.getAttribute(
                        'onclick'
                    ) || '';

                var match =
                    html.match(
                        /Send_Rjoin\(\s*['"]([^'"]+)['"]/i
                    );

                if (match) {
                    return String(
                        match[1]
                    );
                }

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

    /* ---------------------------------------------------------
       Player loader
       --------------------------------------------------------- */

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

                console.log(
                    '⏳ TH SONG: player not ready'
                );

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

            if (
                normalizeUrl(
                    audio.currentSrc ||
                    audio.src ||
                    ''
                ) !== url
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

            setStatus(
                'تم تحميل الأغنية'
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

    /* ---------------------------------------------------------
       Remote apply
       --------------------------------------------------------- */

    function applyRemote(
        action,
        url,
        name,
        time
    ) {

        try {

            if (songExcluded()) {
                return;
            }

            url =
                normalizeUrl(url);

            name =
                decodeSafe(name);

            var t =
                Number(time);

            if (!Number.isFinite(t)) {
                t = 0;
            }

            if (!url) {
                return;
            }

            state.applyingRemote =
                true;

            var audio =
                getAudio();

            if (!audio) {

                state.applyingRemote =
                    false;

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

            var current =
                normalizeUrl(
                    audio.currentSrc ||
                    audio.src ||
                    ''
                );

            if (current !== url) {

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
                            audio.currentTime || 0
                        ) - t
                    ) > 0.20
                ) {

                    audio.currentTime =
                        t;

                }

            } catch (e) {}

            if (
                action === 'switch' ||
                action === 'play' ||
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

            } else {

                try {
                    audio.pause();
                } catch (e) {}

            }

            setStatus(
                action === 'pause' ||
                action === 'seek-pause'
                    ? 'متوقف'
                    : 'يعمل'
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
                'TH SONG REMOTE ERROR:',
                e
            );

        }

    }

    /* ---------------------------------------------------------
       Decode
       --------------------------------------------------------- */

    function decodeSafe(value) {

        try {

            return decodeURIComponent(
                String(value || '')
            );

        } catch (e) {

            return String(
                value || ''
            );

        }

    }

    /* ---------------------------------------------------------
       Persistence — Wall only
       --------------------------------------------------------- */

    function persistToWall(
        url
    ) {

        try {

            if (
                songExcluded() ||
                !url
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

            window.SEND_EVENT_TIGERHOST(
                'SEND_BC_TIGERHOST_EVENT',
                {
                    msg: '',
                    link: cleanUrl(url),
                    type: 'wall'
                }
            );

            console.log(
                '💾 TH SONG: saved to wall storage'
            );

            return true;

        } catch (e) {

            console.error(
                'TH SONG WALL SAVE ERROR:',
                e
            );

            return false;

        }

    }

    /* ---------------------------------------------------------
       Sync sender
       --------------------------------------------------------- */

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
                encodeURIComponent(
                    url
                ) +
                '|' +
                encodeURIComponent(
                    name
                ) +
                '|' +
                Number(
                    time || 0
                ).toFixed(3);

            window.SEND_EVENT_TIGERHOST(
                'SEND_PMSG_TIGERHOST_EVENT',
                {
                    msg: msg,
                    state: 'all'
                }
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

    /* ---------------------------------------------------------
       Parse sync
       --------------------------------------------------------- */

    function parseSync(
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

    /* ---------------------------------------------------------
       Consume sync with dedupe
       --------------------------------------------------------- */

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
             * نفس الرسالة قد تمر:
             * socket
             * ADDMSG
             * local echo
             *
             * نمنع تطبيقها مرتين.
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
                '🎵 TH SONG SYNC RECEIVED:',
                data.action,
                data.url,
                data.time
            );

            /*
             * مهم جدًا:
             * true = لا تسمح للرسالة بالوصول
             * إلى الشات / الإعلان / الصلاحيات.
             */

            return true;

        } catch (e) {

            return true;

        }

    }

    /* ---------------------------------------------------------
       Player events
       --------------------------------------------------------- */

    function bindPlayer() {

        try {

            var audio =
                getAudio();

            if (!audio) {
                return false;
            }

            if (
                audio.__TH_SONG_FINAL_BOUND__
            ) {
                state.audio =
                    audio;

                return true;
            }

            audio.__TH_SONG_FINAL_BOUND__ =
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

                    var url =
                        getPlayerUrl();

                    var name =
                        getPlayerName();

                    sendSync(
                        'play',
                        url,
                        name,
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

                    var url =
                        getPlayerUrl();

                    var name =
                        getPlayerName();

                    sendSync(
                        'pause',
                        url,
                        name,
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

                    var url =
                        getPlayerUrl();

                    var name =
                        getPlayerName();

                    sendSync(
                        audio.paused
                            ? 'seek-pause'
                            : 'seek-play',
                        url,
                        name,
                        audio.currentTime
                    );

                }
            );

            audio.addEventListener(
                'ended',
                function () {

                    if (
                        state.applyingRemote
                    ) {
                        return;
                    }

                    var url =
                        getPlayerUrl();

                    var name =
                        getPlayerName();

                    sendSync(
                        'pause',
                        url,
                        name,
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

    /* ---------------------------------------------------------
       Detect new upload / player source change
       --------------------------------------------------------- */

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

            /*
             * اللاعب رفع أغنية جديدة من
             * الواجهة الخاصة بنا.
             */

            console.log(
                '🎵 TH SONG NEW SONG:',
                url
            );

            /*
             * حفظها في Wall
             */

            persistToWall(
                url
            );

            /*
             * مزامنتها مع الجميع
             */

            sendSync(
                'switch',
                url,
                name,
                0
            );

        } catch (e) {}

    }

    /* ---------------------------------------------------------
       Extract Wall audio
       --------------------------------------------------------- */

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

            var part =
                clean.substring(
                    clean.lastIndexOf('/') + 1
                );

            return decodeSafe(
                part
            ) || 'أغنية';

        } catch (e) {

            return 'أغنية';

        }

    }

    /* ---------------------------------------------------------
       Wall message handler
       --------------------------------------------------------- */

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

            /*
             * Wall هنا مجرد storage.
             * نحمّل الرابط للمشغل فقط.
             */

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

            /*
             * true =
             * لا تمرر Wall audio للعرض.
             */

            console.log(
                '🛡️ TH SONG WALL AUDIO CONSUMED:',
                media.url
            );

            return true;

        } catch (e) {

            return false;

        }

    }

    /* ---------------------------------------------------------
       ADDMSG filter
       --------------------------------------------------------- */

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
                oldAdd.__TH_SONG_FINAL_WRAPPER__
            ) {
                state.oldAddMsg =
                    oldAdd.__TH_SONG_FINAL_ORIGINAL__ ||
                    oldAdd;

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
                         * أهم فلتر في النظام:
                         *
                         * يمنع رسالة المزامنة من
                         * الظهور كإعلان أو صلاحية
                         * أو رسالة عادية.
                         */

                        if (
                            msg.indexOf(
                                PREFIX + '|'
                            ) === 0
                        ) {

                            /*
                             * إذا وصلت من ADDMSG
                             * ولم تمر سابقًا من socket
                             * نعالجها هنا.
                             */

                            consumeSyncMessage(
                                msg
                            );

                            console.log(
                                '🛡️ SONG SYNC BLOCKED FROM CHAT:',
                                msg
                            );

                            return;

                        }

                        /*
                         * Wall audio:
                         * نحوله للمشغل ونمنع عرضه.
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

            wrappedAddMsg.__TH_SONG_FINAL_WRAPPER__ =
                true;

            wrappedAddMsg.__TH_SONG_FINAL_ORIGINAL__ =
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

    /* ---------------------------------------------------------
       Raw Socket interception
       --------------------------------------------------------- */

    function hookSocket() {

        try {

            var socket =
                window.x_x;

            if (
                !socket ||
                typeof socket.onevent !==
                'function'
            ) {
                return false;
            }

            if (
                socket.__TH_SONG_FINAL_SOCKET__
            ) {
                return true;
            }

            var oldOnevent =
                socket.onevent;

            socket.onevent =
                function (packet) {

                    try {

                        var data =
                            packet &&
                            packet.data;

                        /*
                         * socket packet غالبًا:
                         * [
                         *   'SEND_EVENT_EMIT_SERVER',
                         *   {
                         *      cmd:'...',
                         *      data:{...}
                         *   }
                         * ]
                         */

                        if (
                            Array.isArray(data) &&
                            data.length >= 2
                        ) {

                            var eventName =
                                String(
                                    data[0] || ''
                                );

                            var payload =
                                data[1];

                            if (
                                eventName ===
                                'SEND_EVENT_EMIT_SERVER' &&
                                payload &&
                                typeof payload ===
                                'object'
                            ) {

                                var eventData =
                                    payload.data;

                                if (
                                    eventData &&
                                    typeof eventData ===
                                    'object'
                                ) {

                                    var msg =
                                        String(
                                            eventData.msg ||
                                            ''
                                        );

                                    /*
                                     * استهلاك المزامنة
                                     * قبل ON_DATE_SEND
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

                                }

                            }

                        }

                    } catch (e) {}

                    return oldOnevent.apply(
                        this,
                        arguments
                    );

                };

            socket.__TH_SONG_FINAL_SOCKET__ =
                true;

            socket.__TH_SONG_FINAL_SOCKET_ORIGINAL__ =
                oldOnevent;

            console.log(
                '🛡️ TH SONG SOCKET FILTER ON'
            );

            return true;

        } catch (e) {

            return false;

        }

    }

    /* ---------------------------------------------------------
       Hide already rendered Wall audio
       --------------------------------------------------------- */

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

                var audio =
                    audios[i];

                var root =
                    audio.closest(
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

    /* ---------------------------------------------------------
       Observe Wall
       --------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       Recover latest persisted song
       --------------------------------------------------------- */

    function recoverLatestSong() {

        try {

            if (
                songExcluded()
            ) {
                return false;
            }

            var list =
                document.querySelectorAll(
                    '.thBcType-wall'
                );

            if (!list.length) {
                return false;
            }

            /*
             * نبدأ من آخر Wall item.
             */

            for (
                var i = list.length - 1;
                i >= 0;
                i--
            ) {

                var root =
                    list[i];

                var audio =
                    root.querySelector(
                        'audio'
                    );

                if (!audio) {
                    continue;
                }

                var src =
                    normalizeUrl(
                        audio.currentSrc ||
                        audio.src ||
                        (
                            audio.querySelector(
                                'source'
                            ) || {}
                        ).src ||
                        ''
                    );

                if (!src) {
                    continue;
                }

                var name =
                    extractFileName(
                        src
                    );

                loadPlayer(
                    src,
                    name
                );

                state.currentUrl =
                    src;

                state.currentName =
                    name;

                console.log(
                    '♻️ TH SONG LATEST SONG RECOVERED:',
                    src
                );

                return true;

            }

        } catch (e) {}

        return false;

    }

    /* ---------------------------------------------------------
       Initial state
       --------------------------------------------------------- */

    function syncInitialState() {

        try {

            var s =
                getState();

            var url =
                getPlayerUrl();

            if (url) {

                state.currentUrl =
                    url;

                state.currentName =
                    getPlayerName();

                return;

            }

            if (
                s &&
                s.audioUrl
            ) {

                state.currentUrl =
                    normalizeUrl(
                        s.audioUrl
                    );

                state.currentName =
                    String(
                        s.audioName || ''
                    );

            }

        } catch (e) {}

    }

    /* ---------------------------------------------------------
       Upload watcher
       --------------------------------------------------------- */

    function startUploadWatcher() {

        if (
            state.uploadTimer
        ) {
            return;
        }

        state.uploadTimer =
            setInterval(
                function () {

                    bindPlayer();

                    watchUpload();

                },
                500
            );

    }

    /* ---------------------------------------------------------
       Installer
       --------------------------------------------------------- */

    function install() {

        try {

            bindPlayer();

            hookAddMsg();

            hookSocket();

            observeWall();

            hideExistingSongWalls();

            syncInitialState();

            recoverLatestSong();

            startUploadWatcher();

            console.log(
                '════════════════════════════════'
            );

            console.log(
                '🎵 TH SONG PLAYER SYNC READY'
            );

            console.log(
                '🎵 TARGET: CUSTOM PLAYER'
            );

            console.log(
                '💾 STORAGE: WALL'
            );

            console.log(
                '🛡️ WALL AUDIO: HIDDEN'
            );

            console.log(
                '🛡️ SYNC MESSAGE: BLOCKED FROM CHAT'
            );

            console.log(
                '════════════════════════════════'
            );

        } catch (e) {

            console.error(
                'TH SONG INSTALL ERROR:',
                e
            );

        }

    }

    /* ---------------------------------------------------------
       Public API
       --------------------------------------------------------- */

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
                        getAudio()
                            ? true
                            : false
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

                var audio =
                    getAudio();

                var url =
                    getPlayerUrl();

                var name =
                    getPlayerName();

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
                    name,
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

                    if (
                        state.audio
                    ) {

                        state.audio
                            .__TH_SONG_FINAL_BOUND__ =
                            false;

                    }

                    console.log(
                        '🗑️ TH SONG PLAYER SYNC DESTROYED'
                    );

                } catch (e) {}

            }

    };

    /* ---------------------------------------------------------
       Start
       --------------------------------------------------------- */

    install();

})();
