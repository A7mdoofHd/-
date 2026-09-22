(function () {
    'use strict';

    /* =========================================================
       TH SONG — DYNAMIC PERSISTENT SYNC
       مستقل عن زر ومشغل الأغاني
       ========================================================= */

    if (window.TH_SONG_PERSISTENT_SYNC) {
        console.log('⚠️ TH SONG SYNC موجود مسبقًا');
        return;
    }

    window.TH_SONG_PERSISTENT_SYNC = true;

    var PREFIX = '__TH_SONG_SYNC__';
    var EXCLUDED_ROOM = 'y24qvky05f';

    var state = {
        currentBid: '',
        currentSrc: '',
        currentWall: null,

        lastObservedUpload: '',
        pendingUploadUrl: '',

        previousBidBeforeUpload: '',

        applyingRemote: false,
        bindingAudio: false,

        customAudio: null,

        socket: null,
        socketHooked: false,

        destroyed: false
    };

    /* =========================================================
       ROOM
       ========================================================= */

    function getRoomId() {
        try {
            if (typeof window.CURRENT_ROOM !== 'undefined' &&
                window.CURRENT_ROOM) {
                return String(window.CURRENT_ROOM);
            }

            if (typeof window.room_id !== 'undefined' &&
                window.room_id) {
                return String(window.room_id);
            }

            if (typeof window.roomid !== 'undefined' &&
                window.roomid) {
                return String(window.roomid);
            }

            if (typeof window.room !== 'undefined' &&
                window.room) {
                return String(window.room);
            }

            var el =
                document.querySelector(
                    '.room.th-room-item.sel,' +
                    '.room.th-room-item.active,' +
                    '.room.th-room-item'
                );

            if (el) {
                var onclick =
                    el.getAttribute('onclick') || '';

                var m =
                    onclick.match(
                        /Send_Rjoin\s*\(\s*['"]([^'"]+)['"]/i
                    );

                if (m) {
                    return String(m[1]);
                }
            }
        } catch (e) {}

        return '';
    }

    function isExcludedRoom() {
        return getRoomId() === EXCLUDED_ROOM;
    }

    /* =========================================================
       CUSTOM SONG PLAYER
       ========================================================= */

    function getSongState() {
        try {
            return window.__TH_SONG_JQ_STATE__ || null;
        } catch (e) {
            return null;
        }
    }

    function getCustomAudio() {
        var s = getSongState();

        if (!s) return null;

        try {
            if (s.audio &&
                typeof s.audio.play === 'function') {
                return s.audio;
            }
        } catch (e) {}

        return null;
    }

    function getCustomSongUrl() {
        var s = getSongState();

        if (!s) return '';

        try {
            return String(s.audioUrl || '');
        } catch (e) {
            return '';
        }
    }

    function getCustomSongName() {
        var s = getSongState();

        if (!s) return '';

        try {
            return String(s.audioName || '');
        } catch (e) {
            return '';
        }
    }

    /* =========================================================
       URL NORMALIZATION
       ========================================================= */

    function normalizeUrl(url) {
        try {
            url = String(url || '').trim();

            if (!url) return '';

            if (/^\/\//.test(url)) {
                return location.protocol + url;
            }

            if (/^https?:\/\//i.test(url)) {
                return url;
            }

            if (url.charAt(0) !== '/') {
                url = '/' + url;
            }

            return location.origin + url;
        } catch (e) {
            return String(url || '');
        }
    }

    function urlPath(url) {
        try {
            var full = normalizeUrl(url);
            var u = new URL(full, location.origin);

            return (
                u.pathname +
                (u.search || '')
            ).toLowerCase();
        } catch (e) {
            return String(url || '')
                .replace(location.origin, '')
                .toLowerCase();
        }
    }

    function sameAudioUrl(a, b) {
        var x = urlPath(a);
        var y = urlPath(b);

        if (!x || !y) return false;

        return x === y;
    }

    /* =========================================================
       WALL
       ========================================================= */

    function getWallItems() {
        try {
            return Array.prototype.slice.call(
                document.querySelectorAll(
                    '#d2bc .thBcType-wall'
                )
            );
        } catch (e) {
            return [];
        }
    }

    function getBidFromWall(el) {
        if (!el) return '';

        try {
            var dataBid =
                el.getAttribute('data-bid') || '';

            if (dataBid) {
                return String(dataBid);
            }

            var classes =
                Array.prototype.slice.call(
                    el.classList || []
                );

            for (var i = 0; i < classes.length; i++) {
                var c = String(classes[i] || '');

                if (
                    c.indexOf('bid') === 0 &&
                    c.length > 3
                ) {
                    return c.slice(3);
                }
            }
        } catch (e) {}

        return '';
    }

    function getWallAudio(el) {
        if (!el) return null;

        try {
            return el.querySelector('audio');
        } catch (e) {
            return null;
        }
    }

    function getWallAudioSrc(audio) {
        if (!audio) return '';

        try {
            var src =
                audio.currentSrc ||
                audio.src ||
                '';

            if (src) {
                return String(src);
            }

            var source =
                audio.querySelector('source');

            if (source) {
                return String(
                    source.src ||
                    source.getAttribute('src') ||
                    ''
                );
            }
        } catch (e) {}

        return '';
    }

    /*
       يرجع كل أغاني الـWall مع BID والرابط
    */
    function getWallSongs() {
        var result = [];
        var items = getWallItems();

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var audio = getWallAudio(item);

            if (!audio) continue;

            var bid = getBidFromWall(item);
            var src = getWallAudioSrc(audio);

            if (!bid || !src) continue;

            result.push({
                element: item,
                audio: audio,
                bid: bid,
                src: src,
                index: i
            });
        }

        return result;
    }

    /*
       العثور على أغنية Wall بواسطة الرابط
    */
    function findWallSongByUrl(url) {
        if (!url) return null;

        var songs = getWallSongs();

        for (var i = 0; i < songs.length; i++) {
            if (sameAudioUrl(songs[i].src, url)) {
                return songs[i];
            }
        }

        return null;
    }

    /*
       أحدث أغنية صوتية في الـWall
       نعتمد ترتيب DOM لأن BC_TIGERHOST_LIST
       يعرض الأحدث ضمن القائمة الحالية.
    */
    function getLatestWallSong() {
        var songs = getWallSongs();

        if (!songs.length) {
            return null;
        }

        return songs[songs.length - 1];
    }

    /* =========================================================
       SEND EVENT
       ========================================================= */

    function sendServer(cmd, data) {
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
            console.error(
                'TH SONG SEND ERROR:',
                e
            );

            return false;
        }
    }

    /* =========================================================
       WALL PERSISTENCE
       ========================================================= */

    function persistSongToWall(url) {
        if (!url || isExcludedRoom()) {
            return false;
        }

        var cleanUrl = url;

        try {
            var u =
                new URL(
                    normalizeUrl(url),
                    location.origin
                );

            cleanUrl =
                u.pathname +
                (u.search || '');
        } catch (e) {
            cleanUrl =
                String(url)
                    .replace(location.origin, '');
        }

        console.log(
            '💾 TH SONG → WALL:',
            cleanUrl
        );

        return sendServer(
            'SEND_BC_TIGERHOST_EVENT',
            {
                msg: '',
                link: cleanUrl,
                type: 'wall'
            }
        );
    }

    /* =========================================================
       DELETE WALL SONG
       ========================================================= */

    function deleteWallBid(bid) {
        bid = String(bid || '');

        if (!bid || isExcludedRoom()) {
            return false;
        }

        console.log(
            '🗑️ TH SONG DELETE OLD BID:',
            bid
        );

        return sendServer(
            'SEND_EVENT_EMIT_DEL_BC',
            {
                bid: bid
            }
        );
    }

    /* =========================================================
       SYNC MESSAGE
       ========================================================= */

    function sendSync(action, bid, time) {
        if (isExcludedRoom()) {
            return false;
        }

        bid = String(bid || '');
        action = String(action || '');

        if (!bid || !action) {
            return false;
        }

        var msg;

        if (
            action === 'switch'
        ) {
            msg =
                PREFIX +
                '|switch|' +
                bid;
        } else {
            msg =
                PREFIX +
                '|' +
                action +
                '|' +
                bid +
                '|' +
                Number(time || 0).toFixed(3);
        }

        return sendServer(
            'SEND_PMSG_TIGERHOST_EVENT',
            {
                msg: msg,
                state: 'all'
            }
        );
    }

    /* =========================================================
       FIND / LOAD CUSTOM SONG
       ========================================================= */

    function setStatus(text) {
        try {
            if (
                typeof window.TH_SONG_SET_STATUS ===
                'function'
            ) {
                window.TH_SONG_SET_STATUS(text);
                return;
            }

            var el =
                document.querySelector(
                    '#TH_SONG_STATUS'
                );

            if (el) {
                el.textContent = text;
            }
        } catch (e) {}
    }

    function loadIntoCustomPlayer(url, name) {
        var s = getSongState();

        if (!s) {
            return false;
        }

        url = normalizeUrl(url);

        if (!url) {
            return false;
        }

        try {
            /*
               نستخدم دالة loadSong الموجودة أصلًا
               إذا كانت ظاهرة على window.
            */

            if (
                typeof window.TH_SONG_LOAD ===
                'function'
            ) {
                window.TH_SONG_LOAD(
                    url,
                    name || ''
                );

                return true;
            }
        } catch (e) {}

        /*
           لأن loadSong في ملفك الحالي دالة داخلية
           وليست window، نربط مباشرة مع Audio الموجود.
        */

        try {
            var audio =
                getCustomAudio();

            if (!audio) {
                return false;
            }

            state.applyingRemote = true;

            audio.src = url;
            audio.load();

            try {
                s.audioUrl = url;

                if (name) {
                    s.audioName = name;
                }
            } catch (e) {}

            try {
                var nameEl =
                    document.querySelector(
                        '#TH_SONG_NAME'
                    );

                if (nameEl && name) {
                    nameEl.textContent = name;
                }
            } catch (e) {}

            setStatus(
                name
                    ? name
                    : 'تم تحميل الأغنية'
            );

            setTimeout(
                function () {
                    state.applyingRemote = false;
                },
                250
            );

            return true;
        } catch (e) {
            state.applyingRemote = false;
            return false;
        }
    }

    /* =========================================================
       CURRENT WALL SONG
       ========================================================= */

    function setCurrentWallSong(song, options) {
        options =
            options || {};

        if (!song || !song.bid) {
            return false;
        }

        var oldBid =
            state.currentBid;

        state.currentBid =
            String(song.bid);

        state.currentSrc =
            String(song.src || '');

        state.currentWall =
            song;

        /*
           نحمل الأغنية في مشغل المستخدم
        */

        var currentCustom =
            getCustomSongUrl();

        if (
            !currentCustom ||
            !sameAudioUrl(
                currentCustom,
                song.src
            )
        ) {
            loadIntoCustomPlayer(
                song.src,
                extractSongName(song)
            );
        }

        if (
            options.sendSwitch &&
            oldBid !== state.currentBid
        ) {
            sendSync(
                'switch',
                state.currentBid
            );
        }

        return true;
    }

    function extractSongName(song) {
        try {
            if (
                song &&
                song.element
            ) {
                var audio =
                    song.element.querySelector(
                        'audio'
                    );

                var source =
                    audio &&
                    audio.querySelector(
                        'source'
                    );

                var src =
                    getWallAudioSrc(audio);

                if (source) {
                    var label =
                        source.getAttribute(
                            'title'
                        );

                    if (label) {
                        return label;
                    }
                }

                if (src) {
                    var path =
                        src.split('/').pop();

                    if (path) {
                        return decodeURIComponent(
                            path
                        );
                    }
                }
            }
        } catch (e) {}

        return 'Song';
    }

    /* =========================================================
       INITIAL CURRENT SONG
       ========================================================= */

    function scanCurrentWallSong() {
        if (isExcludedRoom()) {
            return false;
        }

        /*
           إذا لدينا BID حالي، تأكد أنه ما زال موجودًا.
        */

        if (state.currentBid) {
            var current =
                document.querySelector(
                    '#d2bc .thBcType-wall.bid' +
                    state.currentBid
                );

            if (current) {
                var audio =
                    getWallAudio(current);

                var src =
                    getWallAudioSrc(audio);

                if (src) {
                    state.currentWall = {
                        element: current,
                        audio: audio,
                        bid: state.currentBid,
                        src: src
                    };

                    return true;
                }
            }
        }

        var latest =
            getLatestWallSong();

        if (!latest) {
            return false;
        }

        /*
           عند الدخول لا نرسل switch.
           فقط نعرف الأغنية الحالية من الـWall.
        */

        setCurrentWallSong(
            latest,
            {
                sendSwitch: false
            }
        );

        console.log(
            '🎵 TH SONG INITIAL:',
            {
                bid: latest.bid,
                src: latest.src
            }
        );

        return true;
    }

    /* =========================================================
       UPLOAD DETECTION
       ========================================================= */

    function getPreviousSongBeforeUpload() {
        /*
           أهم نقطة:
           قبل ما نرسل الأغنية الجديدة إلى الـWall،
           نأخذ الأغنية الحالية الموجودة فعليًا.
        */

        var current =
            getLatestWallSong();

        if (
            current &&
            current.bid
        ) {
            return current.bid;
        }

        if (
            state.currentBid
        ) {
            return state.currentBid;
        }

        return '';
    }

    function handleCustomUpload(url) {
        if (!url || isExcludedRoom()) {
            return;
        }

        url = normalizeUrl(url);

        if (!url) {
            return;
        }

        if (
            state.lastObservedUpload === url
        ) {
            return;
        }

        state.lastObservedUpload =
            url;

        state.pendingUploadUrl =
            url;

        state.previousBidBeforeUpload =
            getPreviousSongBeforeUpload();

        console.log(
            '🎵 TH SONG NEW UPLOAD:',
            url
        );

        console.log(
            '🎵 OLD BID:',
            state.previousBidBeforeUpload
        );

        /*
           1 — نحول الرفع الموجود عندك
               إلى Wall حقيقي.
        */

        persistSongToWall(url);

        /*
           2 — ننتظر ظهور الـWall item
               ثم نأخذ الـBID الحقيقي.
        */

        waitForUploadedWall(
            url,
            function (song) {

                if (!song) {
                    return;
                }

                var oldBid =
                    state.previousBidBeforeUpload;

                /*
                   أصبح هذا هو الأغنية الحالية.
                */

                setCurrentWallSong(
                    song,
                    {
                        sendSwitch: false
                    }
                );

                /*
                   نحذف السابقة فقط إذا:
                   - موجودة
                   - مختلفة عن الجديدة
                */

                if (
                    oldBid &&
                    oldBid !== song.bid
                ) {
                    deleteWallBid(
                        oldBid
                    );
                }

                /*
                   أرسل switch للجميع.
                */

                sendSync(
                    'switch',
                    song.bid
                );

                state.pendingUploadUrl =
                    '';

                state.previousBidBeforeUpload =
                    '';

                console.log(
                    '✅ TH SONG READY:',
                    {
                        bid: song.bid,
                        src: song.src
                    }
                );
            }
        );
    }

    function waitForUploadedWall(url, callback) {
        var started =
            Date.now();

        var timeout =
            30000;

        var timer =
            setInterval(
                function () {

                    if (state.destroyed) {
                        clearInterval(timer);
                        return;
                    }

                    var song =
                        findWallSongByUrl(
                            url
                        );

                    if (song) {
                        clearInterval(timer);

                        callback(song);

                        return;
                    }

                    if (
                        Date.now() -
                        started >
                        timeout
                    ) {
                        clearInterval(timer);

                        console.warn(
                            '⚠️ TH SONG: لم يظهر Wall item خلال 30 ثانية'
                        );
                    }
                },
                250
            );
    }

    /* =========================================================
       CUSTOM PLAYER SYNC
       ========================================================= */

    function getBoundAudio() {
        var audio =
            getCustomAudio();

        if (!audio) {
            return null;
        }

        if (
            state.customAudio === audio
        ) {
            return audio;
        }

        state.customAudio =
            audio;

        bindCustomAudio(audio);

        return audio;
    }

    function ensureCurrentBidFromPlayer() {
        var url =
            getCustomSongUrl();

        if (!url) {
            return false;
        }

        if (
            state.currentBid &&
            state.currentSrc &&
            sameAudioUrl(
                state.currentSrc,
                url
            )
        ) {
            return true;
        }

        var wallSong =
            findWallSongByUrl(url);

        if (!wallSong) {
            return false;
        }

        state.currentBid =
            wallSong.bid;

        state.currentSrc =
            wallSong.src;

        state.currentWall =
            wallSong;

        return true;
    }

    function bindCustomAudio(audio) {
        if (!audio) {
            return;
        }

        if (
            audio.__TH_SONG_SYNC_BOUND__
        ) {
            return;
        }

        audio.__TH_SONG_SYNC_BOUND__ =
            true;

        audio.addEventListener(
            'play',
            function () {

                if (
                    state.applyingRemote
                ) {
                    return;
                }

                if (
                    !ensureCurrentBidFromPlayer()
                ) {
                    return;
                }

                sendSync(
                    'play',
                    state.currentBid,
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

                if (
                    !ensureCurrentBidFromPlayer()
                ) {
                    return;
                }

                sendSync(
                    'pause',
                    state.currentBid,
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

                if (
                    !ensureCurrentBidFromPlayer()
                ) {
                    return;
                }

                sendSync(
                    audio.paused
                        ? 'seek-pause'
                        : 'seek-play',
                    state.currentBid,
                    audio.currentTime
                );
            }
        );

        console.log(
            '🎵 TH SONG PLAYER CONNECTED'
        );
    }

    /* =========================================================
       REMOTE APPLY
       ========================================================= */

    function findWallSongByBid(bid) {
        bid =
            String(bid || '');

        if (!bid) {
            return null;
        }

        var el =
            document.querySelector(
                '#d2bc .thBcType-wall.bid' +
                bid
            );

        if (!el) {
            return null;
        }

        var audio =
            getWallAudio(el);

        var src =
            getWallAudioSrc(audio);

        if (!audio || !src) {
            return null;
        }

        return {
            element: el,
            audio: audio,
            bid: bid,
            src: src
        };
    }

    function waitForWallBid(
        bid,
        callback
    ) {
        var started =
            Date.now();

        var timeout =
            20000;

        var timer =
            setInterval(
                function () {

                    var song =
                        findWallSongByBid(
                            bid
                        );

                    if (song) {
                        clearInterval(timer);

                        callback(song);

                        return;
                    }

                    if (
                        Date.now() -
                        started >
                        timeout
                    ) {
                        clearInterval(timer);

                        console.warn(
                            '⚠️ TH SONG BID غير موجود في الـWall:',
                            bid
                        );
                    }
                },
                250
            );
    }

    function applyRemote(
        action,
        bid,
        time
    ) {
        if (isExcludedRoom()) {
            return;
        }

        bid =
            String(bid || '');

        var t =
            Number(time);

        if (!bid) {
            return;
        }

        if (!Number.isFinite(t)) {
            t = 0;
        }

        function execute(song) {

            if (!song) {
                return;
            }

            state.currentBid =
                song.bid;

            state.currentSrc =
                song.src;

            state.currentWall =
                song;

            var audio =
                getCustomAudio();

            if (!audio) {
                return;
            }

            state.applyingRemote =
                true;

            try {

                if (
                    !sameAudioUrl(
                        getCustomSongUrl(),
                        song.src
                    )
                ) {
                    loadIntoCustomPlayer(
                        song.src,
                        extractSongName(song)
                    );
                }

                /*
                   نعطي الـAudio وقتًا صغيرًا
                   لتغيير المصدر.
                */

                setTimeout(
                    function () {

                        try {

                            if (
                                Math.abs(
                                    Number(
                                        audio.currentTime
                                    ) - t
                                ) > 0.20
                            ) {
                                audio.currentTime =
                                    t;
                            }

                            if (
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
                                            setStatus(
                                                'اضغط تشغيل للسماح بتشغيل الأغنية'
                                            );
                                        }
                                    );
                                }

                            } else {

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
                    120
                );

            } catch (e) {
                state.applyingRemote =
                    false;
            }
        }

        var current =
            findWallSongByBid(bid);

        if (current) {
            execute(current);
            return;
        }

        /*
           إذا switch وصل قبل وصول عنصر الـWall
        */

        waitForWallBid(
            bid,
            execute
        );
    }

    /* =========================================================
       SYNC MESSAGE PARSER
       ========================================================= */

    function processSyncMessage(msg) {
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

            var parts =
                msg.split('|');

            if (
                parts.length < 3
            ) {
                return true;
            }

            var action =
                String(parts[1] || '');

            /*
               SWITCH
               __TH_SONG_SYNC__|switch|BID
            */

            if (
                action === 'switch'
            ) {

                var switchBid =
                    String(
                        parts[2] || ''
                    );

                if (!switchBid) {
                    return true;
                }

                waitForWallBid(
                    switchBid,
                    function (song) {

                        setCurrentWallSong(
                            song,
                            {
                                sendSwitch: false
                            }
                        );

                        console.log(
                            '📡 TH SONG SWITCH:',
                            switchBid
                        );
                    }
                );

                return true;
            }

            /*
               PLAY / PAUSE / SEEK
               __TH_SONG_SYNC__|play|BID|TIME
            */

            if (
                parts.length < 4
            ) {
                return true;
            }

            var bid =
                String(
                    parts[2] || ''
                );

            var time =
                Number(
                    parts[3]
                );

            if (
                !bid ||
                !Number.isFinite(time)
            ) {
                return true;
            }

            applyRemote(
                action,
                bid,
                time
            );

            return true;

        } catch (e) {
            return true;
        }
    }

    /* =========================================================
       SOCKET RAW INTERCEPTION
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
                socket.__TH_SONG_SYNC_HOOKED__
            ) {
                state.socket =
                    socket;

                state.socketHooked =
                    true;

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
                           Socket.IO event packet:
                           [eventName, payload]
                        */

                        if (
                            Array.isArray(data) &&
                            data.length >= 2
                        ) {

                            var eventName =
                                data[0];

                            var payload =
                                data[1];

                            /*
                               استقبال PMSG
                            */

                            if (
                                eventName ===
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

                                    if (
                                        processSyncMessage(
                                            msg
                                        )
                                    ) {

                                        /*
                                           نستهلك رسالة
                                           المزامنة هنا
                                           قبل النظام الأصلي
                                           حتى لا يحدث
                                           .find error
                                        */

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

            socket.__TH_SONG_SYNC_HOOKED__ =
                true;

            state.socket =
                socket;

            state.socketHooked =
                true;

            console.log(
                '📡 TH SONG SOCKET CONNECTED'
            );

            return true;

        } catch (e) {
            return false;
        }
    }

    /* =========================================================
       OUTGOING PMSG FALLBACK
       ========================================================= */

    /*
       هذا Hook إضافي فقط.
       لا نعتمد عليه للاستقبال.
       فائدته منع أي نسخة قديمة من النظام
       من العبث برسائل الأغنية.
    */

    function hookSendFunction() {
        try {

            var fn =
                window.SEND_EVENT_TIGERHOST;

            if (
                typeof fn !== 'function'
            ) {
                return false;
            }

            if (
                fn.__TH_SONG_SYNC_WRAPPED__
            ) {
                return true;
            }

            function wrapped(cmd, data) {

                try {

                    if (
                        cmd ===
                        'SEND_PMSG_TIGERHOST_EVENT' &&
                        data &&
                        typeof data.msg ===
                        'string' &&
                        data.msg.indexOf(
                            PREFIX + '|'
                        ) === 0
                    ) {
                        /*
                           لا نعدل الرسالة.
                           فقط نسمح بمرورها.
                        */
                    }

                } catch (e) {}

                return fn.apply(
                    this,
                    arguments
                );
            }

            wrapped.__TH_SONG_SYNC_WRAPPED__ =
                true;

            wrapped.__TH_SONG_SYNC_ORIGINAL__ =
                fn;

            window.SEND_EVENT_TIGERHOST =
                wrapped;

            return true;

        } catch (e) {
            return false;
        }
    }

    /* =========================================================
       WATCH CUSTOM UPLOAD STATE
       ========================================================= */

    function watchCustomUpload() {

        var lastUrl =
            '';

        setInterval(
            function () {

                if (
                    state.destroyed ||
                    isExcludedRoom()
                ) {
                    return;
                }

                var url =
                    getCustomSongUrl();

                if (
                    url &&
                    url !== lastUrl
                ) {

                    /*
                       لا نعالج الأغنية الموجودة
                       عند بداية تشغيل السكربت
                       كأنها Upload جديد.
                    */

                    if (!lastUrl) {
                        lastUrl =
                            url;
                    } else {

                        lastUrl =
                            url;

                        /*
                           تغير الرابط داخل المشغل
                           يعني غالبًا رفع جديد
                           من زر الأغنية.
                        */

                        handleCustomUpload(
                            url
                        );
                    }
                }

            },
            300
        );
    }

    /* =========================================================
       WALL MUTATION OBSERVER
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
                            isExcludedRoom()
                        ) {
                            return;
                        }

                        getBoundAudio();

                        /*
                           إذا عندنا Upload ننتظر
                           الـWall الجديد.
                        */

                        if (
                            state.pendingUploadUrl
                        ) {

                            var song =
                                findWallSongByUrl(
                                    state.pendingUploadUrl
                                );

                            if (song) {

                                var oldBid =
                                    state.previousBidBeforeUpload;

                                setCurrentWallSong(
                                    song,
                                    {
                                        sendSwitch: false
                                    }
                                );

                                if (
                                    oldBid &&
                                    oldBid !== song.bid
                                ) {
                                    deleteWallBid(
                                        oldBid
                                    );
                                }

                                sendSync(
                                    'switch',
                                    song.bid
                                );

                                state.pendingUploadUrl =
                                    '';

                                state.previousBidBeforeUpload =
                                    '';

                                console.log(
                                    '✅ TH SONG UPLOAD → SYNC:',
                                    song.bid
                                );
                            }
                        }

                    }
                );

            observer.observe(
                root,
                {
                    childList: true,
                    subtree: true
                }
            );

            state.wallObserver =
                observer;

        } catch (e) {}
    }

    /* =========================================================
       AUTO DISCOVERY
       ========================================================= */

    function periodicScan() {

        setInterval(
            function () {

                if (
                    state.destroyed ||
                    isExcludedRoom()
                ) {
                    return;
                }

                hookSocket();
                hookSendFunction();

                getBoundAudio();

                /*
                   إذا ما عندنا أغنية حالية،
                   خذ آخر أغنية محفوظة بالـWall.
                */

                if (!state.currentBid) {
                    scanCurrentWallSong();
                }

                /*
                   إذا عندنا Upload منتظر،
                   حاول إيجاد الـBID.
                */

                if (
                    state.pendingUploadUrl
                ) {

                    var song =
                        findWallSongByUrl(
                            state.pendingUploadUrl
                        );

                    if (song) {

                        var oldBid =
                            state.previousBidBeforeUpload;

                        setCurrentWallSong(
                            song,
                            {
                                sendSwitch: false
                            }
                        );

                        if (
                            oldBid &&
                            oldBid !== song.bid
                        ) {
                            deleteWallBid(
                                oldBid
                            );
                        }

                        sendSync(
                            'switch',
                            song.bid
                        );

                        state.pendingUploadUrl =
                            '';

                        state.previousBidBeforeUpload =
                            '';
                    }
                }

            },
            700
        );
    }

    /* =========================================================
       PUBLIC API
       ========================================================= */

    window.TH_DYNAMIC_SONG_SYNC = {

        getCurrent: function () {
            return {
                bid:
                    state.currentBid,

                src:
                    state.currentSrc,

                pendingUpload:
                    !!state.pendingUploadUrl,

                previousBid:
                    state.previousBidBeforeUpload,

                audio:
                    !!getCustomAudio(),

                room:
                    getRoomId()
            };
        },

        scan: function () {
            return scanCurrentWallSong();
        },

        destroy: function () {

            state.destroyed =
                true;

            try {
                if (
                    state.wallObserver
                ) {
                    state.wallObserver.disconnect();
                }
            } catch (e) {}

            try {
                if (
                    state.customAudio
                ) {
                    state.customAudio
                        .__TH_SONG_SYNC_BOUND__ =
                        false;
                }
            } catch (e) {}

            try {
                if (
                    state.socket &&
                    state.socket
                        .__TH_SONG_SYNC_HOOKED__
                ) {
                    console.warn(
                        '⚠️ Socket hook cannot be safely restored after external replacement'
                    );
                }
            } catch (e) {}

            window.TH_SONG_PERSISTENT_SYNC =
                false;

            console.log(
                '🛑 TH SONG SYNC DESTROYED'
            );
        }
    };

    /* =========================================================
       START
       ========================================================= */

    function start() {

        if (isExcludedRoom()) {
            console.log(
                '🚫 TH SONG SYNC متوقف في الروم المستثنى'
            );
            return;
        }

        hookSocket();
        hookSendFunction();

        /*
           نعطي واجهة الأغاني وقتًا حتى تكون جاهزة.
        */

        setTimeout(
            function () {

                getBoundAudio();

                scanCurrentWallSong();

                observeWall();

                watchCustomUpload();

                periodicScan();

                console.log(
                    '════════════════════════════════'
                );

                console.log(
                    '🎵 TH SONG PERSISTENT SYNC READY'
                );

                console.log(
                    '🎵 Dynamic BID: ON'
                );

                console.log(
                    '💾 Wall Persistence: ON'
                );

                console.log(
                    '📡 Play/Pause/Seek Sync: ON'
                );

                console.log(
                    '🗑️ Auto Delete Previous: ON'
                );

                console.log(
                    '════════════════════════════════'
                );

            },
            1200
        );
    }

    start();

})();
