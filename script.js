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
        
        // Coba mainkan audio, tangani error jika browser memblokir
        audio.play().catch(error => {
            console.log("Autoplay was prevented by the browser. User interaction is needed.");
        });
        
        // Set state visual tombol musik
        if (!audio.paused) {
            musicControl.classList.add('playing');
            musicControl.innerHTML = '<i class="fa-solid fa-music"></i>';
        } else {
            musicControl.classList.remove('playing');
            musicControl.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
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

    // --- 3. Theme Toggle ---
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.innerHTML = document.body.classList.contains('dark-mode')
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
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

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }, 1000);

    // --- 5. [BARU] Scroll Animation Logic ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan delay berdasarkan atribut data-delay
                const delay = entry.target.dataset.delay || '0';
                entry.target.style.animation = `fadeInUp 0.8s ${delay}s both`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Terapkan observer ke semua elemen .animated-section
    document.querySelectorAll('.animated-section').forEach((section, index) => {
        // Beri delay bertahap untuk setiap section utama
        section.dataset.delay = index * 0.1;
        observer.observe(section);
    });

    // --- 6. Guestbook & RSVP Logic ---
    const form = document.getElementById('guestbook-form');
    const wishesList = document.getElementById('wishes-list');
    const submitWishBtn = document.getElementById('submit-wish-btn');
    const storageKey = 'weddingWishes_FulanFulanah_v3'; // Versi baru

    function loadWishes() {
        const wishes = JSON.parse(localStorage.getItem(storageKey)) || [];
        wishesList.innerHTML = '';
        wishes.forEach(wish => addWishToDOM(wish));
    }

    function saveWish(newWish) {
        const wishes = JSON.parse(localStorage.getItem(storageKey)) || [];
        wishes.unshift(newWish);
        localStorage.setItem(storageKey, JSON.stringify(wishes));
    }
    
    function addWishToDOM(wish, isNew = false) {
        const wishCard = document.createElement('div');
        wishCard.className = 'wish-card';
        
        const rsvpText = wish.rsvp === 'attending' ? 'Hadir' : 'Tidak Hadir';
        const rsvpClass = wish.rsvp === 'attending' ? 'attending' : 'not-attending';
        
        wishCard.innerHTML = `
            <div class="sender-info">
                <p class="sender-name">${escapeHTML(wish.name)}</p>
                <span class="rsvp-status ${rsvpClass}">${rsvpText}</span>
            </div>
            <p class="message-text">${escapeHTML(wish.message)}</p>
        `;
        
        if (isNew) {
            wishesList.prepend(wishCard);
        } else {
            wishesList.appendChild(wishCard);
        }
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

        const newWish = {
            name: guestNameInput.value.trim(),
            message: guestMessageInput.value.trim(),
            rsvp: rsvpInput ? rsvpInput.value : null,
            date: new Date().toISOString()
        };

        if (newWish.name && newWish.message && newWish.rsvp) {
            submitWishBtn.disabled = true;
            submitWishBtn.textContent = 'Mengirim...';
            
            setTimeout(() => {
                addWishToDOM(newWish, true);
                saveWish(newWish);
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

    // --- 7. Toast & Clipboard Logic ---
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

    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetSelector = button.dataset.clipboardTarget;
            const textToCopy = document.querySelector(targetSelector).innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Nomor rekening berhasil disalin!');
            }).catch(err => showToast('Gagal menyalin.', 'error'));
        });
    });
    
    // --- 8. Photo Gallery Logic ---
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const closeModal = document.querySelector('.modal-close');
    
    document.querySelectorAll('.gallery-item').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
        });
    });
    
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { 
        if (event.target == modal) modal.style.display = "none"; 
    }
});
