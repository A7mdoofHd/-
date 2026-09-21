(function ($) {
    'use strict';

    /* =========================================================
       TH SONG — JQUERY FULL VERSION
       ========================================================= */

    /* تنظيف نسخة سابقة من نظام الأغاني فقط */
    try {
        if (window.__TH_SONG_JQ_TIMER__) {
            clearInterval(window.__TH_SONG_JQ_TIMER__);
        }
    } catch (e) {}

    $('#TH_SONG_BUTTON').remove();
    $('#TH_SONG_OVERLAY').remove();
    $('#TH_SONG_PASSWORD_MODAL').remove();
    $('#TH_SONG_FILE_INPUT').remove();
    $('#TH_SONG_STYLE').remove();

    window.__TH_SONG_JQ_TIMER__ = null;

    var TH_SONG = {
        audio: null,
        audioUrl: '',
        audioName: '',
        repeat: false,
        volume: 0.5,
        excludedRoom: 'y24qvky05f',
        currentRoom: ''
    };

    window.__TH_SONG_JQ_STATE__ = TH_SONG;


    /* =========================================================
       HELPERS
       ========================================================= */

    function songExcluded() {
        return String(TH_SONG.currentRoom || '') === TH_SONG.excludedRoom;
    }

    function getRoomId() {

        var id = '';

        try {
            if (typeof CURRENT_ROOM !== 'undefined' && CURRENT_ROOM) {
                if (typeof CURRENT_ROOM === 'string') {
                    id = CURRENT_ROOM;
                } else if (CURRENT_ROOM.id) {
                    id = CURRENT_ROOM.id;
                }
            }
        } catch (e) {}

        try {
            if (!id &&
                typeof room_id !== 'undefined' &&
                room_id) {
                id = room_id;
            }
        } catch (e) {}

        try {
            if (!id &&
                typeof roomid !== 'undefined' &&
                roomid) {
                id = roomid;
            }
        } catch (e) {}

        try {
            if (!id &&
                typeof room !== 'undefined' &&
                room) {

                if (typeof room === 'string') {
                    id = room;
                } else if (room.id) {
                    id = room.id;
                }
            }
        } catch (e) {}

        if (!id) {

            var activeRoom =
                $('.room.th-room-item.active').first();

            if (!activeRoom.length) {
                activeRoom =
                    $('.room.th-room-item.sel').first();
            }

            if (activeRoom.length) {

                var onclick =
                    activeRoom.attr('onclick') || '';

                var match =
                    onclick.match(
                        /Send_Rjoin\(['"]([^'"]+)['"]\)/
                    );

                if (match) {
                    id = match[1];
                }
            }
        }

        return String(id || TH_SONG.currentRoom || '');
    }


    function timeFormat(seconds) {

        seconds = Number(seconds) || 0;

        if (!isFinite(seconds) || seconds < 0) {
            seconds = 0;
        }

        var min =
            Math.floor(seconds / 60);

        var sec =
            Math.floor(seconds % 60);

        return String(min).padStart(2, '0') +
            ':' +
            String(sec).padStart(2, '0');
    }


    function getToken() {

        try {
            if (typeof MY_T !== 'undefined' && MY_T) {
                return MY_T;
            }
        } catch (e) {}

        return window.MY_T || '';
    }


    /* =========================================================
       STYLE
       ========================================================= */

    $('head').append(`
        <style id="TH_SONG_STYLE">

            #TH_SONG_BUTTON{
                position:relative!important;
                display:inline-flex!important;
                align-items:center!important;
                justify-content:center!important;

                width:42px!important;
                height:42px!important;

                padding:4px!important;
                margin:0 2px!important;

                border:1px solid rgba(255,255,255,.20)!important;
                border-radius:8px!important;

                background:
                    linear-gradient(
                        145deg,
                        rgba(35,35,35,.98),
                        rgba(10,10,10,.98)
                    )!important;

                box-shadow:
                    0 2px 8px rgba(0,0,0,.35),
                    inset 0 0 8px rgba(255,255,255,.04)!important;

                cursor:pointer!important;
                overflow:hidden!important;

                vertical-align:middle!important;
                z-index:20!important;

                transition:
                    transform .18s ease,
                    box-shadow .18s ease,
                    border-color .18s ease!important;
            }

            #TH_SONG_BUTTON:hover{
                transform:translateY(-1px) scale(1.03)!important;

                border-color:
                    rgba(255,255,255,.42)!important;

                box-shadow:
                    0 4px 14px rgba(0,0,0,.45),
                    inset 0 0 10px rgba(255,255,255,.07)!important;
            }

            #TH_SONG_BUTTON:active{
                transform:scale(.96)!important;
            }

            #TH_SONG_BUTTON img{
                width:31px!important;
                height:31px!important;
                object-fit:contain!important;
                display:block!important;
                pointer-events:none!important;
                user-select:none!important;
            }


            /* =====================================================
               SONG OVERLAY
               ===================================================== */

            #TH_SONG_OVERLAY{
                position:absolute!important;

                left:0!important;
                right:0!important;
                bottom:0!important;

                top:42px!important;

                z-index:9!important;

                display:none;

                overflow:auto!important;

                background:
                    #111
                    url("https://k.top4top.io/p_39161gi8u1.png")
                    center center / cover no-repeat!important;

                box-sizing:border-box!important;
            }

            #TH_SONG_OVERLAY *{
                box-sizing:border-box!important;
            }


            .TH_SONG_CONTENT{
                width:100%!important;
                min-height:100%!important;

                display:flex!important;
                flex-direction:column!important;

                align-items:center!important;

                padding:25px 18px 30px!important;
            }


            .TH_SONG_TITLE{
                width:min(680px,96%)!important;

                margin:0 auto 18px!important;

                padding:13px 16px!important;

                text-align:center!important;

                color:#fff!important;

                font-size:19px!important;
                font-weight:700!important;

                background:
                    linear-gradient(
                        135deg,
                        rgba(0,0,0,.82),
                        rgba(35,35,35,.72)
                    )!important;

                border:
                    1px solid rgba(255,255,255,.18)!important;

                border-radius:12px!important;

                box-shadow:
                    0 8px 25px rgba(0,0,0,.35),
                    inset 0 0 15px rgba(255,255,255,.025)!important;
            }


            /* =====================================================
               PLAYER
               ===================================================== */

            .TH_SONG_PLAYER{
                width:min(680px,96%)!important;

                padding:22px!important;

                border-radius:17px!important;

                background:
                    linear-gradient(
                        145deg,
                        rgba(8,8,8,.94),
                        rgba(28,28,28,.91)
                    )!important;

                border:
                    1px solid rgba(255,255,255,.18)!important;

                box-shadow:
                    0 12px 35px rgba(0,0,0,.48),
                    inset 0 0 22px rgba(255,255,255,.025)!important;

                color:#fff!important;
            }


            .TH_SONG_NOW{
                display:flex!important;
                align-items:center!important;
                gap:12px!important;
                margin-bottom:18px!important;
            }


            .TH_SONG_DISC{
                width:50px!important;
                height:50px!important;

                flex:0 0 50px!important;

                border-radius:50%!important;

                display:flex!important;
                align-items:center!important;
                justify-content:center!important;

                color:#fff!important;

                background:
                    radial-gradient(
                        circle,
                        #555 0 16%,
                        #222 17% 45%,
                        #090909 46% 100%
                    )!important;

                border:
                    1px solid rgba(255,255,255,.20)!important;

                box-shadow:
                    0 4px 15px rgba(0,0,0,.45),
                    inset 0 0 12px rgba(255,255,255,.08)!important;

                font-size:20px!important;
            }


            .TH_SONG_INFO{
                min-width:0!important;
                flex:1!important;
            }


            .TH_SONG_NAME{
                color:#fff!important;

                font-size:16px!important;
                font-weight:700!important;

                overflow:hidden!important;
                text-overflow:ellipsis!important;
                white-space:nowrap!important;
            }


            .TH_SONG_STATUS{
                margin-top:4px!important;

                color:rgba(255,255,255,.58)!important;

                font-size:12px!important;
            }


            /* =====================================================
               PROGRESS
               ===================================================== */

            .TH_SONG_PROGRESS_WRAP{
                width:100%!important;

                padding:8px 0!important;

                cursor:pointer!important;
            }


            .TH_SONG_PROGRESS{
                position:relative!important;

                width:100%!important;
                height:7px!important;

                border-radius:20px!important;

                background:
                    rgba(255,255,255,.12)!important;

                overflow:hidden!important;
            }


            .TH_SONG_PROGRESS_FILL{
                position:absolute!important;

                left:0!important;
                top:0!important;
                bottom:0!important;

                width:0%!important;

                border-radius:inherit!important;

                background:
                    linear-gradient(
                        90deg,
                        #fff,
                        #aaa
                    )!important;
            }


            .TH_SONG_TIMES{
                display:flex!important;

                justify-content:space-between!important;

                color:
                    rgba(255,255,255,.55)!important;

                font-size:11px!important;

                margin-top:5px!important;
            }


            /* =====================================================
               CONTROLS
               ===================================================== */

            .TH_SONG_CONTROLS{
                display:flex!important;

                align-items:center!important;
                justify-content:center!important;

                flex-wrap:wrap!important;

                gap:8px!important;

                margin-top:15px!important;
            }


            .TH_SONG_CTRL{
                width:42px!important;
                height:42px!important;

                border-radius:10px!important;

                border:
                    1px solid rgba(255,255,255,.15)!important;

                background:
                    rgba(255,255,255,.055)!important;

                color:#fff!important;

                cursor:pointer!important;

                font-size:17px!important;
            }


            .TH_SONG_CTRL:hover{
                background:
                    rgba(255,255,255,.12)!important;

                border-color:
                    rgba(255,255,255,.32)!important;
            }


            .TH_SONG_PLAY{
                width:52px!important;
                height:52px!important;

                border-radius:50%!important;

                font-size:20px!important;

                background:
                    linear-gradient(
                        145deg,
                        #fff,
                        #bdbdbd
                    )!important;

                color:#111!important;

                border:none!important;
            }


            .TH_SONG_ACTIVE{
                background:
                    rgba(255,255,255,.16)!important;

                border-color:
                    rgba(255,255,255,.45)!important;
            }


            /* =====================================================
               VOLUME
               ===================================================== */

            .TH_SONG_VOLUME{
                width:min(220px,70%)!important;

                display:flex!important;

                align-items:center!important;

                gap:9px!important;

                margin:15px auto 0!important;
            }


            .TH_SONG_VOLUME span{
                color:rgba(255,255,255,.70)!important;
                font-size:16px!important;
            }


            .TH_SONG_VOLUME input{
                flex:1!important;
                min-width:0!important;
                accent-color:#fff!important;
            }


            /* =====================================================
               UPLOAD
               ===================================================== */

            #TH_SONG_UPLOAD_BUTTON{
                margin-top:17px!important;

                width:min(680px,96%)!important;

                min-height:45px!important;

                border-radius:11px!important;

                border:
                    1px solid rgba(255,255,255,.18)!important;

                background:
                    linear-gradient(
                        145deg,
                        rgba(20,20,20,.96),
                        rgba(45,45,45,.94)
                    )!important;

                color:#fff!important;

                cursor:pointer!important;

                font-size:14px!important;
                font-weight:700!important;
            }


            #TH_SONG_UPLOAD_BUTTON:hover{
                background:
                    linear-gradient(
                        145deg,
                        rgba(40,40,40,.98),
                        rgba(65,65,65,.95)
                    )!important;
            }


            /* =====================================================
               PASSWORD MODAL
               ===================================================== */

            #TH_SONG_PASSWORD_MODAL{
                position:fixed!important;

                inset:0!important;

                z-index:2147483647!important;

                display:none;

                align-items:center!important;
                justify-content:center!important;

                background:
                    rgba(0,0,0,.68)!important;

                backdrop-filter:blur(3px)!important;
            }


            .TH_SONG_MODAL_BOX{
                width:min(360px,calc(100% - 30px))!important;

                padding:20px!important;

                border-radius:15px!important;

                background:
                    linear-gradient(
                        145deg,
                        #171717,
                        #292929
                    )!important;

                border:
                    1px solid rgba(255,255,255,.17)!important;

                box-shadow:
                    0 15px 45px rgba(0,0,0,.55)!important;
            }


            .TH_SONG_MODAL_TITLE{
                color:#fff!important;

                text-align:center!important;

                font-size:17px!important;

                font-weight:700!important;

                margin-bottom:13px!important;
            }


            #TH_SONG_PASSWORD_INPUT{
                width:100%!important;

                height:44px!important;

                padding:0 12px!important;

                border-radius:9px!important;

                border:
                    1px solid rgba(255,255,255,.17)!important;

                outline:none!important;

                background:
                    rgba(0,0,0,.45)!important;

                color:#fff!important;

                text-align:center!important;

                font-size:15px!important;
            }


            #TH_SONG_PASSWORD_ERROR{
                min-height:20px!important;

                margin-top:7px!important;

                color:#ff6b6b!important;

                text-align:center!important;

                font-size:13px!important;
            }


            .TH_SONG_MODAL_BUTTONS{
                display:flex!important;

                gap:8px!important;

                margin-top:9px!important;
            }


            .TH_SONG_MODAL_BUTTONS button{
                flex:1!important;

                height:42px!important;

                border-radius:9px!important;

                cursor:pointer!important;

                border:
                    1px solid rgba(255,255,255,.15)!important;

                color:#fff!important;

                background:
                    rgba(255,255,255,.07)!important;
            }


            .TH_SONG_MODAL_OK{
                background:
                    rgba(255,255,255,.16)!important;
            }

        </style>
    `);


    /* =========================================================
       إنشاء الزر
       ========================================================= */

    function createSongButton() {

        if (songExcluded()) return;

        if ($('#TH_SONG_BUTTON').length) return;

        var $d0 = $('#d0');

        if (!$d0.length) return;

        var $button = $(`
            <button
                type="button"
                id="TH_SONG_BUTTON"
                title="song"
                aria-label="song">

                <img
                    src="https://e.top4top.io/p_3916r5ph61.gif"
                    alt="song"
                    draggable="false">

            </button>
        `);

        var $settings =
            $d0.find('[data-key="settings"]').first();

        if ($settings.length) {
            $settings.before($button);
        } else {
            $d0.append($button);
        }


        $button.on('click', function (e) {

            e.preventDefault();

            if (songExcluded()) return;

            var $overlay =
                $('#TH_SONG_OVERLAY');

            if (
                $overlay.length &&
                $overlay.is(':visible')
            ) {
                hideSong(true);
            } else {
                showSong();
            }

        });
    }


    /* =========================================================
       إنشاء الـ Overlay
       ========================================================= */

    function createSongOverlay() {

        if (songExcluded()) return;

        var $dpnl =
            $('#dpnl');

        if (!$dpnl.length) return;

        if ($('#TH_SONG_OVERLAY').length) {
            return;
        }

        var html = `

            <div id="TH_SONG_OVERLAY">

                <div class="TH_SONG_CONTENT">

                    <div class="TH_SONG_TITLE">
                        song
                    </div>


                    <div class="TH_SONG_PLAYER">

                        <div class="TH_SONG_NOW">

                            <div class="TH_SONG_DISC">
                                ♪
                            </div>

                            <div class="TH_SONG_INFO">

                                <div
                                    class="TH_SONG_NAME"
                                    id="TH_SONG_NAME">

                                    لا توجد أغنية

                                </div>

                                <div
                                    class="TH_SONG_STATUS"
                                    id="TH_SONG_STATUS">

                                    ارفع ملف صوتي لتشغيله

                                </div>

                            </div>

                        </div>


                        <div
                            class="TH_SONG_PROGRESS_WRAP"
                            id="TH_SONG_PROGRESS_WRAP">

                            <div class="TH_SONG_PROGRESS">

                                <div
                                    class="TH_SONG_PROGRESS_FILL"
                                    id="TH_SONG_PROGRESS_FILL">
                                </div>

                            </div>


                            <div class="TH_SONG_TIMES">

                                <span id="TH_SONG_CURRENT_TIME">
                                    00:00
                                </span>

                                <span id="TH_SONG_TOTAL_TIME">
                                    00:00
                                </span>

                            </div>

                        </div>


                        <div class="TH_SONG_CONTROLS">

                            <button
                                type="button"
                                class="TH_SONG_CTRL"
                                id="TH_SONG_BACK"
                                title="رجوع 10 ثواني">

                                ↶

                            </button>


                            <button
                                type="button"
                                class="TH_SONG_CTRL TH_SONG_PLAY"
                                id="TH_SONG_PLAY"
                                title="تشغيل">

                                ▶

                            </button>


                            <button
                                type="button"
                                class="TH_SONG_CTRL"
                                id="TH_SONG_FORWARD"
                                title="تقديم 10 ثواني">

                                ↷

                            </button>


                            <button
                                type="button"
                                class="TH_SONG_CTRL"
                                id="TH_SONG_MUTE"
                                title="كتم">

                                🔊

                            </button>


                            <button
                                type="button"
                                class="TH_SONG_CTRL"
                                id="TH_SONG_REPEAT"
                                title="تكرار">

                                ↻

                            </button>

                        </div>


                        <div class="TH_SONG_VOLUME">

                            <span>🔉</span>

                            <input
                                id="TH_SONG_VOLUME_INPUT"
                                type="range"
                                min="0"
                                max="100"
                                value="50">

                            <span>🔊</span>

                        </div>

                    </div>


                    <button
                        type="button"
                        id="TH_SONG_UPLOAD_BUTTON">

                        ⬆ رفع أغنية

                    </button>

                </div>

            </div>
        `;

        $dpnl.append(html);


        if (!TH_SONG.audio) {

            TH_SONG.audio =
                new Audio();

            TH_SONG.audio.preload =
                'metadata';

            TH_SONG.audio.volume =
                TH_SONG.volume;
        }


        bindPlayerEvents();


        if (TH_SONG.audioUrl) {

            loadSong(
                TH_SONG.audioUrl,
                TH_SONG.audioName
            );
        }


        updateOverlayPosition();
    }


    /* =========================================================
       حجم الـ Overlay
       ========================================================= */

    function updateOverlayPosition() {

        var $dpnl =
            $('#dpnl');

        var $overlay =
            $('#TH_SONG_OVERLAY');

        if (!$dpnl.length ||
            !$overlay.length) {
            return;
        }

        var $head =
            $dpnl.find('.th-dpnl-head').first();

        var height =
            $head.length
                ? Math.max(
                    $head.outerHeight() || 42,
                    35
                  )
                : 42;

        $overlay.css(
            'top',
            height + 'px'
        );
    }


    /* =========================================================
       فتح Song
       ========================================================= */

    function showSong() {

        if (songExcluded()) return;

        createSongOverlay();

        var $dpnl =
            $('#dpnl');

        var $overlay =
            $('#TH_SONG_OVERLAY');

        if (!$dpnl.length ||
            !$overlay.length) {
            return;
        }


        try {

            if (
                typeof TH_DPNL_SHOW_TIGERHOST ===
                'function'
            ) {

                TH_DPNL_SHOW_TIGERHOST();

            }

        } catch (e) {}


        var $title =
            $dpnl.find('.pnhead').first();

        if ($title.length) {
            $title.text('song');
        }


        updateOverlayPosition();

        $overlay.show();

    }


    /* =========================================================
       إغلاق Song
       ========================================================= */

    function hideSong(closeNative) {

        $('#TH_SONG_OVERLAY').hide();

        if (closeNative !== false) {

            try {

                if (
                    typeof TH_DPNL_HIDE_TIGERHOST ===
                    'function'
                ) {

                    TH_DPNL_HIDE_TIGERHOST();

                }

            } catch (e) {}
        }
    }


    /* =========================================================
       PLAYER EVENTS
       ========================================================= */

    function bindPlayerEvents() {

        var audio =
            TH_SONG.audio;

        if (!audio) return;


        $('#TH_SONG_PLAY')
            .off('click.thsong')
            .on('click.thsong', function () {

                if (!TH_SONG.audioUrl) {

                    setStatus(
                        'لا توجد أغنية'
                    );

                    return;
                }


                if (audio.paused) {

                    audio.play()
                        .then(function () {

                            $('#TH_SONG_PLAY')
                                .text('❚❚');

                            setStatus(
                                'يتم التشغيل'
                            );

                        })
                        .catch(function () {

                            setStatus(
                                'اضغط تشغيل مرة أخرى'
                            );

                        });

                } else {

                    audio.pause();

                    $('#TH_SONG_PLAY')
                        .text('▶');

                    setStatus(
                        'متوقف مؤقتاً'
                    );
                }

            });


        $('#TH_SONG_BACK')
            .off('click.thsong')
            .on('click.thsong', function () {

                if (!audio.src) return;

                audio.currentTime =
                    Math.max(
                        0,
                        audio.currentTime - 10
                    );

            });


        $('#TH_SONG_FORWARD')
            .off('click.thsong')
            .on('click.thsong', function () {

                if (!audio.src) return;

                var duration =
                    isFinite(audio.duration)
                        ? audio.duration
                        : audio.currentTime + 10;

                audio.currentTime =
                    Math.min(
                        duration,
                        audio.currentTime + 10
                    );

            });


        $('#TH_SONG_MUTE')
            .off('click.thsong')
            .on('click.thsong', function () {

                audio.muted =
                    !audio.muted;

                $(this)
                    .toggleClass(
                        'TH_SONG_ACTIVE',
                        audio.muted
                    )
                    .text(
                        audio.muted
                            ? '🔇'
                            : '🔊'
                    );

            });


        $('#TH_SONG_REPEAT')
            .off('click.thsong')
            .on('click.thsong', function () {

                TH_SONG.repeat =
                    !TH_SONG.repeat;

                $(this).toggleClass(
                    'TH_SONG_ACTIVE',
                    TH_SONG.repeat
                );

                setStatus(
                    TH_SONG.repeat
                        ? 'التكرار مفعل'
                        : 'التكرار متوقف'
                );

            });


        $('#TH_SONG_VOLUME_INPUT')
            .off('input.thsong')
            .on('input.thsong', function () {

                var volume =
                    Number($(this).val()) / 100;

                if (!isFinite(volume)) {
                    volume = 0.5;
                }

                volume =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            volume
                        )
                    );

                TH_SONG.volume =
                    volume;

                audio.volume =
                    volume;

                if (
                    volume > 0 &&
                    audio.muted
                ) {

                    audio.muted = false;

                    $('#TH_SONG_MUTE')
                        .text('🔊')
                        .removeClass(
                            'TH_SONG_ACTIVE'
                        );
                }

            });


        $('#TH_SONG_PROGRESS_WRAP')
            .off('click.thsong')
            .on('click.thsong', function (e) {

                if (
                    !isFinite(audio.duration) ||
                    audio.duration <= 0
                ) {
                    return;
                }

                var rect =
                    this.getBoundingClientRect();

                var ratio =
                    (
                        e.clientX -
                        rect.left
                    ) / rect.width;

                ratio =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            ratio
                        )
                    );

                audio.currentTime =
                    ratio * audio.duration;

            });


        $(audio)
            .off('.thsong')
            .on(
                'loadedmetadata.thsong',
                function () {

                    $('#TH_SONG_TOTAL_TIME')
                        .text(
                            timeFormat(
                                audio.duration
                            )
                        );

                }
            )
            .on(
                'timeupdate.thsong',
                function () {

                    updateProgress();

                }
            )
            .on(
                'play.thsong',
                function () {

                    $('#TH_SONG_PLAY')
                        .text('❚❚');

                    setStatus(
                        'يتم التشغيل'
                    );

                }
            )
            .on(
                'pause.thsong',
                function () {

                    $('#TH_SONG_PLAY')
                        .text('▶');

                }
            )
            .on(
                'ended.thsong',
                function () {

                    if (TH_SONG.repeat) {

                        audio.currentTime =
                            0;

                        audio.play()
                            .catch(
                                function () {}
                            );

                    } else {

                        $('#TH_SONG_PLAY')
                            .text('▶');

                        setStatus(
                            'انتهت الأغنية'
                        );

                    }

                }
            )
            .on(
                'error.thsong',
                function () {

                    setStatus(
                        'تعذر تشغيل الملف'
                    );

                }
            );

    }


    function updateProgress() {

        var audio =
            TH_SONG.audio;

        if (!audio) return;


        $('#TH_SONG_CURRENT_TIME')
            .text(
                timeFormat(
                    audio.currentTime
                )
            );


        $('#TH_SONG_TOTAL_TIME')
            .text(
                timeFormat(
                    audio.duration
                )
            );


        var percent = 0;

        if (
            isFinite(audio.duration) &&
            audio.duration > 0
        ) {

            percent =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;
        }


        percent =
            Math.max(
                0,
                Math.min(
                    100,
                    percent
                )
            );


        $('#TH_SONG_PROGRESS_FILL')
            .css(
                'width',
                percent + '%'
            );

    }


    function setStatus(text) {

        $('#TH_SONG_STATUS')
            .text(text);

    }


    function loadSong(url, name) {

        if (!url) return;


        if (!TH_SONG.audio) {

            TH_SONG.audio =
                new Audio();

            TH_SONG.audio.preload =
                'metadata';

            TH_SONG.audio.volume =
                TH_SONG.volume;

            bindPlayerEvents();
        }


        TH_SONG.audio.pause();

        TH_SONG.audio.src =
            url;

        TH_SONG.audio.load();


        TH_SONG.audioUrl =
            url;

        TH_SONG.audioName =
            name || 'الأغنية المرفوعة';


        $('#TH_SONG_NAME')
            .text(
                TH_SONG.audioName
            );


        $('#TH_SONG_PLAY')
            .text('▶');


        setStatus(
            'جاهز للتشغيل'
        );

        /* لا يوجد autoplay */

    }


    /* =========================================================
       PASSWORD MODAL
       ========================================================= */

    function createPasswordModal() {

        if (
            $('#TH_SONG_PASSWORD_MODAL').length
        ) {
            return;
        }


        $('body').append(`

            <div id="TH_SONG_PASSWORD_MODAL">

                <div class="TH_SONG_MODAL_BOX">

                    <div class="TH_SONG_MODAL_TITLE">
                        رمز رفع الأغنية
                    </div>


                    <input
                        id="TH_SONG_PASSWORD_INPUT"
                        type="text"
                        autocomplete="off"
                        placeholder="اكتب الرمز">


                    <div id="TH_SONG_PASSWORD_ERROR">
                    </div>


                    <div class="TH_SONG_MODAL_BUTTONS">

                        <button
                            type="button"
                            class="TH_SONG_MODAL_OK"
                            id="TH_SONG_PASSWORD_OK">

                            موافق

                        </button>


                        <button
                            type="button"
                            id="TH_SONG_PASSWORD_CANCEL">

                            إلغاء

                        </button>

                    </div>

                </div>

            </div>
        `);


        $('#TH_SONG_PASSWORD_OK')
            .on(
                'click.thsong',
                checkPassword
            );


        $('#TH_SONG_PASSWORD_CANCEL')
            .on(
                'click.thsong',
                closePassword
            );


        $('#TH_SONG_PASSWORD_INPUT')
            .on(
                'keydown.thsong',
                function (e) {

                    if (e.key === 'Enter') {

                        e.preventDefault();

                        checkPassword();

                    }

                    if (e.key === 'Escape') {

                        e.preventDefault();

                        closePassword();

                    }

                }
            );

    }


    function openPassword() {

        if (songExcluded()) return;

        createPasswordModal();

        $('#TH_SONG_PASSWORD_INPUT')
            .val('');

        $('#TH_SONG_PASSWORD_ERROR')
            .text('');

        $('#TH_SONG_PASSWORD_MODAL')
            .css(
                'display',
                'flex'
            );

        setTimeout(
            function () {

                $('#TH_SONG_PASSWORD_INPUT')
                    .trigger('focus');

            },
            30
        );

    }


    function closePassword() {

        $('#TH_SONG_PASSWORD_MODAL')
            .hide();

        $('#TH_SONG_PASSWORD_INPUT')
            .val('');

        $('#TH_SONG_PASSWORD_ERROR')
            .text('');
    }


    function checkPassword() {

        var value =
            $('#TH_SONG_PASSWORD_INPUT')
                .val();


        if (value === 'khamr69') {

            closePassword();

            openFilePicker();

        } else {

            $('#TH_SONG_PASSWORD_ERROR')
                .text('الرمز غلط');

            $('#TH_SONG_PASSWORD_INPUT')
                .trigger('select');

        }

    }


    /* =========================================================
       FILE PICKER
       ========================================================= */

    function openFilePicker() {

        if (songExcluded()) return;

        if (
            !$('#TH_SONG_FILE_INPUT').length
        ) {

            $('body').append(`

                <input
                    id="TH_SONG_FILE_INPUT"
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                    style="display:none!important;">

            `);


            $('#TH_SONG_FILE_INPUT')
                .on(
                    'change.thsong',
                    function () {

                        var file =
                            this.files &&
                            this.files[0];

                        if (!file) return;

                        uploadSong(file);

                        $(this).val('');

                    }
                );
        }


        $('#TH_SONG_FILE_INPUT')
            .trigger('click');

    }


    /* =========================================================
       UPLOAD
       ========================================================= */

    function uploadSong(file) {

        if (!file ||
            songExcluded()) {
            return;
        }


        var $button =
            $('#TH_SONG_UPLOAD_BUTTON');


        $button
            .prop('disabled', true)
            .text(
                '⏳ جاري رفع الأغنية...'
            );


        var token =
            getToken();


        if (!token) {

            finishUpload();

            alert(
                'X-TH-Token غير موجود'
            );

            return;
        }


        var form =
            new FormData();

        form.append(
            'photo',
            file,
            file.name
        );


        $.ajax({

            url: '/upload',

            type: 'POST',

            data: form,

            processData: false,

            contentType: false,

            xhrFields: {
                withCredentials: true
            },

            headers: {
                'X-TH-Token': token,
                'X-Requested-With':
                    'XMLHttpRequest'
            },


            success: function (response) {

                var text =
                    String(
                        response || ''
                    ).trim();


                var match =
                    text.match(
                        /\/sendfile\/[^\s"'<>]+/i
                    );


                var url =
                    match
                        ? match[0]
                        : '';


                if (!url) {

                    finishUpload();

                    console.error(
                        'TH SONG RESPONSE:',
                        text
                    );

                    alert(
                        'تم الرفع لكن لم يتم العثور على رابط الصوت'
                    );

                    return;
                }


                if (
                    !/^https?:\/\//i.test(url)
                ) {

                    url =
                        location.origin +
                        (
                            url.charAt(0) === '/'
                                ? url
                                : '/' + url
                        );

                }


                TH_SONG.audioUrl =
                    url;

                TH_SONG.audioName =
                    file.name;


                loadSong(
                    url,
                    file.name
                );


                finishUpload();


                setStatus(
                    'تم رفع الأغنية — اضغط تشغيل'
                );


                console.log(
                    '🎵 TH SONG UPLOAD OK:',
                    url
                );

            },


            error: function (xhr) {

                finishUpload();

                console.error(
                    'TH SONG UPLOAD ERROR:',
                    xhr
                );

                alert(
                    'حدث خطأ أثناء رفع الأغنية'
                );

            }

        });

    }


    function finishUpload() {

        $('#TH_SONG_UPLOAD_BUTTON')
            .prop('disabled', false)
            .text('⬆ رفع أغنية');

    }


    /* =========================================================
       زر الرفع
       ========================================================= */

    $(document)
        .off(
            'click.thsongupload',
            '#TH_SONG_UPLOAD_BUTTON'
        )
        .on(
            'click.thsongupload',
            '#TH_SONG_UPLOAD_BUTTON',
            function () {

                if (songExcluded()) return;

                openPassword();

            }
        );


    /* =========================================================
       الخاص / الغرف / الحائط / الإعدادات
       نخفي SONG فقط ونترك onclick الأصلي يشتغل
       ========================================================= */

    $('#d0')
        .off(
            'click.thsongnative',
            'button[data-key]'
        )
        .on(
            'click.thsongnative',
            'button[data-key]',
            function () {

                $('#TH_SONG_OVERLAY')
                    .hide();

            }
        );


    /* =========================================================
       X الأصلي
       ========================================================= */

    $(document)
        .off(
            'click.thsongclose',
            '.th-dpnl-close'
        )
        .on(
            'click.thsongclose',
            '.th-dpnl-close',
            function () {

                $('#TH_SONG_OVERLAY')
                    .hide();

            }
        );


    /* =========================================================
       الغرفة المستثناة
       ========================================================= */

    function disableSong() {

        if (TH_SONG.audio) {

            try {
                TH_SONG.audio.pause();
            } catch (e) {}

        }


        $('#TH_SONG_PASSWORD_MODAL')
            .remove();

        $('#TH_SONG_FILE_INPUT')
            .remove();

        $('#TH_SONG_OVERLAY')
            .remove();

        $('#TH_SONG_BUTTON')
            .remove();

    }


    function ensureSong() {

        var room =
            getRoomId();


        if (room === TH_SONG.excludedRoom) {

            TH_SONG.currentRoom =
                room;

            disableSong();

            return;
        }


        if (room) {

            TH_SONG.currentRoom =
                room;
        }


        createSongButton();

        if ($('#dpnl').length) {
            createSongOverlay();
        }

    }


    /* =========================================================
       Hook Send_Rjoin
       ========================================================= */

    if (
        typeof window.Send_Rjoin === 'function' &&
        !window.__TH_SONG_JQ_RJOIN_HOOK__
    ) {

        var originalSendRjoin =
            window.Send_Rjoin;


        window.Send_Rjoin =
            function (roomId) {

                TH_SONG.currentRoom =
                    String(roomId || '');


                var result =
                    originalSendRjoin.apply(
                        this,
                        arguments
                    );


                setTimeout(
                    function () {

                        TH_SONG.currentRoom =
                            String(roomId || '');


                        if (
                            String(roomId || '') ===
                            TH_SONG.excludedRoom
                        ) {

                            disableSong();

                        } else {

                            ensureSong();

                        }

                    },
                    700
                );


                return result;
            };


        window.__TH_SONG_JQ_RJOIN_HOOK__ =
            true;

    }


    /* =========================================================
       Resize
       ========================================================= */

    $(window)
        .off(
            'resize.thsong',
        )
        .on(
            'resize.thsong',
            function () {

                updateOverlayPosition();

            }
        );


    /* =========================================================
       مراقبة الغرفة
       ========================================================= */

    var lastRoom =
        getRoomId();


    function roomWatcher() {

        var current =
            getRoomId();


        if (
            current &&
            current !== lastRoom
        ) {

            lastRoom =
                current;

            TH_SONG.currentRoom =
                current;


            if (
                current ===
                TH_SONG.excludedRoom
            ) {

                disableSong();

            } else {

                ensureSong();

            }

        } else {

            if (
                current ===
                TH_SONG.excludedRoom
            ) {

                if (
                    $('#TH_SONG_BUTTON').length ||
                    $('#TH_SONG_OVERLAY').length
                ) {

                    disableSong();

                }

            } else {

                ensureSong();

            }

        }

    }


    TH_SONG.currentRoom =
        lastRoom;


    ensureSong();


    window.__TH_SONG_JQ_TIMER__ =
        setInterval(
            roomWatcher,
            800
        );


    console.log(
        '%c🎵 TH SONG jQuery INSTALLED',
        'color:#fff;background:#111;padding:8px 14px;border-radius:7px;font-weight:bold;'
    );

    console.log(
        '✅ Native tabs untouched'
    );

})(jQuery);
