// script.js
document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const mainPage = document.getElementById('main-page');
    const thankYouPage = document.getElementById('thank-you-page');
    const loveLetterPage = document.getElementById('love-letter-page');
    const slideshowPage = document.getElementById('slideshow-page');
    const music = document.getElementById('music');
    const noSound = document.getElementById('no-sound');
    const waitMessage = document.getElementById('wait-message');
    const countdownMessage = document.getElementById('countdown-message');
    const birthdayPrompt = document.getElementById('birthday-prompt');
    const birthdayInput = document.getElementById('birthday-input');
    const confirmBtn = document.getElementById('confirm-btn');
    const errorMessage = document.getElementById('error-message');
    const emailStatus = document.getElementById('email-status');
    const nextBtn = document.getElementById('next-btn');
    const namePrompt = document.getElementById('name-prompt');
    const nameInput = document.getElementById('name-input');
    const confirmNameBtn = document.getElementById('confirm-name-btn');
    const nameErrorMessage = document.getElementById('name-error-message');
    const slideCaption = document.getElementById('slide-caption');

    let clickCount = 0;

    // ข้อความสำหรับแต่ละสไลด์ใน UI 4
    const captions = [
        "เธอเกิดวันที่ 27 เดือน ตุลาคม ปี 2554",
        "รอยยิ้มของเธอที่ฉันหลงรัก",
        "โมเมนต์ดีๆ ที่เรามีด้วยกัน",
        "เรายังจำวันแรกที่ เธอขอคาสายกับเราได้มันเป็นวันที่ดีเลย",
        "อนาคตที่ฉันอยากมีกับเธอ",
        "ทุกครั้งที่เธออยู่ข้างๆ",
        "ความสุขที่เราแบ่งปันกัน"
    ];

    // เริ่มต้นหน้า
    mainPage.style.display = 'flex';
    thankYouPage.style.display = 'none';
    loveLetterPage.style.display = 'none';
    slideshowPage.style.display = 'none';
    waitMessage.style.display = 'none';
    countdownMessage.style.display = 'none';
    birthdayPrompt.style.display = 'none';
    emailStatus.style.display = 'none';
    namePrompt.style.display = 'none';

    // ตรวจสอบปุ่มและเสียง
    if (!yesBtn || !noBtn || !confirmBtn || !nextBtn || !confirmNameBtn) {
        console.error('ไม่พบปุ่ม yes-btn, no-btn, confirm-btn, next-btn หรือ confirm-name-btn');
        return;
    }
    if (!noSound) {
        console.error('ไม่พบไฟล์เสียง no-sound');
    }

    // ปุ่ม "ไม่เป็น"
    noBtn.addEventListener('click', () => {
        console.log('กดปุ่ม ไม่เป็น');
        clickCount++;
        
        if (noSound) {
            noSound.currentTime = 0;
            noSound.play().then(() => {
                console.log('เล่นเสียง no-sound สำเร็จ');
            }).catch(error => {
                console.error('ข้อผิดพลาดในการเล่นเสียง no-sound: ', error);
            });
        }

        noBtn.style.transform = `scale(${1 - clickCount * 0.1})`;
        if (clickCount >= 5) {
            noBtn.style.opacity = '0';
            setTimeout(() => {
                noBtn.style.display = 'none';
            }, 500);
        }
    });

    // ฟังก์ชันดำเนินการเมื่อตอบวันเกิดถูก
    function proceedAfterCorrectAnswer() {
        mainPage.style.display = 'none';
        thankYouPage.style.display = 'flex';

        music.play().then(() => {
            console.log('เพลงเล่นสำเร็จ');
        }).catch(error => {
            console.error('ข้อผิดพลาดในการเล่นเพลง: ', error);
            emailStatus.textContent = 'เกิดข้อผิดพลาดในการเล่นเพลง: ' + error.message;
            emailStatus.className = 'email-status error';
            emailStatus.style.display = 'block';
        });

        console.log('เริ่มส่งอีเมล...');
        const params = {
            date: new Date().toLocaleString('th-TH')
        };
        emailjs.send('service_7c1i969', 'template_czki5u6', params)
            .then((response) => {
                console.log('ส่งอีเมลสำเร็จ!', response.status, response.text);
                emailStatus.textContent = 'ส่งอีเมลสำเร็จ';
                emailStatus.className = 'email-status success';
                emailStatus.style.display = 'block';
            })
            .catch((error) => {
                console.error('ข้อผิดพลาดในการส่งอีเมล: ', error);
                emailStatus.textContent = 'เกิดข้อผิดพลาดในการส่งอีเมล: ' + (error.text || error.message);
                emailStatus.className = 'email-status error';
                emailStatus.style.display = 'block';
            });

        setTimeout(() => {
            waitMessage.style.display = 'block';
            countdownMessage.style.display = 'block';
            console.log('แสดงข้อความ รอฟังเพลง และ รอ 5 วินาที');
        }, 500);

        setTimeout(() => {
            thankYouPage.style.display = 'none';
            loveLetterPage.style.display = 'flex';
            console.log('เปลี่ยนไป UI ที่ 3');
        }, 5500);
    }

    // ปุ่ม "เป็น"
    yesBtn.addEventListener('click', () => {
        console.log('กดปุ่ม เป็น');
        birthdayPrompt.style.display = 'block';
        birthdayInput.value = '';
        errorMessage.style.display = 'none';
        yesBtn.style.display = 'none';
        noBtn.style.display = 'none';
    });

    // ปุ่ม "ยืนยัน" (วันเกิด)
    confirmBtn.addEventListener('click', () => {
        const userAnswer = birthdayInput.value.trim();
        console.log('คำตอบที่กรอก: ', userAnswer);

        if (userAnswer === '09/11/2011') {
            console.log('คำตอบถูกต้อง!');
            birthdayPrompt.style.display = 'none';
            proceedAfterCorrectAnswer();
        } else {
            console.log('คำตอบผิด');
            errorMessage.style.display = 'block';
            birthdayInput.value = '';
        }
    });

    // ปุ่ม "ถัดไป" จาก UI 3
    nextBtn.addEventListener('click', () => {
        console.log('กดปุ่ม ถัดไป');
        namePrompt.style.display = 'block';
        nameInput.value = '';
        nameErrorMessage.style.display = 'none';
        nextBtn.style.display = 'none'; // ซ่อนปุ่ม "ถัดไป" เมื่อกล่องกรอกชื่อปรากฏ
    });

    // ปุ่ม "ยืนยัน" (ชื่อ)
    confirmNameBtn.addEventListener('click', () => {
        const userName = nameInput.value.trim();
        console.log('ชื่อที่กรอก: ', userName);

        if (userName === 'กิตติคุณ') {
            console.log('ชื่อถูกต้อง!');
            namePrompt.style.display = 'none';
            loveLetterPage.style.display = 'none';
            slideshowPage.style.display = 'flex';
            startSlideshow();
        } else {
            console.log('ชื่อผิด');
            nameErrorMessage.style.display = 'block';
            nameInput.value = '';
        }
    });

    // ฟังก์ชันสไลด์โชว์พร้อมข้อความ
    function startSlideshow() {
        const slides = document.querySelectorAll('.slide-image');
        let currentSlide = 0;

        function showNextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            slideCaption.textContent = captions[currentSlide];
        }

        slides.forEach(slide => slide.classList.remove('active'));
        slides[0].classList.add('active');
        slideCaption.textContent = captions[0];

        setInterval(showNextSlide, 3000);
    }
});