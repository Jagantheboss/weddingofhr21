document.addEventListener('DOMContentLoaded', () => {
    
    // --- Countdown Timer ---
    // Set for April 21, 2026 00:00:00
    const weddingDate = new Date('April 21, 2026 00:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- Scroll Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Background Music Toggle ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;

    let hasStarted = false;
    if(bgMusic) bgMusic.volume = 0.8; // Set higher volume

    // Play flawlessly upon ANY click on the website
    document.body.addEventListener('click', function() {
        if (!isPlaying && bgMusic) {
            if (!hasStarted) {
                // Skip the first 10 seconds on first play
                bgMusic.currentTime = 10;
                hasStarted = true;
            }
            let playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    musicToggle.classList.add('playing');
                    musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
                }).catch(error => {
                    console.log("Audio not ready yet");
                });
            }
        }
    });

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the body click from firing instantly
        if (!bgMusic) return;

        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
            isPlaying = false;
        } else {
            if (!hasStarted) {
                bgMusic.currentTime = 10;
                hasStarted = true;
            }
            bgMusic.play();
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
            isPlaying = true;
        }
    });

    // --- Floating Petals Animation ---
    const petalsContainer = document.getElementById('petalsContainer');
    const maxPetals = 20;
    
    function createPetal() {
        if (petalsContainer.childElementCount >= maxPetals) return;
        
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Randomize size, position, and duration
        const size = Math.random() * 10 + 5; // 5px to 15px
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}vw`;
        
        const duration = Math.random() * 5 + 5; // 5s to 10s
        petal.style.animationDuration = `${duration}s`;
        
        petalsContainer.appendChild(petal);
        
        // Remove petal after animation completes
        setTimeout(() => {
            petal.remove();
        }, duration * 1000);
    }

    // Create a new petal every 800ms
    setInterval(createPetal, 800);

    // --- Surprise Popup Message ---
    const popupWrapper = document.getElementById('popupMessage');
    const closePopupBtn = document.getElementById('closePopup');
    
    // Show popup after scrolling a bit or after some time
    let popupShown = false;
    window.addEventListener('scroll', () => {
        if (!popupShown && window.scrollY > 800) {
            setTimeout(() => {
                popupWrapper.classList.add('show');
            }, 500); // slight delay after reaching point
            popupShown = true;
        }

        // --- Watermark Logo Fade ---
        const watermarkLogo = document.querySelector('.watermark-logo');
        if (watermarkLogo) {
            if (window.scrollY > window.innerHeight * 0.5) {
                watermarkLogo.style.opacity = '0.1';
            } else {
                watermarkLogo.style.opacity = '0';
            }
        }
    });

    closePopupBtn.addEventListener('click', () => {
        popupWrapper.classList.remove('show');
    });

    // --- Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            if(imgSrc && !imgSrc.includes('placeholder')) {
                lightbox.style.display = "block";
                lightboxImg.src = imgSrc;
            }
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = "none";
    });

    // Close lightbox if clicked outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    // --- RSVP Form Submission Mock ---
    const rsvpForm = document.getElementById('rsvpForm');
    const formStatus = document.getElementById('formStatus');

    if(rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const attend = document.querySelector('input[name="attend"]:checked').value;
            
            formStatus.style.color = '#610c04';
            if(attend === 'yes') {
                formStatus.innerHTML = `Thank you, ${name}! We look forward to seeing you.`;
            } else {
                formStatus.innerHTML = `Thank you, ${name}. We will miss you!`;
            }
            
            // Allow reading message then reset
            setTimeout(() => {
                rsvpForm.reset();
                formStatus.innerHTML = '';
            }, 4000);
        });
    }

});
