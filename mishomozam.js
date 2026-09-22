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
         * =====================================================
         * رفع الأغنية الجديدة = حفظ + مزامنة فورية
         *
         * لا نرسل حدثين.
         * نفس Wall event يحمل:
         *
         * 1. رابط الأغنية للتخزين
         * 2. أمر switch للمستخدمين
         *
         * المستقبل يلتقط الرسالة قبل عرض الـWall.
         * =====================================================
         */

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

        window.SEND_EVENT_TIGERHOST(
            'SEND_BC_TIGERHOST_EVENT',
            {
                msg: syncMsg,
                link: cleanUrl(url),
                type: 'wall'
            }
        );

        console.log(
            '🎵 TH SONG NEW SONG BROADCAST:',
            url
        );

    } catch (e) {

        console.error(
            'TH SONG UPLOAD WATCH ERROR:',
            e
        );

    }
}
