/* 
===============================================
MASTER SCRIPT
Theme: Supreme Speciality Hospitals Premium
===============================================
*/

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================
       1. INTERSECTION OBSERVER (SCROLL ANIMATIONS)
    ========================================== */
    if (prefersReducedMotion) {
        document
            .querySelectorAll('.fade-up, .zoom-in, [data-aos]')
            .forEach(el => {
                el.classList.add('active');
                el.classList.add('aos-animate');
            });
    } else {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.add('aos-animate'); // Support for elite anims
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.fade-up, .zoom-in, .flip-card, .service-glow-card, .benefit-card, .service-dept-card, .feature-strip, [data-aos]');
    animateElements.forEach(el => observer.observe(el));
    }

    /* ==========================================
       2. SCROLLER DUPLICATION (INFINITE LOOP)
    ========================================== */
    const scrollers = document.querySelectorAll('.scroller-inner');
    scrollers.forEach(scroller => {
        const scrollerContent = Array.from(scroller.children);
        scrollerContent.forEach(item => {
            const duplication = item.cloneNode(true);
            duplication.setAttribute('aria-hidden', true);
            scroller.appendChild(duplication);
        });
    });

    /* ==========================================
       3. SWIPER CAROUSELS INITIALIZATION
    ========================================== */
    if(document.querySelector('.hero-swiper')) {
        new Swiper('.hero-swiper', {
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1000
        });
    }

    if(document.querySelector('.swiper-doctors')) {
        const docSwiper = new Swiper('.swiper-doctors', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            speed: 5000,
            allowTouchMove: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            breakpoints: {
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1400: { slidesPerView: 4 }
            }
        });

        const docContainer = document.querySelector('.swiper-doctors');
        if (docContainer) {
            docContainer.addEventListener('mouseenter', () => {
                const currentTranslate = docSwiper.getTranslate();
                docSwiper.setTransition(0);
                docSwiper.setTranslate(currentTranslate);
                docSwiper.autoplay.stop();
                docContainer.classList.add('is-paused');
            });

            docContainer.addEventListener('mouseleave', () => {
                docContainer.classList.remove('is-paused');
                docSwiper.autoplay.start();
            });
        }
    }
    if(document.querySelector('.swiper-consultants')) {
        new Swiper('.swiper-consultants', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: false,
            autoplay: false,
            breakpoints: {
                576: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 }
            }
        });
    }


    /* ==========================================
       3. FAQ ACCORDION LOGIC (Global)
    ========================================== */
    document.addEventListener('click', function(e) {
        if (e.target.closest('.accordion-header')) {
            const header = e.target.closest('.accordion-header');
            const item = header.closest('.accordion-item');
            const activeHeader = document.querySelector('.accordion-header.active');
            
            if (activeHeader && activeHeader !== header) {
                const activeItem = activeHeader.closest('.accordion-item');
                activeHeader.classList.remove('active');
                if (activeItem) activeItem.classList.remove('active');
                const activeContent = activeHeader.nextElementSibling;
                if (activeContent) {
                    activeContent.style.maxHeight = "0px";
                }
            }

            const content = header.nextElementSibling;
            if (content) {
                const isOpen = header.classList.contains('active');
                if (isOpen) {
                    header.classList.remove('active');
                    if (item) item.classList.remove('active');
                    content.style.maxHeight = "0px";
                    return;
                }

                // Open current
                header.classList.add('active');
                if (item) item.classList.add('active'); // supports CSS patterns that depend on .accordion-item.active
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }
    });

});

/* ==========================================
   MODAL LOGIC (Global Functions)
========================================== */
function openModal() {
    const modal = document.getElementById('appointment-modal');
    if(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}



function closeModal() {
    const modal = document.getElementById('appointment-modal');
    if(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('appointment-modal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Function to refresh observer for dynamically added or separate page elements
function observeAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.fade-up, .zoom-in').forEach(el => el.classList.add('active'));
        return;
    }

    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.fade-up:not(.active), .zoom-in:not(.active)');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize animations on load
window.addEventListener('load', observeAnimations);

/* ==========================================
   HEALTH CHECK LEAD FORM HANDLER
========================================== */
document.addEventListener('submit', function(e) {
    if (e.target.id === 'hc-lead-form') {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            form.innerHTML = `
                <div class="text-center py-4 fade-up active">
                    <div class="icon-box-circle mb-3" style="width: 80px; height: 80px; background: #e8f5e9; color: #2ecc71; margin: 0 auto; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 2rem;">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3 style="color: #00458b;">Thank You!</h3>
                    <p class="text-muted">Your health check-up inquiry has been received. Our wellness coordinator will contact you shortly.</p>
                </div>
            `;
        }, 1500);
    }
});

/* ==========================================
   GALLERY PAGE LOGIC
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Gallery Filtering
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if(filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hide');
                        // re-trigger animation simply by removing and adding class if needed, or rely on CSS transition
                    } else {
                        item.classList.add('hide');
                    }
                });
            });
        });
    }

    // Gallery Modal (Lightbox)
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryExpandedImg');
    const closeBtn = document.querySelector('.gallery-modal-close');
    const wrappers = document.querySelectorAll('.gallery-img-wrapper');

    if(modal && wrappers.length > 0) {
        wrappers.forEach(wrapper => {
            wrapper.addEventListener('click', function() {
                const img = this.querySelector('img');
                if(img) {
                    modal.style.display = "block";
                    modalImg.src = img.src;
                }
            });
        });

        if(closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = "none";
            });
        }

        // Close on outside click
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});
