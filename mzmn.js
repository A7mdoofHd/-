(function () {
    'use strict';

    /* =========================================================
       TH SONG — PLAYER ONLY SYNC
       WALL = STORAGE ONLY
       PLAYER = VISIBLE DESTINATION
       ========================================================= */

    if (window.TH_SONG_PLAYER_SYNC) {
        console.log('⚠️ TH SONG PLAYER SYNC موجود مسبقًا');
        return;
    }

    window.TH_SONG_PLAYER_SYNC = true;

    var PREFIX = '__TH_SONG_PLAYER_SYNC__';
    var EXCLUDED_ROOM = 'y24qvky05f';

    var state = {
        currentUrl: '',
        currentName: '',
        previousUrl: '',

        pendingUpload: '',
        pendingName: '',

        applyingRemote: false,

        audio: null,

        wallHooked: false,
        socketHooked: false,

        started: false,
        destroyed: false
    };

    /* =========================================================
       ROOM
       ========================================================= */

    function getRoomId() {
        try {
            if (window.CURRENT_ROOM) {
                return String(window.CURRENT_ROOM);
            }

            if (window.room_id) {
                return String(window.room_id);
            }

            if (window.roomid) {
                return String(window.roomid);
            }

            if (window.room) {
                return String(window.room);
            }

            var el = document.querySelector(
                '.room.th-room-item.sel,' +
                '.room.th-room-item.active'
            );

            if (el) {
                var onclick =
                    el.getAttribute('onclick') || '';

                var m = onclick.match(
                    /Send_Rjoin\s*\(\s*['"]([^'"]+)['"]/i
                );

                if (m) {
                    return String(m[1]);
                }
            }
        } catch (e) {}

        return '';
    }

    function excluded() {
        return getRoomId() === EXCLUDED_ROOM;
    }

    /* =========================================================
       CUSTOM PLAYER
       ========================================================= */

    function getSongState() {
        try {
            return window.__TH_SONG_JQ_STATE__ || null;
        } catch (e) {
            return null;
        }
    }

    function getPlayerAudio() {
        var s = getSongState();

        if (!s) {
            return null;
        }

        try {
            if (
                s.audio &&
                typeof s.audio.play === 'function'
            ) {
                return s.audio;
            }
        } catch (e) {}

        return null;
    }

    function getPlayerUrl() {
        var s = getSongState();

        if (!s) {
            return '';
        }

        try {
            return String(s.audioUrl || '');
        } catch (e) {
            return '';
        }
    }

    function getPlayerName() {
        var s = getSongState();

        if (!s) {
            return '';
        }

        try {
            return String(s.audioName || '');
        } catch (e) {
            return '';
        }
    }

    /* =========================================================
       URL
       ========================================================= */

    function normalizeUrl(url) {
        url = String(url || '').trim();

        if (!url) {
            return '';
        }

        try {
            if (/^https?:\/\//i.test(url)) {
                return url;
            }

            if (url.indexOf('//') === 0) {
                return location.protocol + url;
            }

            if (url.charAt(0) !== '/') {
                url = '/' + url;
            }

            return location.origin + url;
        } catch (e) {
            return url;
        }
    }

    function cleanUrl(url) {
        try {
            var u = new URL(
                normalizeUrl(url),
                location.origin
            );

            return (
                u.pathname +
                (u.search || '')
            );
        } catch (e) {
            return String(url || '')
                .replace(location.origin, '');
        }
    }

    function sameUrl(a, b) {
        return (
            cleanUrl(a).toLowerCase() ===
            cleanUrl(b).toLowerCase()
        );
    }

    /* =========================================================
       PLAYER LOAD
       ========================================================= */

    function loadPlayer(url, name) {
        var s = getSongState();
        var audio = getPlayerAudio();

        if (!s || !audio || !url) {
            return false;
        }

        url = normalizeUrl(url);

        try {
            state.applyingRemote = true;

            /*
             * نفس المشغل الموجود عندك.
             * لا ننشئ Audio جديد.
             */

            audio.src = url;
            audio.load();

            s.audioUrl = url;

            if (name) {
                s.audioName = name;
            }

            state.currentUrl = url;

            if (name) {
                state.currentName = name;
            }

            try {
                var nameEl =
                    document.getElementById(
                        'TH_SONG_NAME'
                    );

                if (nameEl && name) {
                    nameEl.textContent = name;
                }
            } catch (e) {}

            setTimeout(function () {
                state.applyingRemote = false;
            }, 300);

            return true;

        } catch (e) {
            state.applyingRemote = false;
            return false;
        }
    }

    /* =========================================================
       WALL DATA
       ========================================================= */

    function getWallAudioData(element) {
        if (!element) {
            return null;
        }

        try {
            var audio =
                element.querySelector('audio');

            if (!audio) {
                return null;
            }

            var src =
                audio.currentSrc ||
                audio.src ||
                '';

            if (!src) {
                var source =
                    audio.querySelector('source');

                if (source) {
                    src =
                        source.src ||
                        source.getAttribute('src') ||
                        '';
                }
            }

            if (!src) {
                return null;
            }

            var name = '';

            try {
                name =
                    audio.getAttribute('title') ||
                    '';

                if (!name) {
                    var source2 =
                        audio.querySelector('source');

                    if (source2) {
                        name =
                            source2.getAttribute(
                                'title'
                            ) || '';
                    }
                }
            } catch (e) {}

            if (!name) {
                try {
                    var file =
                        src.split('/').pop();

                    name =
                        decodeURIComponent(
                            file || ''
                        );
                } catch (e) {}
            }

            return {
                element: element,
                audio: audio,
                url: normalizeUrl(src),
                name: name
            };

        } catch (e) {
            return null;
        }
    }

    /* =========================================================
       WALL → PLAYER
       ========================================================= */

    function processWallObject(obj) {
        if (
            !obj ||
            typeof obj !== 'object'
        ) {
            return false;
        }

        /*
         * لا نهتم إلا بالـWall.
         */

        if (
            String(obj.type || '') !== 'wall'
        ) {
            return false;
        }

        var html =
            String(obj.msg || '');

        var link =
            String(obj.link || '');

        var url = '';

        /*
         * أولاً link الحقيقي.
         */

        if (
            link &&
            /\/sendfile\//i.test(link)
        ) {
            url = normalizeUrl(link);
        }

        /*
         * إذا الرابط غير موجود في link
         * نقرأه من msg.
         */

        if (!url && html) {
            var match =
                html.match(
                    /(?:href|src)=["']([^"']*\/sendfile\/[^"']+)["']/i
                );

            if (match) {
                url = normalizeUrl(
                    match[1]
                );
            }
        }

        /*
         * وأيضًا الرابط النصي.
         */

        if (!url && html) {
            var match2 =
                html.match(
                    /\/sendfile\/[^\s"'<>]+/i
                );

            if (match2) {
                url = normalizeUrl(
                    match2[0]
                );
            }
        }

        if (!url) {
            return false;
        }

        /*
         * هذا Wall Audio.
         *
         * نخزنه داخليًا ونمنع عرضه.
         */

        var name =
            String(
                obj.audioName ||
                obj.name ||
                ''
            );

        state.currentUrl = url;

        if (name) {
            state.currentName = name;
        }

        /*
         * إذا المشغل ليس على نفس الأغنية،
         * نحملها فيه.
         */

        if (
            !sameUrl(
                getPlayerUrl(),
                url
            )
        ) {
            loadPlayer(
                url,
                name
            );
        }

        return true;
    }

    /* =========================================================
       HIDE WALL SONG
       ========================================================= */

    function hideWallSongElement(element) {
        if (!element) {
            return;
        }

        try {
            /*
             * نضع علامة حتى لا نعيد معالجته.
             */

            element.setAttribute(
                'data-th-song-hidden',
                '1'
            );

            /*
             * إخفاء فوري.
             */

            element.style.display =
                'none !important';

            element.style.setProperty(
                'display',
                'none',
                'important'
            );

        } catch (e) {}
    }

    function hideExistingSongWalls() {
        try {
            var items =
                document.querySelectorAll(
                    '#d2bc .thBcType-wall'
                );

            for (var i = 0; i < items.length; i++) {
                var data =
                    getWallAudioData(
                        items[i]
                    );

                if (!data) {
                    continue;
                }

                /*
                 * أي Wall Audio يتم التعامل معه
                 * كمصدر تخزين للمشغل.
                 */

                state.currentUrl =
                    data.url;

                if (data.name) {
                    state.currentName =
                        data.name;
                }

                if (
                    !sameUrl(
                        getPlayerUrl(),
                        data.url
                    )
                ) {
                    loadPlayer(
                        data.url,
                        data.name
                    );
                }

                hideWallSongElement(
                    items[i]
                );
            }
        } catch (e) {}
    }

    /* =========================================================
       ADDMSG HOOK
       ========================================================= */

    function hookAddMsg() {
        try {
            var old =
                window.ADDMSG_TIGERHOST;

            if (
                typeof old !== 'function'
            ) {
                return false;
            }

            if (
                old.__TH_SONG_PLAYER_HOOK__
            ) {
                return true;
            }

            function wrapped() {

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

                        /*
                         * إذا كانت الرسالة Wall Audio:
                         *
                         * 1. خذ الرابط
                         * 2. حطه في المشغل
                         * 3. امنع Wall من عرضه
                         */

                        if (
                            processWallObject(
                                obj
                            )
                        ) {

                            /*
                             * لا نستدعي
                             * ADDMSG الأصلي.
                             *
                             * وهنا بالضبط الجدار
                             * "يمنع الوصول".
                             */

                            return;
                        }
                    }

                } catch (e) {}

                return old.apply(
                    this,
                    arguments
                );
            }

            wrapped.__TH_SONG_PLAYER_HOOK__ =
                true;

            wrapped.__TH_SONG_PLAYER_ORIGINAL__ =
                old;

            window.ADDMSG_TIGERHOST =
                wrapped;

            state.wallHooked = true;

            console.log(
                '🛡️ TH SONG WALL FILTER ON'
            );

            return true;

        } catch (e) {
            return false;
        }
    }

    /* =========================================================
       PERSIST NEW SONG
       ========================================================= */

    function persistToWall(url) {
        if (
            !url ||
            excluded()
        ) {
            return false;
        }

        return send(
            'SEND_BC_TIGERHOST_EVENT',
            {
                msg: '',
                link: cleanUrl(url),
                type: 'wall'
            }
        );
    }

    /* =========================================================
       SERVER SEND
       ========================================================= */

    function send(cmd, data) {
        try {
            if (
                typeof window.SEND_EVENT_TIGERHOST !==
                'function'
            ) {
                return false;
            }

            window.SEND_EVENT_TIGERHOST(
                cmd,
                data
            );

            return true;
        } catch (e) {
            return false;
        }
    }

    /* =========================================================
       PLAYER SYNC MESSAGE
       ========================================================= */

    function sendSongSync(
        action,
        url,
        name,
        time
    ) {
        if (
            excluded() ||
            !url
        ) {
            return false;
        }

        var msg =
            PREFIX +
            '|' +
            action +
            '|' +
            encodeURIComponent(
                cleanUrl(url)
            ) +
            '|' +
            encodeURIComponent(
                String(name || '')
            ) +
            '|' +
            Number(
                time || 0
            ).toFixed(3);

        return send(
            'SEND_PMSG_TIGERHOST_EVENT',
            {
                msg: msg,
                state: 'all'
            }
        );
    }

    /* =========================================================
       RECEIVE PLAYER SYNC
       ========================================================= */

    function processSync(msg) {
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

            var p =
                msg.split('|');

            if (p.length < 3) {
                return true;
            }

            var action =
                String(p[1] || '');

            var url =
                decodeURIComponent(
                    String(p[2] || '')
                );

            var name = '';

            if (p[3]) {
                try {
                    name =
                        decodeURIComponent(
                            p[3]
                        );
                } catch (e) {}
            }

            var time =
                p[4]
                    ? Number(p[4])
                    : 0;

            if (!url) {
                return true;
            }

            applyRemote(
                action,
                normalizeUrl(url),
                name,
                Number.isFinite(time)
                    ? time
                    : 0
            );

            return true;

        } catch (e) {
            return true;
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
        var audio =
            getPlayerAudio();

        if (!audio) {
            return;
        }

        state.applyingRemote =
            true;

        try {

            /*
             * لو الأغنية مختلفة:
             * نحملها في المشغل فقط.
             */

            if (
                !sameUrl(
                    getPlayerUrl(),
                    url
                )
            ) {
                loadPlayer(
                    url,
                    name
                );
            }

            state.currentUrl =
                url;

            state.currentName =
                name || state.currentName;

            setTimeout(
                function () {

                    try {

                        /*
                         * ضبط الوقت.
                         */

                        if (
                            Number.isFinite(time) &&
                            Math.abs(
                                Number(
                                    audio.currentTime
                                ) -
                                time
                            ) > 0.2
                        ) {
                            audio.currentTime =
                                time;
                        }

                        /*
                         * تشغيل أو إيقاف.
                         */

                        if (
                            action === 'play' ||
                            action === 'seek-play'
                        ) {

                            var promise =
                                audio.play();

                            if (
                                promise &&
                                typeof promise.catch ===
                                'function'
                            ) {
                                promise.catch(
                                    function () {
                                        console.log(
                                            '⚠️ المتصفح منع التشغيل التلقائي'
                                        );
                                    }
                                );
                            }

                        } else if (
                            action === 'pause' ||
                            action === 'seek-pause'
                        ) {

                            audio.pause();
                        }

                    } catch (e) {}

                    setTimeout(
                        function () {
                            state.applyingRemote =
                                false;
                        },
                        250
                    );

                },
                150
            );

        } catch (e) {
            state.applyingRemote =
                false;
        }
    }

    /* =========================================================
       SOCKET INTERCEPTION
       ========================================================= */

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
                socket.__TH_SONG_PLAYER_SOCKET__
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

                        if (
                            Array.isArray(data) &&
                            data.length >= 2
                        ) {

                            var event =
                                data[0];

                            var payload =
                                data[1];

                            if (
                                event ===
                                'SEND_EVENT_EMIT_SERVER'
                            ) {

                                var cmd =
                                    payload &&
                                    payload.cmd;

                                var body =
                                    payload &&
                                    payload.data;

                                if (
                                    cmd ===
                                    'SEND_PMSG_TIGERHOST_EVENT'
                                ) {

                                    var msg =
                                        body &&
                                        body.msg;

                                    /*
                                     * هذه رسالتنا.
                                     *
                                     * نعالجها ونوقفها هنا
                                     * قبل أن تصل للنظام
                                     * الأصلي.
                                     */

                                    if (
                                        processSync(
                                            msg
                                        )
                                    ) {
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

            socket.__TH_SONG_PLAYER_SOCKET__ =
                true;

            state.socketHooked =
                true;

            console.log(
                '📡 TH SONG PLAYER SOCKET SYNC ON'
            );

            return true;

        } catch (e) {
            return false;
        }
    }

    /* =========================================================
       CUSTOM PLAYER EVENTS
       ========================================================= */

    function bindPlayer() {
        var audio =
            getPlayerAudio();

        if (!audio) {
            return false;
        }

        if (
            audio.__TH_SONG_PLAYER_SYNC_BOUND__
        ) {
            return true;
        }

        audio.__TH_SONG_PLAYER_SYNC_BOUND__ =
            true;

        state.audio =
            audio;

        /*
         * PLAY
         */

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

                if (!url) {
                    return;
                }

                state.currentUrl =
                    url;

                sendSongSync(
                    'play',
                    url,
                    getPlayerName(),
                    audio.currentTime
                );
            }
        );

        /*
         * PAUSE
         */

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

                if (!url) {
                    return;
                }

                sendSongSync(
                    'pause',
                    url,
                    getPlayerName(),
                    audio.currentTime
                );
            }
        );

        /*
         * SEEK
         */

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

                if (!url) {
                    return;
                }

                sendSongSync(
                    audio.paused
                        ? 'seek-pause'
                        : 'seek-play',
                    url,
                    getPlayerName(),
                    audio.currentTime
                );
            }
        );

        console.log(
            '🎵 TH SONG PLAYER CONNECTED'
        );

        return true;
    }

    /* =========================================================
       DETECT NEW UPLOAD FROM YOUR EXISTING PLAYER
       ========================================================= */

    function watchUpload() {

        var lastUrl =
            getPlayerUrl() || '';

        /*
         * الأغنية الموجودة عند بداية السكربت
         * ليست Upload جديد.
         */

        state.currentUrl =
            lastUrl;

        setInterval(
            function () {

                if (
                    state.destroyed ||
                    excluded()
                ) {
                    return;
                }

                bindPlayer();

                var url =
                    getPlayerUrl();

                if (!url) {
                    return;
                }

                /*
                 * تغير audioUrl = رفع أغنية جديدة
                 * من زر المشغل الموجود عندك.
                 */

                if (
                    url !== lastUrl
                ) {

                    var oldUrl =
                        lastUrl;

                    lastUrl =
                        url;

                    state.previousUrl =
                        oldUrl;

                    state.currentUrl =
                        url;

                    state.pendingUpload =
                        url;

                    state.pendingName =
                        getPlayerName();

                    console.log(
                        '🎵 NEW SONG:',
                        url
                    );

                    /*
                     * نخزنها في الـWall.
                     *
                     * لكنها لن تظهر فيه لأن
                     * ADDMSG hook يمنع عرضها.
                     */

                    persistToWall(
                        url
                    );

                    /*
                     * نرسلها مباشرة للمشغلين
                     * الآخرين.
                     */

                    sendSongSync(
                        'switch',
                        url,
                        getPlayerName(),
                        0
                    );
                }

            },
            300
        );
    }

    /* =========================================================
       INITIAL WALL RECOVERY
       ========================================================= */

    function recoverLatestSong() {

        try {

            var items =
                document.querySelectorAll(
                    '#d2bc .thBcType-wall'
                );

            var latest = null;

            /*
             * نبحث من الأحدث إلى الأقدم.
             */

            for (
                var i =
                    items.length - 1;
                i >= 0;
                i--
            ) {

                var data =
                    getWallAudioData(
                        items[i]
                    );

                if (!data) {
                    continue;
                }

                latest =
                    data;

                break;
            }

            if (!latest) {
                return false;
            }

            /*
             * الأغنية المحفوظة تصبح الحالية
             * في المشغل.
             */

            state.currentUrl =
                latest.url;

            state.currentName =
                latest.name || '';

            loadPlayer(
                latest.url,
                latest.name
            );

            hideWallSongElement(
                latest.element
            );

            console.log(
                '♻️ TH SONG RESTORED:',
                latest.url
            );

            return true;

        } catch (e) {
            return false;
        }
    }

    /* =========================================================
       MUTATION OBSERVER
       ========================================================= */

    function observeWall() {

        try {

            var root =
                document.querySelector(
                    '#d2bc'
                ) ||
                document.body;

            var observer =
                new MutationObserver(
                    function () {

                        if (
                            state.destroyed ||
                            excluded()
                        ) {
                            return;
                        }

                        /*
                         * أي Wall Audio جديد:
                         *
                         * نخفيه فورًا
                         * ونحمله في المشغل.
                         */

                        hideExistingSongWalls();

                        bindPlayer();

                    }
                );

            observer.observe(
                root,
                {
                    childList: true,
                    subtree: true
                }
            );

            state.observer =
                observer;

        } catch (e) {}
    }

    /* =========================================================
       START
       ========================================================= */

    function start() {

        if (excluded()) {
            console.log(
                '🚫 TH SONG PLAYER SYNC مستثنى في هذا الروم'
            );
            return;
        }

        setTimeout(
            function () {

                if (state.destroyed) {
                    return;
                }

                /*
                 * أول شيء:
                 * اربط المشغل.
                 */

                bindPlayer();

                /*
                 * استرجاع الأغنية القديمة
                 * من التخزين الخلفي.
                 */

                recoverLatestSong();

                /*
                 * أخفِ Wall Audio.
                 */

                hideExistingSongWalls();

                /*
                 * اعتراض ADDMSG قبل وصول
                 * أغنية الجدار للواجهة.
                 */

                hookAddMsg();

                /*
                 * Socket للمزامنة.
                 */

                hookSocket();

                /*
                 * مراقبة زر الرفع الحالي.
                 */

                watchUpload();

                /*
                 * مراقبة الجدار كـStorage فقط.
                 */

                observeWall();

                state.started =
                    true;

                console.log(
                    '════════════════════════════════════'
                );

                console.log(
                    '🎵 TH SONG PLAYER SYNC READY'
                );

                console.log(
                    '🎵 PLAYER: ON'
                );

                console.log(
                    '📡 SYNC: ON'
                );

                console.log(
                    '💾 WALL STORAGE: ON'
                );

                console.log(
                    '🚫 WALL DISPLAY: BLOCKED'
                );

                console.log(
                    '🔄 PLAY / PAUSE / SEEK: ON'
                );

                console.log(
                    '════════════════════════════════════'
                );

            },
            1200
        );
    }

    /* =========================================================
       PUBLIC CONTROL
       ========================================================= */

    window.TH_SONG_PLAYER_SYNC_API = {

        getState: function () {
            return {
                url:
                    state.currentUrl,

                name:
                    state.currentName,

                pending:
                    state.pendingUpload,

                player:
                    !!getPlayerAudio(),

                started:
                    state.started,

                room:
                    getRoomId()
            };
        },

        rescan: function () {
            hideExistingSongWalls();
            recoverLatestSong();
            bindPlayer();
        },

        destroy: function () {

            state.destroyed =
                true;

            try {
                if (state.observer) {
                    state.observer.disconnect();
                }
            } catch (e) {}

            console.log(
                '🛑 TH SONG PLAYER SYNC STOPPED'
            );
        }
    };

    start();

})();
