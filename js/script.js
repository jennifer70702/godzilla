/* --- 確保初次進入網站時能執行 --- */
if (document.readyState === 'complete') {
    initPageScripts();
} else {
    window.addEventListener('load', initPageScripts);
}
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
// 音訊元素
const bgm = document.getElementById('bgm');
const accessSound = document.getElementById('access-sound');

// 音樂控制按鈕 (請確保 HTML 中有 id="music-controller")
const musicBtn = document.getElementById('musicBtn');


// 初始化 Barba
barba.init({
    transitions: [{
        name: 'opacity-transition',
    }]
});

// 重要：處理換頁後的 JS 重新啟動
barba.hooks.after((data) => {
    // 將 behavior 改為 'auto'，這會讓頁面瞬間回到最上方，
    // 就像一般的網頁換頁一樣，不會有滑動感。
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });

    // 或者更簡單的寫法：
    // window.scrollTo(0, 0);

    // 同步音樂按鈕狀態
    if (bgm && !bgm.paused) {
        musicBtn.classList.add('playing');
    }
    // 給予 50-100 毫秒的微小延遲，確保新頁面的 DOM 已經被瀏覽器正確渲染
    setTimeout(() => {
        initPageScripts();
    }, 200);
    // 重新初始化新頁面的輪播、標籤等
    initPageScripts();
});

/* ==========================================
   2. 頁面專屬腳本 (包含 Owl Carousel)
   ========================================== */
function initPageScripts() {
    console.log("重新啟動頁面腳本...");
    // 檢查 jQuery 是否已載入 (Owl Carousel 需要 jQuery)
    if (typeof jQuery === 'undefined') {
        console.error("jQuery 未載入，等待中...");
        return;
    }

    // --- IKEA 風格輪播圖邏輯 ---
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.navigation.prev button');
    const nextBtn = document.querySelector('.navigation.next button');

    // 安全檢查：只有當這三個元素都存在時，才執行邏輯
    if (carousel && prevBtn && nextBtn) {

        // 1. 點擊按鈕進行滾動的函式
        const handleScroll = (direction) => {
            const scrollStep = carousel.clientWidth * 0.8;
            const targetPos = direction === 'next'
                ? carousel.scrollLeft + scrollStep
                : carousel.scrollLeft - scrollStep;

            carousel.scrollTo({
                left: targetPos,
                behavior: 'smooth'
            });
        };

        // 2. 更新按鈕狀態的函式
        const updateButtonStatus = () => {
            const { scrollLeft, scrollWidth, clientWidth } = carousel;
            prevBtn.disabled = scrollLeft <= 5;
            nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 5;

            prevBtn.classList.toggle('btn-color-disabled', prevBtn.disabled);
            prevBtn.classList.toggle('btn-color-primary', !prevBtn.disabled);
            nextBtn.classList.toggle('btn-color-disabled', nextBtn.disabled);
            nextBtn.classList.toggle('btn-color-primary', !nextBtn.disabled);
        };

        // 3. 綁定監聽事件 (使用 .onclick 確保換頁後重新覆蓋)
        nextBtn.onclick = () => handleScroll('next');
        prevBtn.onclick = () => handleScroll('prev');
        carousel.onscroll = updateButtonStatus;

        // 4. 初始執行一次
        updateButtonStatus();
    }


    // --- 1. Swiper: News (首頁) ---
    if ($("#swiper-news").length > 0) {
        new Swiper('#swiper-news', {
            direction: 'horizontal',
            loop: true,
            pagination: { el: '.swiper-pagination' },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
                pauseOnMouseEnter: true,
            }
            // 首頁不自動播放 (或依你原本註解掉的設定)
        });
    }

    // --- 2. Swiper: Online Shop (商店頁) ---
    if ($("#swiper-shop").length > 0) {
        new Swiper('#swiper-shop', {
            direction: 'horizontal',
            loop: true,
            pagination: { el: '.swiper-pagination' },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 3000,
                pauseOnMouseEnter: true,
            }
        });
    }

    // --- 3. Owl Carousel: News Slider ---
    if ($("#news-slider").length > 0) {
        $("#news-slider").owlCarousel({
            items: 4,
            nav: true,
            navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
            loop: true,
            dotsEach: 1,
            slideBy: 1,
            autoplay: true,
            autoplayTimeout: 2000,
            autoplayHoverPause: true,
            stagePadding: 80,
            margin: 30,
            responsive: {
                0: { items: 1, stagePadding: 30 },
                640: { items: 2 },
                1024: { items: 3 },
                1440: { items: 4 }
            },
            onTranslated: function (event) {
                // 這個回呼函式可以確保在動畫結束後，索引計算是準確的
                // 如果你發現點點亮的位置不對，可以在這裡調整邏輯
            }
        });
    }

    // --- 4. Owl Carousel: New Arrival ---
    if ($("#new-arrival-slider").length > 0) {
        $("#new-arrival-slider").owlCarousel({
            items: 5,
            loop: true,
            nav: true,
            navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
            dots: true,
            dotsEach: 1,
            slideBy: 1,
            margin: 12,
            stagePadding: 50,
            smartSpeed: 600,
            responsive: {
                0: { items: 1, stagePadding: 30 },
                640: { items: 2 },
                768: { items: 3 },
                1024: { items: 4 },
                1440: { items: 5 }
            },
            onTranslated: function (event) {
                // 這個回呼函式可以確保在動畫結束後，索引計算是準確的
                // 如果你發現點點亮的位置不對，可以在這裡調整邏輯
            }
        });
    }

    // --- 5. Tabs 標籤頁 ---
    if ($(".tabs").length > 0) {
        $(".ability:not(#grow)").hide();
        $(".tabs li").removeClass("active").first().addClass("active");
        $(".tabs a").off("click").on("click", function (e) {
            e.preventDefault();
            $(".ability").hide();
            $($(this).attr("href")).show();
            $(this).parent().siblings().removeClass("active");
            $(this).parent().addClass("active");
        });
    }

    // --- 6. Navbar 捲動特效 (Affix) ---
    $(window).off("scroll").on("scroll", function () {
        if ($(document).scrollTop() > 50) {
            $('.container').addClass('affix');
        } else {
            $('.container').removeClass('affix');
        }
    });
}



