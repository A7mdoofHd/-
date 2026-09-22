(function () {

    'use strict';

    /*
     * ============================================================
     * TH SONG — PLAYER / UPLOAD / WALL STORAGE / SWITCH SYNC
     * FINAL TEST
     *
     * الهدف:
     *
     * 1) رفع الأغنية من زر المشغل.
     * 2) حفظها في Wall كسجل واحد فقط.
     * 3) استخدام نفس السجل لإرسال switch.
     * 4) منع ظهور سجل الأغنية في Wall.
     * 5) منع أي رسالة فارغة / نص / صورة / فيديو / صوت
     *    ناتجة عن المشغل.
     * 6) التشغيل والإيقاف والتحكم بالمشغل محلي فقط.
     * 7) لا PMSG.
     * 8) لا socket.onevent.
     * ============================================================
     */

    var GUARD = '__TH_SONG_FINAL_PLAYER_WALL_GUARD__';

    if (window[GUARD]) {
        console.log('⚠️ TH SONG FINAL already installed');
        return;
    }

    window[GUARD] = true;


    /*
     * ============================================================
     * تنظيف النسخة السابقة
     * ============================================================
     */

    try {

        if (
            window.TH_SONG_PLAYER_SYNC_API &&
            typeof window.TH_SONG_PLAYER_SYNC_API.destroy === 'function'
        ) {

            window.TH_SONG_PLAYER_SYNC_API.destroy();

            console.log(
                '🧹 TH SONG OLD SYNC DESTROYED'
            );
        }

    } catch (e) {

        console.warn(
            'TH SONG OLD CLEANUP ERROR:',
            e
        );
    }


    /*
     * ============================================================
     * STATE
     * ============================================================
     */

    var state = {

        currentUrl: '',
        currentName: '',

        lastSentUrl: '',

        uploadWatchTimer: null,

        playerBindTimer: null,

        wallObserver: null,

        addMsgOriginal: null,

        sendOriginal: null,

        sendWrapped: false,

        destroyed: false,

        playerGuardUntil: 0,

        uploadGuardUntil: 0,

        remoteApplying: false

    };


    /*
     * ============================================================
     * CONSTANTS
     * ============================================================
     */

    var PREFIX =
        '__TH_SONG_PLAYER_SYNC__';


    /*
     * ============================================================
     * PLAYER STATE
     * ============================================================
     */

    function getSongState() {

        return window.__TH_SONG_JQ_STATE__ || null;

    }


    function getPlayerAudio() {

        var s = getSongState();

        if (!s) {
            return null;
        }

        return s.audio || null;

    }


    function getPlayerUrl() {

        var s = getSongState();

        if (
            s &&
            s.audioUrl
        ) {

            return String(
                s.audioUrl
            );

        }

        var audio =
            getPlayerAudio();

        if (
            audio &&
            audio.src
        ) {

            return String(
                audio.src
            );

        }

        return '';

    }


    function getPlayerName() {

        var s =
            getSongState();

        if (
            s &&
            s.audioName
        ) {

            return String(
                s.audioName
            );

        }

        return '';

    }


    /*
     * ============================================================
     * URL
     * ============================================================
     */

    function cleanUrl(url) {

        try {

            var value =
                String(url || '').trim();

            if (!value) {
                return '';
            }

            if (
                value.indexOf('http://') === 0 ||
                value.indexOf('https://') === 0
            ) {

                return value;
            }

            if (
                value.charAt(0) === '/'
            ) {

                return location.origin + value;
            }

            return location.origin +
                '/' +
                value;

        } catch (e) {

            return String(url || '');

        }

    }


    /*
     * ============================================================
     * PLAYER LOAD
     * ============================================================
     */

    function loadPlayer(
        url,
        name
    ) {

        url =
            cleanUrl(url);

        if (!url) {
            return false;
        }

        var s =
            getSongState();

        if (!s) {

            console.warn(
                '⚠️ TH SONG STATE NOT FOUND'
            );

            return false;
        }


        try {

            state.remoteApplying = true;

            s.audioUrl =
                url;

            s.audioName =
                name || s.audioName || '';


            /*
             * إذا كانت دالة loadSong الأصلية موجودة
             * نستخدمها حتى يبقى تصميم المشغل وسلوكه كما هو.
             */

            if (
                typeof window.loadSong ===
                'function'
            ) {

                try {

                    window.loadSong(
                        url,
                        name || ''
                    );

                } catch (e) {

                    console.warn(
                        'TH SONG loadSong ERROR:',
                        e
                    );
                }

            } else {

                var oldAudio =
                    s.audio;

                if (
                    oldAudio &&
                    typeof oldAudio.pause ===
                    'function'
                ) {

                    try {
                        oldAudio.pause();
                    } catch (e) {}
                }

                var audio =
                    new Audio(url);

                audio.preload =
                    'auto';

                audio.volume =
                    typeof s.volume ===
                    'number'
                        ? s.volume
                        : 0.5;

                s.audio =
                    audio;

            }


            /*
             * تأكيد الرابط في الحالة
             */

            s.audioUrl =
                url;

            s.audioName =
                name || s.audioName || '';


            if (s.audio) {

                try {
                    s.audio.pause();
                } catch (e) {}

                try {
                    s.audio.currentTime =
                        0;
                } catch (e) {}

            }


            /*
             * تحديث الاسم والحالة بدون تغيير التصميم.
             */

            var nameEl =
                document.getElementById(
                    'TH_SONG_NAME'
                );

            if (nameEl) {

                nameEl.textContent =
                    name || '';

            }

            var statusEl =
                document.getElementById(
                    'TH_SONG_STATUS'
                );

            if (statusEl) {

                statusEl.textContent =
                    'تم تحديث الأغنية';

            }


            console.log(
                '🎵 TH SONG PLAYER LOADED:',
                url
            );

            return true;

        } finally {

            setTimeout(
                function () {

                    state.remoteApplying =
                        false;

                },
                250
            );

        }

    }


    /*
     * ============================================================
     * PLAYER SEND GUARD
     *
     * مهم:
     * لا نلمس socket.
     * فقط نغلف SEND_EVENT_TIGERHOST.
     *
     * الحماية تعمل فقط أثناء عمليات المشغل.
     * ============================================================
     */

    function beginPlayerGuard(
        ms
    ) {

        state.playerGuardUntil =
            Date.now() +
            (ms || 1500);

    }


    function isPlayerGuardActive() {

        return Date.now() <
            state.playerGuardUntil;

    }


    /*
     * ============================================================
     * SEND WRAPPER
     * ============================================================
     *
     * نسمح فقط بحدث الأغنية المقصود:
     *
     * SEND_BC_TIGERHOST_EVENT
     * type=wall
     * msg يبدأ PREFIX
     * link هو رابط mp3
     *
     * وأي إرسال آخر أثناء حماية المشغل يتم حجبه.
     * ============================================================
     */

    function installSendGuard() {

        try {

            if (
                state.sendWrapped
            ) {

                return;
            }

            if (
                typeof window.SEND_EVENT_TIGERHOST !==
                'function'
            ) {

                console.warn(
                    '⚠️ SEND_EVENT_TIGERHOST NOT FOUND'
                );

                return;
            }


            /*
             * إذا سبق لنا حفظ الأصل لا نغلفه مرة أخرى.
             */

            if (
                window.__TH_SONG_REAL_SEND_EVENT__
            ) {

                state.sendOriginal =
                    window.__TH_SONG_REAL_SEND_EVENT__;

            } else {

                state.sendOriginal =
                    window.SEND_EVENT_TIGERHOST;

                window.__TH_SONG_REAL_SEND_EVENT__ =
                    state.sendOriginal;

            }


            var original =
                state.sendOriginal;


            window.SEND_EVENT_TIGERHOST =
                function (
                    cmd,
                    data
                ) {

                    /*
                     * ------------------------------------------------
                     * السماح الوحيد:
                     * حدث Wall الخاص بالأغنية.
                     * ------------------------------------------------
                     */

                    var isSongWallEvent =
                        cmd ===
                        'SEND_BC_TIGERHOST_EVENT' &&
                        data &&
                        data.type === 'wall' &&
                        typeof data.msg === 'string' &&
                        data.msg.indexOf(PREFIX + '|switch|') === 0 &&
                        !!data.link;


                    if (
                        isSongWallEvent
                    ) {

                        console.log(
                            '🎵 TH SONG ALLOWED WALL SAVE/SWITCH:',
                            data.link
                        );

                        return original.apply(
                            this,
                            arguments
                        );

                    }


                    /*
                     * ------------------------------------------------
                     * أثناء رفع/تحكم الأغنية:
                     *
                     * امنع أي:
                     *
                     * - chat
                     * - wall
                     * - pmsg
                     * - صورة
                     * - فيديو
                     * - ملف
                     * - رسالة فارغة
                     * - رسالة نصية
                     * ------------------------------------------------
                     */

                    if (
                        isPlayerGuardActive()
                    ) {

                        console.warn(
                            '🛡️ TH SONG PLAYER SEND BLOCKED:',
                            cmd,
                            data
                        );

                        return false;

                    }


                    /*
                     * ------------------------------------------------
                     * خارج حماية المشغل:
                     * كل شيء طبيعي.
                     * ------------------------------------------------
                     */

                    return original.apply(
                        this,
                        arguments
                    );

                };


            state.sendWrapped =
                true;

            console.log(
                '🛡️ TH SONG SEND GUARD INSTALLED'
            );

        } catch (e) {

            console.error(
                'TH SONG SEND GUARD ERROR:',
                e
            );

        }

    }


    /*
     * ============================================================
     * PARSE SWITCH
     * ============================================================
     */

    function parseSwitch(
        text
    ) {

        try {

            if (
                typeof text !== 'string'
            ) {

                return null;
            }

            if (
                text.indexOf(
                    PREFIX + '|switch|'
                ) !== 0
            ) {

                return null;
            }

            var parts =
                text.split('|');

            if (
                parts.length <
                5
            ) {

                return null;
            }

            return {

                action:
                    'switch',

                url:
                    decodeURIComponent(
                        parts[2] || ''
                    ),

                name:
                    decodeURIComponent(
                        parts[3] || ''
                    ),

                time:
                    parseFloat(
                        parts[4] || '0'
                    ) || 0

            };

        } catch (e) {

            console.error(
                'TH SONG PARSE ERROR:',
                e
            );

            return null;

        }

    }


    /*
     * ============================================================
     * APPLY REMOTE SWITCH
     * ============================================================
     */

    function applyRemote(
        data
    ) {

        if (
            !data ||
            data.action !== 'switch' ||
            !data.url
        ) {

            return false;
        }


        console.log(
            '📥 TH SONG SWITCH RECEIVED:',
            data.url
        );


        state.remoteApplying =
            true;


        loadPlayer(
            data.url,
            data.name || ''
        );


        var audio =
            getPlayerAudio();


        if (audio) {

            try {
                audio.pause();
            } catch (e) {}

            try {
                audio.currentTime =
                    Number(
                        data.time || 0
                    );
            } catch (e) {}

        }


        var s =
            getSongState();

        if (s) {

            s.audioUrl =
                cleanUrl(data.url);

            s.audioName =
                data.name || '';

        }


        var statusEl =
            document.getElementById(
                'TH_SONG_STATUS'
            );

        if (statusEl) {

            statusEl.textContent =
                'تم تحديث الأغنية';

        }


        setTimeout(
            function () {

                state.remoteApplying =
                    false;

            },
            300
        );


        return true;

    }


    /*
     * ============================================================
     * CONSUME SONG MESSAGE
     * ============================================================
     */

    function consumeSyncMessage(
        obj
    ) {

        if (!obj) {
            return false;
        }

        var text = '';


        if (
            typeof obj ===
            'string'
        ) {

            text =
                obj;

        } else {

            text =
                String(
                    obj.msg ||
                    ''
                );

        }


        var parsed =
            parseSwitch(text);


        if (!parsed) {

            return false;

        }


        applyRemote(
            parsed
        );


        console.log(
            '🛡️ SONG SYNC BLOCKED FROM CHAT'
        );


        return true;

    }


    /*
     * ============================================================
     * WALL AUDIO EXTRACTION
     * ============================================================
     */

    function extractWallAudio(
        obj
    ) {

        if (!obj) {
            return '';
        }


        var link =
            String(
                obj.link ||
                ''
            ).trim();


        if (
            link &&
            /\.(mp3|wav|ogg|m4a|aac)(?:\?|$)/i.test(
                link
            )
        ) {

            return cleanUrl(
                link
            );

        }


        var msg =
            String(
                obj.msg ||
                ''
            );


        var match =
            msg.match(
                /(?:href=["']|^)([^"'<> \s]+\/sendfile\/[^"'<> \s]+\.(?:mp3|wav|ogg|m4a|aac)(?:\?[^"'<> ]*)?)/i
            );


        if (match) {

            return cleanUrl(
                match[1]
            );

        }


        match =
            msg.match(
                /(\/sendfile\/[^"'<> \s]+\.(?:mp3|wav|ogg|m4a|aac)(?:\?[^"'<> ]*)?)/i
            );


        if (match) {

            return cleanUrl(
                match[1]
            );

        }


        return '';

    }


    /*
     * ============================================================
     * WALL SONG CONSUMER
     * ============================================================
     */

    function processWallObject(
        obj
    ) {

        if (!obj) {
            return false;
        }


        var syncText =
            String(
                obj.msg ||
                ''
            );


        /*
         * أولًا:
         * إذا كان هذا حدث Song Sync
         * نستهلكه بالكامل.
         */

        if (
            syncText.indexOf(
                PREFIX + '|switch|'
            ) === 0
        ) {

            consumeSyncMessage(
                obj
            );

            return true;

        }


        /*
         * ثانيًا:
         * أي Wall audio يحمل رابط الأغنية الحالية
         * يتم استهلاكه ولا يظهر.
         */

        var audioUrl =
            extractWallAudio(
                obj
            );


        if (!audioUrl) {

            return false;

        }


        /*
         * لا نعتبر أي صوت عشوائي Song.
         *
         * نستهلك فقط الرابط الذي يتطابق مع:
         * - currentUrl
         * - أو lastSentUrl
         * - أو URL الموجود في player state
         */

        var current =
            cleanUrl(
                getPlayerUrl()
            );


        var allowed =
            cleanUrl(
                state.currentUrl
            ) ||
            cleanUrl(
                state.lastSentUrl
            ) ||
            current;


        if (
            allowed &&
            audioUrl !== allowed
        ) {

            return false;

        }


        console.log(
            '🛡️ TH SONG WALL AUDIO CONSUMED:',
            audioUrl
        );


        return true;

    }


    /*
     * ============================================================
     * ADDMSG HOOK
     * ============================================================
     */

    function hookAddMsg() {

        try {

            if (
                typeof window.ADDMSG_TIGERHOST !==
                'function'
            ) {

                console.warn(
                    '⚠️ ADDMSG_TIGERHOST NOT FOUND'
                );

                return;

            }


            /*
             * لا نغلفه مرتين.
             */

            if (
                window.__TH_SONG_REAL_ADDMSG__
            ) {

                state.addMsgOriginal =
                    window.__TH_SONG_REAL_ADDMSG__;

            } else {

                state.addMsgOriginal =
                    window.ADDMSG_TIGERHOST;

                window.__TH_SONG_REAL_ADDMSG__ =
                    state.addMsgOriginal;

            }


            var original =
                state.addMsgOriginal;


            window.ADDMSG_TIGERHOST =
                function (
                    container,
                    obj
                ) {

                    /*
                     * Song sync
                     */

                    if (
                        consumeSyncMessage(
                            obj
                        )
                    ) {

                        return;

                    }


                    /*
                     * Song Wall audio
                     */

                    if (
                        processWallObject(
                            obj
                        )
                    ) {

                        return;

                    }


                    /*
                     * أي Wall طبيعي:
                     * مرره كما هو.
                     */

                    return original.apply(
                        this,
                        arguments
                    );

                };


            console.log(
                '🛡️ TH SONG ADDMSG GUARD INSTALLED'
            );

        } catch (e) {

            console.error(
                'TH SONG ADDMSG HOOK ERROR:',
                e
            );

        }

    }


    /*
     * ============================================================
     * HIDE EXISTING SONG WALL AUDIO
     * ============================================================
     */

    function hideExistingSongWalls() {

        try {

            document
                .querySelectorAll(
                    '.thBcType-wall audio'
                )
                .forEach(
                    function (audio) {

                        var root =
                            audio.closest(
                                '.thBcType-wall'
                            );

                        if (!root) {
                            return;
                        }


                        var src =
                            audio.currentSrc ||
                            audio.src ||
                            audio.querySelector(
                                'source'
                            )?.src ||
                            '';


                        src =
                            cleanUrl(src);


                        var current =
                            cleanUrl(
                                getPlayerUrl()
                            );


                        var last =
                            cleanUrl(
                                state.lastSentUrl
                            );


                        if (
                            src &&
                            (
                                src === current ||
                                src === last
                            )
                        ) {

                            root.style.display =
                                'none';

                        }

                    }
                );

        } catch (e) {}

    }


    /*
     * ============================================================
     * OBSERVE WALL
     * ============================================================
     */

    function observeWall() {

        try {

            if (
                state.wallObserver
            ) {

                return;

            }


            state.wallObserver =
                new MutationObserver(
                    function () {

                        hideExistingSongWalls();

                    }
                );


            state.wallObserver.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );


        } catch (e) {

            console.warn(
                'TH SONG WALL OBSERVER ERROR:',
                e
            );

        }

    }


    /*
     * ============================================================
     * WATCH UPLOAD
     *
     * نفس الكود الذي كان يعمل معنا:
     *
     * Wall event واحد فقط:
     *
     * msg = switch
     * link = mp3
     * type = wall
     * ============================================================
     */

    function watchUpload() {

        try {

            var url =
                getPlayerUrl();


            if (!url) {

                return;

            }


            if (!state.currentUrl) {

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


            if (
                typeof window.SEND_EVENT_TIGERHOST !==
                'function'
            ) {

                return;

            }


            /*
             * حماية المشغل:
             *
             * أي أحداث أخرى تحدث نتيجة الرفع
             * يتم حجبها.
             */

            beginPlayerGuard(
                2500
            );


            /*
             * الرابط الذي نسمح له فقط.
             */

            state.lastSentUrl =
                cleanUrl(url);


            var syncMsg =
                PREFIX +
                '|switch|' +
                encodeURIComponent(
                    url
                ) +
                '|' +
                encodeURIComponent(
                    name
                ) +
                '|0.000';


            /*
             * حدث واحد فقط.
             *
             * لا يوجد:
             * - PMSG
             * - chat
             * - رسالة فارغة
             * - upload ثاني
             */

            window.SEND_EVENT_TIGERHOST(
                'SEND_BC_TIGERHOST_EVENT',
                {
                    msg:
                        syncMsg,

                    link:
                        cleanUrl(url),

                    type:
                        'wall'
                }
            );


            console.log(
                '🎵 TH SONG NEW SONG BROADCAST:',
                url
            );


            /*
             * نخفي أي Wall audio قد يظهر
             * قبل أن يصل ADDMSG للحماية.
             */

            setTimeout(
                hideExistingSongWalls,
                50
            );

            setTimeout(
                hideExistingSongWalls,
                300
            );

            setTimeout(
                hideExistingSongWalls,
                800
            );


        } catch (e) {

            console.error(
                'TH SONG UPLOAD WATCH ERROR:',
                e
            );

        }

    }


    /*
     * ============================================================
     * PLAYER ACTION GUARD
     *
     * نراقب أزرار المشغل.
     *
     * لا نرسل منها أي Sync.
     *
     * فقط نفعّل نافذة حماية قصيرة ضد أي SEND
     * قد يكون مربوطًا بالكود القديم.
     * ============================================================
     */

    function bindPlayerControls() {

        var ids = [

            'TH_SONG_PLAY',
            'TH_SONG_BACK',
            'TH_SONG_FORWARD',
            'TH_SONG_MUTE',
            'TH_SONG_REPEAT',
            'TH_SONG_VOLUME_INPUT',
            'TH_SONG_UPLOAD_BUTTON'

        ];


        ids.forEach(
            function (id) {

                var el =
                    document.getElementById(
                        id
                    );

                if (!el) {
                    return;
                }


                if (
                    el.__TH_SONG_GUARD_BOUND__
                ) {

                    return;

                }


                el.__TH_SONG_GUARD_BOUND__ =
                    true;


                [
                    'click',
                    'change',
                    'input',
                    'pointerdown'
                ].forEach(
                    function (eventName) {

                        el.addEventListener(
                            eventName,
                            function () {

                                beginPlayerGuard(
                                    1200
                                );

                            },
                            true
                        );

                    }
                );

            }
        );

    }


    /*
     * ============================================================
     * PLAYER EVENT PROTECTION
     *
     * لا نرسل play/pause/seek.
     *
     * فقط حماية.
     * ============================================================
     */

    function bindAudioGuard() {

        var audio =
            getPlayerAudio();


        if (!audio) {
            return;
        }


        if (
            audio.__TH_SONG_FINAL_GUARD__
        ) {

            return;

        }


        audio.__TH_SONG_FINAL_GUARD__ =
            true;


        [
            'play',
            'playing',
            'pause',
            'seeked',
            'seeking',
            'ended',
            'volumechange',
            'timeupdate',
            'loadedmetadata',
            'canplay'
        ].forEach(
            function (eventName) {

                audio.addEventListener(
                    eventName,
                    function () {

                        /*
                         * لا نرسل شيئًا.
                         *
                         * فقط نمنع أي SEND
                         * من كود الأغنية القديم
                         * إذا حدث بالتزامن.
                         */

                        beginPlayerGuard(
                            350
                        );

                    },
                    true
                );

            }
        );

    }


    /*
     * ============================================================
     * RECOVERY
     *
     * في هذه النسخة لا نعتمد على Wall DOM
     * لاسترجاع الأغنية، لأننا أصلًا نستهلك
     * سجل الأغنية قبل عرضه.
     *
     * لكن نحاول استعادة آخر حالة موجودة في
     * Song State إذا كانت موجودة.
     * ============================================================
     */

    function recoverPlayerState() {

        try {

            var s =
                getSongState();


            if (
                !s ||
                !s.audioUrl
            ) {

                return;

            }


            var url =
                cleanUrl(
                    s.audioUrl
                );


            if (!url) {
                return;
            }


            state.currentUrl =
                url;

            state.currentName =
                s.audioName || '';


            console.log(
                '🎵 TH SONG PLAYER STATE:',
                url
            );


        } catch (e) {}

    }


    /*
     * ============================================================
     * INSTALL
     * ============================================================
     */

    function install() {

        console.log(
            '🚀 TH SONG FINAL PLAYER/WALL GUARD START'
        );


        installSendGuard();

        hookAddMsg();

        recoverPlayerState();

        observeWall();

        bindPlayerControls();

        bindAudioGuard();


        /*
         * Watch upload
         */

        state.uploadWatchTimer =
            setInterval(
                function () {

                    if (
                        state.destroyed
                    ) {

                        return;

                    }


                    installSendGuard();

                    bindPlayerControls();

                    bindAudioGuard();

                    watchUpload();

                    hideExistingSongWalls();

                },
                400
            );


        /*
         * حماية إضافية بعد تحميل الصفحة
         */

        setTimeout(
            function () {

                bindPlayerControls();
                bindAudioGuard();
                hideExistingSongWalls();

            },
            300
        );


        setTimeout(
            function () {

                bindPlayerControls();
                bindAudioGuard();
                hideExistingSongWalls();

            },
            1200
        );


        console.log(
            '✅ TH SONG FINAL PLAYER/WALL GUARD READY'
        );

    }


    /*
     * ============================================================
     * API
     * ============================================================
     */

    window.TH_SONG_PLAYER_SYNC_API = {

        getState:
            function () {

                return {

                    url:
                        getPlayerUrl(),

                    name:
                        getPlayerName(),

                    room:
                        String(
                            window.room ||
                            ''
                        ),

                    audio:
                        !!getPlayerAudio(),

                    guard:
                        isPlayerGuardActive()

                };

            },


        sync:
            function (
                url,
                name
            ) {

                if (!url) {
                    return false;
                }


                beginPlayerGuard(
                    1500
                );


                state.currentUrl =
                    cleanUrl(url);

                state.currentName =
                    name || '';


                state.lastSentUrl =
                    cleanUrl(url);


                var syncMsg =
                    PREFIX +
                    '|switch|' +
                    encodeURIComponent(
                        cleanUrl(url)
                    ) +
                    '|' +
                    encodeURIComponent(
                        name || ''
                    ) +
                    '|0.000';


                window.SEND_EVENT_TIGERHOST(
                    'SEND_BC_TIGERHOST_EVENT',
                    {
                        msg:
                            syncMsg,

                        link:
                            cleanUrl(url),

                        type:
                            'wall'
                    }
                );


                return true;

            },


        rescan:
            function () {

                bindPlayerControls();
                bindAudioGuard();
                hideExistingSongWalls();

            },


        destroy:
            function () {

                state.destroyed =
                    true;


                if (
                    state.uploadWatchTimer
                ) {

                    clearInterval(
                        state.uploadWatchTimer
                    );

                    state.uploadWatchTimer =
                        null;

                }


                if (
                    state.wallObserver
                ) {

                    try {
                        state.wallObserver.disconnect();
                    } catch (e) {}

                    state.wallObserver =
                        null;

                }


                /*
                 * استرجاع SEND الأصلي
                 */

                if (
                    state.sendWrapped &&
                    state.sendOriginal
                ) {

                    window.SEND_EVENT_TIGERHOST =
                        state.sendOriginal;

                }


                /*
                 * استرجاع ADDMSG الأصلي
                 */

                if (
                    state.addMsgOriginal
                ) {

                    window.ADDMSG_TIGERHOST =
                        state.addMsgOriginal;

                }


                delete window[GUARD];


                console.log(
                    '🧹 TH SONG FINAL DESTROYED'
                );

            }

    };


    /*
     * ============================================================
     * START
     * ============================================================
     */

    install();

})();
