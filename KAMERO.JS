(function ($) {
    'use strict';

    if (window.__TH_SONG_JQ_INSTALLED__) {
        console.log('🎵 TH SONG ALREADY INSTALLED');
        return;
    }
    window.__TH_SONG_JQ_INSTALLED__ = true;

    /* =========================================================
       TH_SONG Namespace & State
       ========================================================= */

    window.TH_SONG = window.TH_SONG || {
        excludedRoom: '2',
        currentRoom: '',
        audio: null,
        audioUrl: '',
        audioName: '',
        repeat: false,
        volume: 0.5
    };

    /* =========================================================
       STORAGE & LOCAL DATA
       ========================================================= */

    function saveToStorage(url, name) {
        try {
            localStorage.setItem('TH_SONG_URL', url || '');
            localStorage.setItem('TH_SONG_NAME', name || '');
        } catch (e) {
            console.error('TH SONG STORAGE SAVE ERROR:', e);
        }
    }

    function loadFromStorage() {
        try {
            var savedUrl = localStorage.getItem('TH_SONG_URL');
            var savedName = localStorage.getItem('TH_SONG_NAME');
            if (savedUrl) {
                TH_SONG.audioUrl = savedUrl;
                TH_SONG.audioName = savedName || 'الأغنية المحفوظة';
                loadSong(savedUrl, TH_SONG.audioName);
            }
        } catch (e) {
            console.error('TH SONG STORAGE LOAD ERROR:', e);
        }
    }

    /* =========================================================
       UTILITIES
       ========================================================= */

    function getRoomId() {
        try {
            if (typeof window.get_rid === 'function') {
                return String(window.get_rid() || '');
            }
            if (typeof window.RID !== 'undefined') {
                return String(window.RID || '');
            }
            if (window.room && window.room.id) {
                return String(window.room.id || '');
            }
        } catch (e) {}
        return '';
    }

    function songExcluded() {
        var room = getRoomId();
        return room === TH_SONG.excludedRoom;
    }

    function getToken() {
        try {
            if (typeof window.getToken === 'function') {
                return window.getToken();
            }
            if (window.X_TH_TOKEN) {
                return window.X_TH_TOKEN;
            }
            var cookieMatch = document.cookie.match(/X-TH-Token=([^;]+)/i);
            if (cookieMatch) {
                return decodeURIComponent(cookieMatch[1]);
            }
            if (window.localStorage) {
                return localStorage.getItem('X-TH-Token') || localStorage.getItem('token') || '';
            }
        } catch (e) {}
        return '';
    }

    function timeFormat(sec) {
        if (!isFinite(sec) || sec < 0) return '00:00';
        var m = Math.floor(sec / 60);
        var s = Math.floor(sec % 60);
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;
        return m + ':' + s;
    }

    /* =========================================================
       CSS STYLES
       ========================================================= */

    function injectStyles() {
        if ($('#TH_SONG_CSS').length) return;

        $('head').append(`
            <style id="TH_SONG_CSS">
                #TH_SONG_BUTTON {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    cursor: pointer;
                    user-select: none;
                }

                #TH_SONG_OVERLAY {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #111118;
                    color: #fff;
                    z-index: 999;
                    display: none;
                    flex-direction: column;
                    box-sizing: border-box;
                    padding: 12px;
                    font-family: system-ui, -apple-system, sans-serif;
                }

                .TH_SONG_CONTAINER {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    height: 100%;
                    justify-content: center;
                }

                .TH_SONG_HEADER {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 8px;
                }

                .TH_SONG_TITLE {
                    font-weight: bold;
                    font-size: 14px;
                    color: #4da6ff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .TH_SONG_STATUS {
                    font-size: 11px;
                    color: #aaa;
                }

                .TH_SONG_CONTROLS {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .TH_SONG_BTN {
                    background: #222230;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: #fff;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s ease;
                }

                .TH_SONG_BTN:hover {
                    background: #333345;
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .TH_SONG_BTN.TH_SONG_ACTIVE {
                    background: #4da6ff;
                    color: #000;
                    font-weight: bold;
                }

                .TH_SONG_PROGRESS_CONTAINER {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11px;
                    color: #888;
                }

                .TH_SONG_PROGRESS_BAR {
                    flex: 1;
                    height: 6px;
                    background: #2a2a38;
                    border-radius: 3px;
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                }

                .TH_SONG_PROGRESS_FILL {
                    height: 100%;
                    width: 0%;
                    background: #4da6ff;
                    border-radius: 3px;
                    transition: width 0.1s linear;
                }

                .TH_SONG_VOLUME_CONTAINER {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .TH_SONG_VOLUME_SLIDER {
                    width: 70px;
                    accent-color: #4da6ff;
                    cursor: pointer;
                }

                #TH_SONG_PASSWORD_MODAL {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.75);
                    z-index: 10000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                }

                .TH_SONG_MODAL_BOX {
                    background: #1a1a24;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 20px;
                    border-radius: 10px;
                    width: 280px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                }

                .TH_SONG_MODAL_TITLE {
                    color: #fff;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                }

                #TH_SONG_PASSWORD_INPUT {
                    background: #0d0d12;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 8px;
                    border-radius: 5px;
                    text-align: center;
                    outline: none;
                }

                #TH_SONG_PASSWORD_ERROR {
                    color: #ff4d4d;
                    font-size: 11px;
                    text-align: center;
                    min-height: 15px;
                }

                .TH_SONG_MODAL_BUTTONS {
                    display: flex;
                    gap: 8px;
                }

                .TH_SONG_MODAL_BUTTONS button {
                    flex: 1;
                    padding: 8px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                }

                .TH_SONG_MODAL_OK {
                    background: #4da6ff;
                    color: #000;
                }

                #TH_SONG_PASSWORD_CANCEL {
                    background: #333;
                    color: #fff;
                }
            </style>
        `);
    }

    /* =========================================================
       UI BUILDERS
       ========================================================= */

    function createSongButton() {
        if ($('#TH_SONG_BUTTON').length || songExcluded()) return;

        var $parent =$('#d0').find('div').first();
        if (!$parent.length) $parent =$('#d0');

        var $btn =$(`
            <button id="TH_SONG_BUTTON" class="btn btn-primary" type="button" style="margin: 2px;">
                🎵 SONG
            </button>
        `);

        $btn.on('click', function (e) {
            e.preventDefault();
            showSong();
        });

        $parent.append($btn);
    }

    function createSongOverlay() {
        if ($('#TH_SONG_OVERLAY').length || songExcluded()) return;

        injectStyles();

        var $dpnl =$('#dpnl');
        if (!$dpnl.length) return;

        var overlayHtml = `
            <div id="TH_SONG_OVERLAY">
                <div class="TH_SONG_CONTAINER">
                    <div class="TH_SONG_HEADER">
                        <div class="TH_SONG_TITLE" id="TH_SONG_NAME">لم يتم اختيار أغنية</div>
                        <div class="TH_SONG_STATUS" id="TH_SONG_STATUS">متوقف</div>
                    </div>

                    <div class="TH_SONG_PROGRESS_CONTAINER">
                        <span id="TH_SONG_CURRENT_TIME">00:00</span>
                        <div class="TH_SONG_PROGRESS_BAR" id="TH_SONG_PROGRESS_WRAP">
                            <div class="TH_SONG_PROGRESS_FILL" id="TH_SONG_PROGRESS_FILL"></div>
                        </div>
                        <span id="TH_SONG_TOTAL_TIME">00:00</span>
                    </div>

                    <div class="TH_SONG_CONTROLS">
                        <button class="TH_SONG_BTN" id="TH_SONG_BACK">◄◄ 10s</button>
                        <button class="TH_SONG_BTN" id="TH_SONG_PLAY">▶</button>
                        <button class="TH_SONG_BTN" id="TH_SONG_FORWARD">10s ►►</button>
                        <button class="TH_SONG_BTN" id="TH_SONG_REPEAT">🔁</button>
                        <button class="TH_SONG_BTN" id="TH_SONG_UPLOAD_BUTTON">⬆ رفع أغنية</button>
                        
                        <div class="TH_SONG_VOLUME_CONTAINER">
                            <button class="TH_SONG_BTN" id="TH_SONG_MUTE">🔊</button>
                            <input type="range" class="TH_SONG_VOLUME_SLIDER" id="TH_SONG_VOLUME_INPUT" min="0" max="100" value="50">
                        </div>
                    </div>
                </div>
            </div>
        `;

        $dpnl.append(overlayHtml);
        loadFromStorage();
    }

    function updateOverlayPosition() {
        var $dpnl =$('#dpnl');
        var $overlay =$('#TH_SONG_OVERLAY');

        if (!$dpnl.length \vert{}\vert{} !$overlay.length) return;

        var $head =$dpnl.find('.th-dpnl-head').first();
        var height = $head.length ? Math.max($head.outerHeight() || 42, 35) : 42;

        $overlay.css('top', height + 'px');
    }

    /* =========================================================
       Song Overlay Actions
       ========================================================= */

    function showSong() {
        if (songExcluded()) return;

        createSongOverlay();

        var $dpnl =$('#dpnl');
        var $overlay =$('#TH_SONG_OVERLAY');

        if (!$dpnl.length \vert{}\vert{} !$overlay.length) return;

        try {
            if (typeof TH_DPNL_SHOW_TIGERHOST === 'function') {
                TH_DPNL_SHOW_TIGERHOST();
            }
        } catch (e) {}

        var $title =$dpnl.find('.pnhead').first();
        if ($title.length) {$title.text('song');
        }

        updateOverlayPosition();
        $overlay.css('display', 'flex').show();
    }

    function hideSong(closeNative) {
        $('#TH_SONG_OVERLAY').hide();

        if (closeNative !== false) {
            try {
                if (typeof TH_DPNL_HIDE_TIGERHOST === 'function') {
                    TH_DPNL_HIDE_TIGERHOST();
                }
            } catch (e) {}
        }
    }

    /* =========================================================
       PLAYER EVENTS & CONTROLS
       ========================================================= */

    function bindPlayerEvents() {
        var audio = TH_SONG.audio;
        if (!audio) return;

        $('#TH_SONG_PLAY')
            .off('click.thsong')
            .on('click.thsong', function () {
                if (!TH_SONG.audioUrl) {
                    setStatus('لا توجد أغنية');
                    return;
                }

                if (audio.paused) {
                    audio.play()
                        .then(function () {
                            $('#TH_SONG_PLAY').text('❚❚');
                            setStatus('يتم التشغيل');
                        })
                        .catch(function () {
                            setStatus('اضغط تشغيل مرة أخرى');
                        });
                } else {
                    audio.pause();
                    $('#TH_SONG_PLAY').text('▶');
                    setStatus('متوقف مؤقتاً');
                }
            });

        $('#TH_SONG_BACK')
            .off('click.thsong')
            .on('click.thsong', function () {
                if (!audio.src) return;
                audio.currentTime = Math.max(0, audio.currentTime - 10);
            });

        $('#TH_SONG_FORWARD')
            .off('click.thsong')
            .on('click.thsong', function () {
                if (!audio.src) return;
                var duration = isFinite(audio.duration) ? audio.duration : audio.currentTime + 10;
                audio.currentTime = Math.min(duration, audio.currentTime + 10);
            });

        $('#TH_SONG_MUTE')
            .off('click.thsong')
            .on('click.thsong', function () {
                audio.muted = !audio.muted;
                $(this).toggleClass('TH_SONG_ACTIVE', audio.muted).text(audio.muted ? '🔇' : '🔊');
            });

        $('#TH_SONG_REPEAT')
            .off('click.thsong')
            .on('click.thsong', function () {
                TH_SONG.repeat = !TH_SONG.repeat;
                $(this).toggleClass('TH_SONG_ACTIVE', TH_SONG.repeat);
                setStatus(TH_SONG.repeat ? 'التكرار مفعل' : 'التكرار متوقف');
            });

        $('#TH_SONG_VOLUME_INPUT')
            .off('input.thsong')
            .on('input.thsong', function () {
                var volume = Number($(this).val()) / 100;
                if (!isFinite(volume)) volume = 0.5;
                volume = Math.max(0, Math.min(1, volume));

                TH_SONG.volume = volume;
                audio.volume = volume;

                if (volume > 0 && audio.muted) {
                    audio.muted = false;
                    $('#TH_SONG_MUTE').text('🔊').removeClass('TH_SONG_ACTIVE');
                }
            });

        $('#TH_SONG_PROGRESS_WRAP')
            .off('click.thsong')
            .on('click.thsong', function (e) {
                if (!isFinite(audio.duration) || audio.duration <= 0) return;
                var rect = this.getBoundingClientRect();
                var ratio = (e.clientX - rect.left) / rect.width;
                ratio = Math.max(0, Math.min(1, ratio));
                audio.currentTime = ratio * audio.duration;
            });

        $(audio)
            .off('.thsong')
            .on('loadedmetadata.thsong', function () {
                $('#TH_SONG_TOTAL_TIME').text(timeFormat(audio.duration));
            })
            .on('timeupdate.thsong', function () {
                updateProgress();
            })
            .on('play.thsong', function () {
                $('#TH_SONG_PLAY').text('❚❚');
                setStatus('يتم التشغيل');
            })
            .on('pause.thsong', function () {
                $('#TH_SONG_PLAY').text('▶');
            })
            .on('ended.thsong', function () {
                if (TH_SONG.repeat) {
                    audio.currentTime = 0;
                    audio.play().catch(function () {});
                } else {
                    $('#TH_SONG_PLAY').text('▶');
                    setStatus('انتهت الأغنية');
                }
            })
            .on('error.thsong', function () {
                setStatus('تعذر تشغيل الملف');
            });
    }

    function updateProgress() {
        var audio = TH_SONG.audio;
        if (!audio) return;

        $('#TH_SONG_CURRENT_TIME').text(timeFormat(audio.currentTime));
        $('#TH_SONG_TOTAL_TIME').text(timeFormat(audio.duration));

        var percent = 0;
        if (isFinite(audio.duration) && audio.duration > 0) {
            percent = (audio.currentTime / audio.duration) * 100;
        }
        percent = Math.max(0, Math.min(100, percent));
        $('#TH_SONG_PROGRESS_FILL').css('width', percent + '%');
    }

    function setStatus(text) {
        $('#TH_SONG_STATUS').text(text);
    }

    function loadSong(url, name) {
        if (!url) return;

        if (!TH_SONG.audio) {
            TH_SONG.audio = new Audio();
            TH_SONG.audio.preload = 'metadata';
            TH_SONG.audio.volume = TH_SONG.volume;
            bindPlayerEvents();
        }

        TH_SONG.audio.pause();
        TH_SONG.audio.src = url;
        TH_SONG.audio.load();

        TH_SONG.audioUrl = url;
        TH_SONG.audioName = name || 'الأغنية المرفوعة';

        $('#TH_SONG_NAME').text(TH_SONG.audioName);
        $('#TH_SONG_PLAY').text('▶');
        setStatus('جاهز للتشغيل');
    }

    /* =========================================================
       PASSWORD MODAL
       ========================================================= */

    function createPasswordModal() {
        if ($('#TH_SONG_PASSWORD_MODAL').length) return;

        $('body').append(`
            <div id="TH_SONG_PASSWORD_MODAL">
                <div class="TH_SONG_MODAL_BOX">
                    <div class="TH_SONG_MODAL_TITLE">رمز رفع الأغنية</div>
                    <input id="TH_SONG_PASSWORD_INPUT" type="password" autocomplete="off" placeholder="اكتب الرمز">
                    <div id="TH_SONG_PASSWORD_ERROR"></div>
                    <div class="TH_SONG_MODAL_BUTTONS">
                        <button type="button" class="TH_SONG_MODAL_OK" id="TH_SONG_PASSWORD_OK">موافق</button>
                        <button type="button" id="TH_SONG_PASSWORD_CANCEL">إلغاء</button>
                    </div>
                </div>
            </div>
        `);

        $('#TH_SONG_PASSWORD_OK').on('click.thsong', checkPassword);
        $('#TH_SONG_PASSWORD_CANCEL').on('click.thsong', closePassword);
        $('#TH_SONG_PASSWORD_INPUT').on('keydown.thsong', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkPassword();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                closePassword();
            }
        });
    }

    function openPassword() {
        if (songExcluded()) return;

        createPasswordModal();
        $('#TH_SONG_PASSWORD_INPUT').val('');
        $('#TH_SONG_PASSWORD_ERROR').text('');
        $('#TH_SONG_PASSWORD_MODAL').css('display', 'flex');

        setTimeout(function () {
            $('#TH_SONG_PASSWORD_INPUT').trigger('focus');
        }, 30);
    }

    function closePassword() {
        $('#TH_SONG_PASSWORD_MODAL').hide();
        $('#TH_SONG_PASSWORD_INPUT').val('');
        $('#TH_SONG_PASSWORD_ERROR').text('');
    }

    function checkPassword() {
        var value = $('#TH_SONG_PASSWORD_INPUT').val();

        if (value === 'khamr69') {
            closePassword();
            openFilePicker();
        } else {
            $('#TH_SONG_PASSWORD_ERROR').text('الرمز غلط');
            $('#TH_SONG_PASSWORD_INPUT').trigger('select');
        }
    }

    /* =========================================================
       FILE PICKER & UPLOAD & BROADCAST
       ========================================================= */

    function openFilePicker() {
        if (songExcluded()) return;

        if (!$('#TH_SONG_FILE_INPUT').length) {
            $('body').append(`
                <input id="TH_SONG_FILE_INPUT" type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac" style="display:none!important;">
            `);

            $('#TH_SONG_FILE_INPUT').on('change.thsong', function () {
                var file = this.files && this.files[0];
                if (!file) return;
                uploadSong(file);
                $(this).val('');
            });
        }

        $('#TH_SONG_FILE_INPUT').trigger('click');
    }

    function sendAudioToChat(url) {
        if (!url) return;
        var audioHtml = `<audio src="${url}" controls autoplay style="width:100%; max-width:300px; margin-top:5px;"></audio>`;

        try {
            if (typeof window.sendmsg === 'function') {
                window.sendmsg(audioHtml);
            } else if (window.ws && typeof window.ws.send === 'function') {
                window.ws.send(JSON.stringify({ type: 'msg', msg: audioHtml }));
            } else {
                console.warn('TH SONG: لم يتم العثور على دالة الإرسال للبث العام.');
            }
        } catch (e) {
            console.error('TH SONG BROADCAST ERROR:', e);
        }
    }

    function uploadSong(file) {
        if (!file || songExcluded()) return;

        var $button =$('#TH_SONG_UPLOAD_BUTTON');
        $button.prop('disabled', true).text('⏳ جاري رفع الأغنية...');

        var token = getToken();

        if (!token) {
            finishUpload();
            alert('X-TH-Token غير موجود');
            return;
        }

        var form = new FormData();
        form.append('photo', file, file.name);

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
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                var text = String(response || '').trim();
                var match = text.match(/\/sendfile\/[^\s"'<>]+/i);
                var url = match ? match[0] : '';

                if (!url) {
                    finishUpload();
                    console.error('TH SONG RESPONSE:', text);
                    alert('تم الرفع لكن لم يتم العثور على رابط الصوت');
                    return;
                }

                if (!/^https?:\/\//i.test(url)) {
                    url = location.origin + (url.charAt(0) === '/' ? url : '/' + url);
                }

                TH_SONG.audioUrl = url;
                TH_SONG.audioName = file.name;

                // حفظ في Storage
                saveToStorage(url, file.name);

                // تحميل الصوت وإرساله للبث العام
                loadSong(url, file.name);
                sendAudioToChat(url);

                finishUpload();
                setStatus('تم الرفع والبث — جاهز');
                console.log('🎵 TH SONG UPLOAD & BROADCAST OK:', url);
            },
            error: function (xhr) {
                finishUpload();
                console.error('TH SONG UPLOAD ERROR:', xhr);
                alert('حدث خطأ أثناء رفع الأغنية');
            }
        });
    }

    function finishUpload() {
        $('#TH_SONG_UPLOAD_BUTTON').prop('disabled', false).text('⬆ رفع أغنية');
    }

    /* =========================================================
       GLOBAL LISTENERS & HOOKS
       ========================================================= */

    $(document)
        .off('click.thsongupload', '#TH_SONG_UPLOAD_BUTTON')
        .on('click.thsongupload', '#TH_SONG_UPLOAD_BUTTON', function () {
            if (songExcluded()) return;
            openPassword();
        });

    $('#d0')
        .off('click.thsongnative', 'button[data-key]')
        .on('click.thsongnative', 'button[data-key]', function () {
            $('#TH_SONG_OVERLAY').hide();
        });

    $(document)
        .off('click.thsongclose', '.th-dpnl-close')
        .on('click.thsongclose', '.th-dpnl-close', function () {
            $('#TH_SONG_OVERLAY').hide();
        });

    function disableSong() {
        if (TH_SONG.audio) {
            try {
                TH_SONG.audio.pause();
            } catch (e) {}
        }

        $('#TH_SONG_PASSWORD_MODAL').remove();
        $('#TH_SONG_FILE_INPUT').remove();
        $('#TH_SONG_OVERLAY').remove();
        $('#TH_SONG_BUTTON').remove();
    }

    function ensureSong() {
        var room = getRoomId();

        if (room === TH_SONG.excludedRoom) {
            TH_SONG.currentRoom = room;
            disableSong();
            return;
        }

        if (room) {
            TH_SONG.currentRoom = room;
        }

        createSongButton();

        if ($('#dpnl').length) {
            createSongOverlay();
        }
    }

    if (typeof window.Send_Rjoin === 'function' && !window.__TH_SONG_JQ_RJOIN_HOOK__) {
        var originalSendRjoin = window.Send_Rjoin;

        window.Send_Rjoin = function (roomId) {
            TH_SONG.currentRoom = String(roomId || '');
            var result = originalSendRjoin.apply(this, arguments);

            setTimeout(function () {
                TH_SONG.currentRoom = String(roomId || '');

                if (String(roomId || '') === TH_SONG.excludedRoom) {
                    disableSong();
                } else {
                    ensureSong();
                }
            }, 700);

            return result;
        };

        window.__TH_SONG_JQ_RJOIN_HOOK__ = true;
    }

    $(window)
        .off('resize.thsong')
        .on('resize.thsong', function () {
            updateOverlayPosition();
        });

    var lastRoom = getRoomId();

    function roomWatcher() {
        var current = getRoomId();

        if (current && current !== lastRoom) {
            lastRoom = current;
            TH_SONG.currentRoom = current;

            if (current === TH_SONG.excludedRoom) {
                disableSong();
            } else {
                ensureSong();
            }
        } else {
            if (current === TH_SONG.excludedRoom) {
                if ($('#TH_SONG_BUTTON').length \vert{}\vert{} $('#TH_SONG_OVERLAY').length) {
                    disableSong();
                }
            } else {
                ensureSong();
            }
        }
    }

    TH_SONG.currentRoom = lastRoom;
    ensureSong();

    window.__TH_SONG_JQ_TIMER__ = setInterval(roomWatcher, 800);

    console.log(
        '%c🎵 TH SONG jQuery SYSTEM FULLY LOADED & INTEGRATED',
        'color:#fff;background:#111;padding:8px 14px;border-radius:7px;font-weight:bold;'
    );

})(jQuery);