/* --- 你原本的音樂與腳印邏輯放在這裡 --- */
// (保持原樣即可，因為它們都在 barba-wrapper 外面，不會被銷毀)

const progressBar = document.getElementById('progress-bar');
const perText = document.getElementById('percentage');
const statusText = document.getElementById('status-text');
const enterBtn = document.getElementById('enter-btn');
const loader = document.getElementById('loader');


let percent = 0;
let fadeInterval;

// loading頁面
// 1. 模擬進度條邏輯
const timer = setInterval(() => {
    percent += Math.floor(Math.random() * 8) + 3;
    if (percent >= 100) {
        percent = 100;
        clearInterval(timer);
        showAccessScreen();
    }
    progressBar.style.width = percent + "%";
    perText.innerText = percent + "%";
}, 100);

function showAccessScreen() {
    progressBar.style.width = "100%";
    perText.style.display = 'none';
    statusText.innerText = "ACCESS GRANTED. AUTHORIZATION REQUIRED.";
    enterBtn.style.display = 'block';
}

// 2. 核心：進入按鈕點擊事件
enterBtn.addEventListener('click', () => {
    // 播放進入音效
    accessSound.play();

    // 延遲 2 秒後播放背景音樂並切換開關狀態
    setTimeout(() => {
        bgm.play();
        console.log("背景音樂開始播放");
    }, 1500);

    loader.classList.add('fade-out');
    bgm.volume = 0; // 先設為靜音
    bgm.play();
    fadeIn(bgm, 1, 2000); // 在 2 秒內淡入到音量 1
    musicBtn.classList.add('playing');
});

// music-controller
// 點擊右下角按鈕切換
musicBtn.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play();
        fadeIn(bgm, 1, 1000); // 1秒淡入
        musicBtn.classList.add('playing');
    } else {
        fadeOut(bgm, 1000, () => {
            bgm.pause(); // 等音量變 0 後再暫停
            musicBtn.classList.remove('playing');
        });
    }
});
// 淡入函式
function fadeIn(audio, targetVolume, duration) {
    clearInterval(fadeInterval);
    const step = targetVolume / (duration / 50);
    fadeInterval = setInterval(() => {
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(audio.volume + step, targetVolume);
        } else {
            clearInterval(fadeInterval);
        }
    }, 50);
}
// 淡出函式
function fadeOut(audio, duration, callback) {
    clearInterval(fadeInterval);
    const step = audio.volume / (duration / 50);
    fadeInterval = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - step, 0);
        } else {
            clearInterval(fadeInterval);
            if (callback) callback();
        }
    }, 50);
}
