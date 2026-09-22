(function () {
    'use strict';

    /* =========================================================
       TH DYNAMIC WALL SONG SYNC
       ========================================================= */

    const PREFIX = '__TH_SONG_SYNC__';

    let currentBid = null;
    let currentAudio = null;
    let previousManagedBid = null;

    let applyingRemote = false;
    let pendingRemote = null;
    let pendingUpload = null;

    let socket = null;
    let originalOnevent = null;

    let domObserver = null;
    let uploadTimer = null;
    let socketTimer = null;
    let audioTimer = null;

    /* =========================================================
       BID EXTRACTION
       ========================================================= */

    function getBidFromElement(el) {
        if (!el) return null;

        const className = String(el.className || '');

        const match = className.match(
            /(?:^|\s)bid([A-Za-z0-9_-]+)(?:\s|$)/
        );

        return match ? match[1] : null;
    }

    function findWallByBid(bid) {
        if (!bid) return null;

        return document.querySelector(
            '.thBcType-wall.bid' + CSS.escape(bid)
        );
    }

    function findAudioByBid(bid) {
        const wall = findWallByBid(bid);

        if (!wall) return null;

        return wall.querySelector('audio');
    }

    /* =========================================================
       FIND NEWEST / NEW WALL AUDIO
       ========================================================= */

    function getAllWallAudios() {
        return Array.from(
            document.querySelectorAll(
                '.thBcType-wall audio'
            )
        );
    }

    function getWallInfo(audio) {
        if (!audio) return null;

        const wall = audio.closest('.thBcType-wall');

        if (!wall) return null;

        const bid = getBidFromElement(wall);

        if (!bid) return null;

        const source =
            audio.currentSrc ||
            audio.src ||
            (
                audio.querySelector('source')
                    ? audio.querySelector('source').src
                    : ''
            );

        return {
            bid: bid,
            wall: wall,
            audio: audio,
            source: source
        };
    }

    /* =========================================================
       CURRENT SONG
       ========================================================= */

    function setCurrentSong(bid, reason) {
        if (!bid) return;

        if (currentBid === bid) {
            bindCurrentAudio();

            return;
        }

        const oldBid = currentBid;

        /*
         * أوقف الأغنية السابقة محليًا.
         */
        if (currentAudio) {
            try {
                currentAudio.pause();
            } catch (e) {}
        }

        previousManagedBid = oldBid;
        currentBid = bid;
        currentAudio = null;

        console.log('🎵 CURRENT SONG CHANGED');
        console.log('OLD BID:', oldBid);
        console.log('NEW BID:', bid);
        console.log('REASON:', reason || 'unknown');

        bindCurrentAudio();

        /*
         * إذا وصلنا للأغنية عن طريق مزامنة جهاز آخر،
         * وكان عندنا أمر تشغيل/إيقاف منتظر، طبقه.
         */
        if (pendingRemote && pendingRemote.bid === bid) {
            const remote = pendingRemote;

            pendingRemote = null;

            setTimeout(function () {
                applyRemote(
                    remote.action,
                    remote.time,
                    bid
                );
            }, 50);
        }
    }

    /* =========================================================
       AUDIO BIND
       ========================================================= */

    function bindCurrentAudio() {
        if (!currentBid) return false;

        const audio = findAudioByBid(currentBid);

        if (!audio) {
            return false;
        }

        if (audio === currentAudio) {
            return true;
        }

        currentAudio = audio;

        audio.addEventListener('play', function () {
            if (applyingRemote) return;

            sendSync(
                'play',
                audio.currentTime
            );
        });

        audio.addEventListener('pause', function () {
            if (applyingRemote) return;

            sendSync(
                'pause',
                audio.currentTime
            );
        });

        audio.addEventListener('seeked', function () {
            if (applyingRemote) return;

            sendSync(
                audio.paused
                    ? 'seek-pause'
                    : 'seek-play',
                audio.currentTime
            );
        });

        console.log('🎵 AUDIO CONNECTED');
        console.log('BID:', currentBid);
        console.log(
            'SRC:',
            audio.currentSrc || audio.src
        );

        return true;
    }

    /* =========================================================
       SEND SYNC
       ========================================================= */

    function sendSync(action, time) {
        if (applyingRemote) return;

        if (!currentBid) {
            console.log(
                '⚠️ لا توجد أغنية حالية للمزامنة'
            );
            return;
        }

        if (
            typeof window.SEND_EVENT_TIGERHOST !==
            'function'
        ) {
            console.log(
                '❌ SEND_EVENT_TIGERHOST غير موجود'
            );

            return;
        }

        const cleanTime = Number(time || 0);

        if (!Number.isFinite(cleanTime)) {
            return;
        }

        const msg =
            PREFIX + '|' +
            currentBid + '|' +
            action + '|' +
            cleanTime.toFixed(3);

        try {
            window.SEND_EVENT_TIGERHOST(
                'SEND_PMSG_TIGERHOST_EVENT',
                {
                    msg: msg,
                    state: 'all'
                }
            );

            console.log(
                '📡 SONG SYNC SEND:',
                {
                    bid: currentBid,
                    action: action,
                    time: Number(
                        cleanTime.toFixed(3)
                    )
                }
            );

        } catch (e) {
            console.log(
                '❌ SONG SYNC SEND ERROR:',
                e
            );
        }
    }

    /* =========================================================
       APPLY REMOTE
       ========================================================= */

    function applyRemote(action, time, bid) {
        if (!bid) return;

        const audio = findAudioByBid(bid);

        if (!audio) {
            pendingRemote = {
                bid: bid,
                action: action,
                time: time
            };

            console.log(
                '⏳ REMOTE SONG AUDIO NOT READY'
            );

            return;
        }

        if (currentBid !== bid) {
            setCurrentSong(
                bid,
                'remote-sync'
            );
        }

        currentAudio = audio;

        const t = Number(time);

        if (!Number.isFinite(t)) {
            return;
        }

        applyingRemote = true;

        function execute() {
            try {
                if (
                    Math.abs(
                        Number(
                            audio.currentTime || 0
                        ) - t
                    ) > 0.20
                ) {
                    audio.currentTime = t;
                }

                if (action === 'play') {
                    const promise =
                        audio.play();

                    if (
                        promise &&
                        typeof promise.catch ===
                        'function'
                    ) {
                        promise.catch(
                            function (err) {
                                console.log(
                                    '⚠️ AUTOPLAY BLOCKED:',
                                    err
                                );
                            }
                        );
                    }
                }

                else if (action === 'pause') {
                    audio.pause();
                }

                console.log(
                    '📥 SONG SYNC APPLY:',
                    {
                        bid: bid,
                        action: action,
                        time: t
                    }
                );

            } catch (e) {
                console.log(
                    '❌ REMOTE APPLY ERROR:',
                    e
                );
            }

            setTimeout(function () {
                applyingRemote = false;
            }, 250);
        }

        if (audio.readyState < 1) {
            const ready = function () {
                audio.removeEventListener(
                    'loadedmetadata',
                    ready
                );

                execute();
            };

            audio.addEventListener(
                'loadedmetadata',
                ready
            );

            return;
        }

        execute();
    }

    /* =========================================================
       DELETE PREVIOUS MANAGED WALL
       ========================================================= */

    function deletePreviousSong(oldBid) {
        if (!oldBid) return;

        /*
         * لا نحذف إذا هو نفسه الحالي.
         */
        if (oldBid === currentBid) {
            return;
        }

        if (
            typeof window.SEND_EVENT_TIGERHOST !==
            'function'
        ) {
            return;
        }

        try {
            window.SEND_EVENT_TIGERHOST(
                'SEND_EVENT_EMIT_DEL_BC',
                {
                    bid: oldBid
                }
            );

            console.log(
                '🗑️ PREVIOUS SONG DELETED:',
                oldBid
            );

        } catch (e) {
            console.log(
                '❌ DELETE OLD SONG ERROR:',
                e
            );
        }
    }

    /* =========================================================
       DETECT NEW UPLOADED WALL SONG
       ========================================================= */

    function detectNewUpload() {
        if (!pendingUpload) {
            return;
        }

        const wanted = pendingUpload;

        const audios = getAllWallAudios();

        for (let i = 0; i < audios.length; i++) {
            const info = getWallInfo(
                audios[i]
            );

            if (!info) continue;

            /*
             * إذا السيرفر رجع نفس رابط الملف
             * فهذا هو المنشور الذي رفعناه.
             */
            if (
                wanted.link &&
                (
                    info.source.indexOf(
                        wanted.link
                    ) !== -1 ||
                    wanted.link.indexOf(
                        info.source
                    ) !== -1
                )
            ) {
                pendingUpload = null;

                const oldBid = currentBid;

                setCurrentSong(
                    info.bid,
                    'new-upload'
                );

                /*
                 * احذف السابق الذي كان تحت إدارة
                 * نظام الأغنية.
                 */
                if (
                    oldBid &&
                    oldBid !== info.bid
                ) {
                    deletePreviousSong(
                        oldBid
                    );
                }

                console.log(
                    '🎵 NEW UPLOADED SONG DETECTED'
                );

                console.log(
                    'NEW BID:',
                    info.bid
                );

                console.log(
                    'SOURCE:',
                    info.source
                );

                return;
            }
        }
    }

    /* =========================================================
       WATCH DOM FOR WALL CHANGES
       ========================================================= */

    function inspectWallChanges() {
        /*
         * أولًا: إذا عندنا رفع جديد،
         * ابحث عن الـWall الناتج عنه.
         */
        detectNewUpload();

        /*
         * إذا عندنا أغنية حالية،
         * تأكد أن audio ظهر.
         */
        if (currentBid) {
            bindCurrentAudio();
        }
    }

    domObserver =
        new MutationObserver(
            function () {
                inspectWallChanges();
            }
        );

    domObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

    /* =========================================================
       INTERCEPT WALL UPLOAD
       ========================================================= */

    function installUploadHook() {
        if (
            typeof window.SEND_EVENT_TIGERHOST !==
            'function'
        ) {
            return false;
        }

        if (
            window.SEND_EVENT_TIGERHOST
                .__TH_DYNAMIC_SONG__
        ) {
            return true;
        }

        const originalSend =
            window.SEND_EVENT_TIGERHOST;

        function wrappedSend(
            cmd,
            data
        ) {
            try {
                if (
                    cmd ===
                    'SEND_BC_TIGERHOST_EVENT' &&
                    data &&
                    typeof data ===
                    'object'
                ) {
                    const link =
                        String(
                            data.link || ''
                        );

                    const type =
                        String(
                            data.type || ''
                        );

                    /*
                     * نهتم فقط برفع MP3/Audio
                     * للـWall.
                     */
                    if (
                        type === 'wall' &&
                        link &&
                        /\.(mp3|wav|ogg|m4a|aac)(?:\?|$)/i
                            .test(link)
                    ) {
                        pendingUpload = {
                            link: link,
                            time: Date.now()
                        };

                        console.log(
                            '📤 NEW SONG UPLOAD DETECTED'
                        );

                        console.log(
                            'LINK:',
                            link
                        );
                    }
                }
            } catch (e) {
                console.log(
                    '⚠️ UPLOAD WATCH ERROR:',
                    e
                );
            }

            return originalSend.apply(
                this,
                arguments
            );
        }

        wrappedSend.__TH_DYNAMIC_SONG__ =
            true;

        wrappedSend.__TH_DYNAMIC_SONG_ORIGINAL__ =
            originalSend;

        window.SEND_EVENT_TIGERHOST =
            wrappedSend;

        console.log(
            '✅ WALL UPLOAD WATCH CONNECTED'
        );

        return true;
    }

    /* =========================================================
       RAW SOCKET RECEIVE
       ========================================================= */

    function processSocketPacket(packet) {
        try {
            if (
                !packet ||
                !Array.isArray(packet.data)
            ) {
                return false;
            }

            const data =
                packet.data;

            if (
                data[0] !==
                'SEND_EVENT_EMIT_SERVER'
            ) {
                return false;
            }

            const event = data[1];

            if (
                !event ||
                typeof event !== 'object'
            ) {
                return false;
            }

            const eventData =
                event.data;

            if (
                !eventData ||
                typeof eventData !==
                'object'
            ) {
                return false;
            }

            const msg =
                String(
                    eventData.msg || ''
                );

            if (
                msg.indexOf(
                    PREFIX + '|'
                ) !== 0
            ) {
                return false;
            }

            const parts =
                msg.split('|');

            if (parts.length < 4) {
                return true;
            }

            const bid =
                String(parts[1] || '');

            const action =
                String(parts[2] || '');

            const time =
                Number(parts[3]);

            if (!bid) {
                return true;
            }

            if (
                action !== 'play' &&
                action !== 'pause' &&
                action !== 'seek-play' &&
                action !== 'seek-pause'
            ) {
                return true;
            }

            if (
                !Number.isFinite(time)
            ) {
                return true;
            }

            console.log(
                '📡 SONG SYNC RECEIVED:',
                {
                    bid: bid,
                    action: action,
                    time: time
                }
            );

            if (
                action === 'seek-play'
            ) {
                applyRemote(
                    'play',
                    time,
                    bid
                );
            }

            else if (
                action === 'seek-pause'
            ) {
                applyRemote(
                    'pause',
                    time,
                    bid
                );
            }

            else {
                applyRemote(
                    action,
                    time,
                    bid
                );
            }

            /*
             * مهم:
             * لا نسمح للرسالة بالوصول إلى
             * emitEvent → ON_DATE_SEND.
             */
            return true;

        } catch (e) {
            console.log(
                '❌ SOCKET SONG ERROR:',
                e
            );

            return false;
        }
    }

    /* =========================================================
       SOCKET HOOK
       ========================================================= */

    function installSocketHook() {
        const s = window.x_x;

        if (
            !s ||
            typeof s.onevent !==
            'function'
        ) {
            return false;
        }

        if (
            socket === s &&
            s.__TH_DYNAMIC_SONG_SYNC__
        ) {
            return true;
        }

        /*
         * إذا Socket تغير،
         * رجّع القديم أولًا.
         */
        if (
            socket &&
            socket !== s &&
            socket.__TH_DYNAMIC_SONG_WRAPPER__
        ) {
            try {
                socket.onevent =
                    socket.__TH_DYNAMIC_SONG_WRAPPER__;
            } catch (e) {}
        }

        const original =
            s.onevent;

        function wrappedOnevent(
            packet
        ) {
            try {
                if (
                    processSocketPacket(
                        packet
                    )
                ) {
                    return;
                }
            } catch (e) {
                console.log(
                    '❌ RAW SOCKET ERROR:',
                    e
                );
            }

            return original.apply(
                this,
                arguments
            );
        }

        s.__TH_DYNAMIC_SONG_WRAPPER__ =
            original;

        s.__TH_DYNAMIC_SONG_SYNC__ =
            true;

        s.onevent =
            wrappedOnevent;

        socket = s;
        originalOnevent =
            original;

        console.log(
            '🛡️ DYNAMIC SONG SOCKET CONNECTED'
        );

        return true;
    }

    /* =========================================================
       INITIAL
       ========================================================= */

    installUploadHook();
    installSocketHook();

    inspectWallChanges();

    /* =========================================================
       WATCH SOCKET RECREATION
       ========================================================= */

    socketTimer =
        setInterval(
            function () {
                installSocketHook();
                installUploadHook();
            },
            1000
        );

    /* =========================================================
       WATCH AUDIO
       ========================================================= */

    audioTimer =
        setInterval(
            function () {
                inspectWallChanges();
            },
            500
        );

    /* =========================================================
       CLEANUP
       ========================================================= */

    window.TH_DYNAMIC_SONG_SYNC = {

        getCurrent: function () {
            return {
                bid: currentBid,
                previousBid:
                    previousManagedBid,
                audio:
                    !!currentAudio,
                pendingUpload:
                    !!pendingUpload
            };
        },

        destroy: function () {

            try {
                if (domObserver) {
                    domObserver.disconnect();
                }
            } catch (e) {}

            try {
                if (socketTimer) {
                    clearInterval(
                        socketTimer
                    );
                }
            } catch (e) {}

            try {
                if (audioTimer) {
                    clearInterval(
                        audioTimer
                    );
                }
            } catch (e) {}

            try {
                if (
                    socket &&
                    socket.__TH_DYNAMIC_SONG_SYNC__ &&
                    socket.__TH_DYNAMIC_SONG_WRAPPER__
                ) {
                    socket.onevent =
                        socket.__TH_DYNAMIC_SONG_WRAPPER__;

                    delete socket.__TH_DYNAMIC_SONG_SYNC__;
                    delete socket.__TH_DYNAMIC_SONG_WRAPPER__;
                }
            } catch (e) {}

            console.log(
                '🛑 DYNAMIC SONG SYNC DESTROYED'
            );
        }
    };

    console.log(
        '======================================'
    );
    console.log(
        '🎵 TH DYNAMIC WALL SONG SYNC ACTIVE'
    );
    console.log(
        '======================================'
    );
    console.log(
        'BID: AUTO'
    );
    console.log(
        'UPLOAD: AUTO DETECTION'
    );
    console.log(
        'SYNC: SOCKET RAW INTERCEPT'
    );
    console.log(
        'OLD SONG: AUTO DELETE'
    );
    console.log(
        '======================================'
    );

})();
