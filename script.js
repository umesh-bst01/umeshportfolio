/* ============================================
   UMESH VERMA PORTFOLIO - 3D BIKE MODEL (CLEAN)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initializing...');
    initTypingEffect();
    initNavbar();
    initSmoothScrollAnimations();
    initSmoothScroll();
    hideSplineWatermark();

    // Gold holographic treatment for the 3D Bike (matches robot theme)
    const bikeViewer = document.getElementById('hero-bike');
    if (bikeViewer) {
        bikeViewer.addEventListener('load', () => {
            if (bikeViewer.model && bikeViewer.model.materials) {
                bikeViewer.model.materials.forEach(material => {
                    material.setAlphaMode('BLEND');
                    if (material.pbrMetallicRoughness) {
                        // Warm gold translucency - keeps the bike's shape visible
                        material.pbrMetallicRoughness.setBaseColorFactor([1.0, 0.78, 0.3, 0.16]);
                        material.pbrMetallicRoughness.setMetallicFactor(0.6);
                        material.pbrMetallicRoughness.setRoughnessFactor(0.15);
                    }
                });
            }
        });
    }
});

/* ============================================
   HIDE SPLINE WATERMARK
   ============================================ */
function hideSplineWatermark() {
    const viewer = document.querySelector('spline-viewer');
    if (!viewer) return;

    // CSS that beats the inline style.display="flex" set by the viewer's onLoaded
    const watermarkCSS = `
        #logo {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
            pointer-events: none !important;
            position: absolute !important;
            clip: rect(0,0,0,0) !important;
        }
    `;

    const injectAndRemove = () => {
        const shadow = viewer.shadowRoot;
        if (!shadow) return;

        // Inject style if not already present
        if (!shadow.querySelector('#hide-spline-wm')) {
            const style = document.createElement('style');
            style.id = 'hide-spline-wm';
            style.textContent = watermarkCSS;
            shadow.appendChild(style);
        }

        // Directly remove the logo element
        const logo = shadow.querySelector('#logo');
        if (logo) logo.remove();
    };

    // Run after the viewer fires its load-complete event (when it sets display:flex)
    viewer.addEventListener('load-complete', () => {
        // Small delay to ensure the viewer's onLoaded has finished setting display:flex
        setTimeout(injectAndRemove, 100);
        setTimeout(injectAndRemove, 500);
        setTimeout(injectAndRemove, 1500);
    });

    // Also try immediately and with polling in case load-complete already fired
    injectAndRemove();
    let attempts = 0;
    const poll = setInterval(() => {
        injectAndRemove();
        if (++attempts >= 30) clearInterval(poll);
    }, 500);

    // Observe shadow DOM for late mutations (viewer may re-add the logo)
    const observeShadow = () => {
        const shadow = viewer.shadowRoot;
        if (!shadow) return;
        const observer = new MutationObserver(() => injectAndRemove());
        observer.observe(shadow, { childList: true, subtree: true, attributes: true });
        setTimeout(() => observer.disconnect(), 20000);
    };
    observeShadow();
    setTimeout(observeShadow, 2000);
}

/* ============================================
   GSAP SMOOTH SCROLL ANIMATIONS
   ============================================ */
function initSmoothScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.defaults({
        toggleActions: "play none none reverse",
        start: "top 85%"
    });

    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: { trigger: header }
            }
        );
    });

    gsap.fromTo(".about-img-wrapper",
        { x: -60, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: "#about", start: "top 75%" }
        }
    );

    gsap.fromTo(".about-text",
        { x: 60, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.15,
            scrollTrigger: { trigger: "#about", start: "top 75%" }
        }
    );

    gsap.fromTo(".skill-category",
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.15,
            scrollTrigger: { trigger: "#skills", start: "top 75%" }
        }
    );

    gsap.fromTo(".project-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
            y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power2.out", stagger: 0.12,
            scrollTrigger: { trigger: "#projects", start: "top 75%" }
        }
    );

    gsap.fromTo(".contact-card",
        { y: 30, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1,
            scrollTrigger: { trigger: "#contact", start: "top 80%" }
        }
    );
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;

    const titles = ['AI Engineer', 'AI & Full-Stack Engineer', 'Problem Solver', 'Tech Explorer'];
    let titleIndex = 0, charIndex = 0, isDeleting = false, speed = 100;

    function type() {
        const current = titles[titleIndex];

        if (isDeleting) {
            typedText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            speed = 50;
        } else {
            typedText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 800);
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    });

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('active');
            });
        });
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id);
            if (el) {
                const offset = 70;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}
