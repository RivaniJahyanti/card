document.addEventListener('DOMContentLoaded', function() {
    // --- Element Selections ---
    const coverPage = document.getElementById('cover-page');
    const openButton = document.getElementById('open-invitation-btn');
    const mainContent = document.querySelector('.card');
    const audio = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const themeToggle = document.getElementById('theme-toggle');

    // --- 0. Initial Setup ---
    const leafContainer = document.getElementById('leaf-container');
    if (leafContainer) {
        for (let i = 0; i < 15; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDelay = `${Math.random() * 10}s`;
            leaf.style.animationDuration = `${5 + Math.random() * 10}s`;
            leaf.style.opacity = Math.random();
            leafContainer.appendChild(leaf);
        }
    }

    // --- 1. Guest Name Personalization ---
    const guestNameDisplay = document.getElementById('guest-name-display');
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        guestNameDisplay.textContent = guestName.replace(/[+]/g, ' ');
    }

    // --- 2. Cover & Music Logic ---
    openButton.addEventListener('click', function() {
        coverPage.classList.add('hidden');
        mainContent.classList.add('visible');
        document.body.style.overflowY = 'auto';
        audio.play().catch(error => console.log("Autoplay was prevented by the browser."));
        musicControl.classList.add('playing');
    });

    musicControl.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            musicControl.classList.add('playing');
            musicControl.innerHTML = '<i class="fa-solid fa-music"></i>';
        } else {
            audio.pause();
            musicControl.classList.remove('playing');
            musicControl.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });

    // --- 3. Theme Toggle (Dark/Light Mode) ---
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if(document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });

    // --- 4. Countdown Timer Logic ---
    const countdownDate = new Date("Dec 21, 2025 09:00:00").getTime();
    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("countdown").innerHTML = "<h4>Acara Telah Berlangsung</h4>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    // --- 5. Scroll Animation Logic ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate general sections
    document.querySelectorAll('.animated-section').forEach(section => observer.observe(section));
    
    // Animate timeline items individually
    const timelineObserver = new IntersectionObserver((entries, observer) => {
         entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a staggered delay based on the item's index
                entry.target.style.transitionDelay = `${index * 150}ms`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the item is visible

    document.querySelectorAll('.timeline-item').forEach(item => timelineObserver.observe(item));


    // --- 6. Guestbook & RSVP Logic ---
    const form = document.getElementById('guestbook-form');
    const wishesList = document.getElementById('wishes-list');
    const submitWishBtn = document.getElementById('submit-wish-btn');
    const storageKey = 'weddingWishes_FulanFulanah_v2';

    function loadWishes() {
        const wishes = JSON.parse(localStorage.getItem(storageKey)) || [];
        wishesList.innerHTML = '';
        wishes.forEach(wish => addWishToDOM(wish.name, wish.message, wish.rsvp, false));
    }

    function saveWish(name, message, rsvp) {
        const wishes = JSON.parse(localStorage.getItem(storageKey)) || [];
        wishes.unshift({ name, message, rsvp, date: new Date().toISOString() });
        localStorage.setItem(storageKey, JSON.stringify(wishes));
    }
    
    function addWishToDOM(name, message, rsvp, isNew) {
        const wishCard = document.createElement('div');
        wishCard.className = 'wish-card';
        const rsvpText = rsvp === 'attending' ? 'Hadir' : 'Tidak Hadir';
        const rsvpClass = rsvp === 'attending' ? 'attending' : 'not-attending';
        
        wishCard.innerHTML = `
            <div class="sender-info">
                <p class="sender-name">${escapeHTML(name)}</p>
                <span class="rsvp-status ${rsvpClass}">${rsvpText}</span>
            </div>
            <p class="message-text">${escapeHTML(message)}</p>
        `;
        
        if (isNew) { wishesList.prepend(wishCard); }
        else { wishesList.appendChild(wishCard); }
    }

    function escapeHTML(str) {
        const p = document.createElement("p");
        p.textContent = str;
        return p.innerHTML;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const guestNameInput = document.getElementById('guest-name');
        const guestMessageInput = document.getElementById('guest-message');
        const rsvpInput = document.querySelector('input[name="rsvp"]:checked');

        const name = guestNameInput.value.trim();
        const message = guestMessageInput.value.trim();
        const rsvp = rsvpInput ? rsvpInput.value : null;

        if (name && message && rsvp) {
            submitWishBtn.disabled = true;
            submitWishBtn.textContent = 'Mengirim...';
            setTimeout(() => {
                addWishToDOM(name, message, rsvp, true);
                saveWish(name, message, rsvp);
                form.reset();
                submitWishBtn.disabled = false;
                submitWishBtn.textContent = 'Kirim Ucapan';
                showToast('Ucapan Anda berhasil dikirim!');
            }, 1000);
        } else {
            showToast('Mohon lengkapi semua isian.', 'error');
        }
    });

    loadWishes();

    // --- 7. Toast Notification ---
    const toast = document.getElementById('toast-notification');
    let toastTimer;
    function showToast(message, type = 'success') {
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.style.backgroundColor = type === 'error' ? '#c94c4c' : 'var(--color-dark)';
        toast.classList.add('show');
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- 8. Copy to Clipboard Logic ---
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSelector = button.dataset.clipboardTarget;
            const textToCopy = document.querySelector(targetSelector).innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Nomor rekening berhasil disalin!');
            }).catch(err => showToast('Gagal menyalin.', 'error'));
        });
    });
    
    // --- 9. Photo Gallery Logic ---
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const galleryImages = document.querySelectorAll('.gallery-item');
    const closeModal = document.querySelector('.modal-close');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
        });
    });
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }
});
