/**
 * Karmuhil P - Portfolio Website Logic
 * Includes:
 * 1. Mobile Navigation Menu
 * 2. Active Link Highlighting on Scroll
 * 3. Typed/Rotated Subtitle Effect
 * 4. Neural-Network Particle Background
 * 5. Dynamic Card Cursor Glow Effect
 * 6. Scroll Reveal Intersection Observer
 * 7. Skills Progress Bar Activation
 * 8. Project Category Filtering
 * 9. Project Detail Modals
 * 10. Contact Form Handler & Client-side Validation
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILE NAVIGATION MENU
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       2. ACTIVE LINK HIGHLIGHT & SCROLL NAVBAR EFFECT
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');

    const handleScrollEffects = () => {
        const scrollPosition = window.scrollY;

        // Navbar blur/shrink styling on scroll
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Trigger once on mount

    /* ==========================================================================
       3. TYPED/ROTATED SUBTITLE EFFECT
       ========================================================================== */
    const TxtRotate = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtRotate.prototype.tick = function() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        const that = this;
        let delta = 150 - Math.random() * 80; // Speed of typing

        if (this.isDeleting) { delta /= 2; } // Deleting goes faster

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period; // Pause at end of word
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500; // Pause before typing next word
        }

        setTimeout(function() {
            that.tick();
        }, delta);
    };

    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    /* ==========================================================================
       4. NEURAL-NETWORK PARTICLE BACKGROUND
       ========================================================================== */
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Set particle density based on screen width (optimized for performance)
    const getParticleCount = () => {
        return window.innerWidth < 768 ? 40 : 85;
    };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6; // Speed limit
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1.5;
            this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)';
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Move particle
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Interactive mouse repulsion/pull
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    // Soft push away from mouse cursor
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= dx / distance * force * 1.2;
                    this.y -= dy / distance * force * 1.2;
                }
            }

            this.draw();
        }
    }

    const initParticles = () => {
        particles = [];
        const count = getParticleCount();
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    };

    const connectParticles = () => {
        const maxDist = 130;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    // Line opacity decreases as distance increases
                    let alpha = (1 - dist / maxDist) * 0.12;
                    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }

            // Also connect to mouse cursor
            if (mouse.x !== null && mouse.y !== null) {
                let dx = particles[a].x - mouse.x;
                let dy = particles[a].y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let alpha = (1 - dist / mouse.radius) * 0.2;
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        connectParticles();
        requestAnimationFrame(animateParticles);
    };

    // Listeners for particle interactivity
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Initialize Canvas
    resizeCanvas();
    animateParticles();

    /* ==========================================================================
       5. DYNAMIC CARD CURSOR GLOW EFFECT
       ========================================================================== */
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside card
            const y = e.clientY - rect.top;  // y position inside card
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ==========================================================================
       6. SCROLL REVEAL INTERSECTION OBSERVER
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters view
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       7. SKILLS PROGRESS BAR ACTIVATION
       ========================================================================== */
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress-bar');

    if (skillsSection && progressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => {
                        // Apply CSS scaling trigger
                        bar.style.transform = 'scaleX(1)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       8. PROJECT CATEGORY FILTERING
       ========================================================================== */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab styling
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    // Show item
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item with transition
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350); // Matches animation speed
                }
            });
        });
    });

    /* ==========================================================================
       9. PROJECT DETAIL MODALS
       ========================================================================== */
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const projectModals = document.querySelectorAll('.project-modal');

    const openModal = (modalId) => {
        const targetModal = document.getElementById(modalId);
        if (targetModal && modalOverlay) {
            modalOverlay.classList.add('active');
            targetModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        }
    };

    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
        projectModals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = ''; // Resume background scrolling
    };

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    /* ==========================================================================
       10. CONTACT FORM HANDLER & VALIDATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit');
    const submitBtnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous statuses
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            const nameInput = document.getElementById('name').value.trim();
            const emailInput = document.getElementById('email').value.trim();
            const subjectInput = document.getElementById('subject').value.trim();
            const messageInput = document.getElementById('message').value.trim();

            // Simple validation check
            if (!nameInput || !emailInput || !subjectInput || !messageInput) {
                formStatus.classList.add('error');
                formStatus.textContent = 'Please fill out all fields.';
                return;
            }

            // Emulate sending stage
            formStatus.classList.add('sending');
            formStatus.textContent = 'Sending message...';
            
            if (submitBtn) submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.textContent = 'Sending...';

            setTimeout(() => {
                // Emulate successful post
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully! Thank you.';
                
                // Clear inputs
                contactForm.reset();

                // Re-enable button
                if (submitBtn) submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.textContent = 'Send Message';
            }, 1800);
        });
    }

});
