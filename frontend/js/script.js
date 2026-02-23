// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {

        // Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            if (!particlesContainer) return; // Skip if container doesn't exist
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const size = Math.random() * 100 + 50;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particle.style.animationDelay = (Math.random() * 5) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('nav');
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(10, 44, 78, 0.98)';
            } else {
                nav.style.background = 'rgba(10, 44, 78, 0.95)';
            }
        });

        // Initialize particles
        createParticles();

        // ═══════════════════════════════════════════════════════════
        // ENHANCED HERO SECTION INTERACTIVITY
        // ═══════════════════════════════════════════════════════════
        
        // Parallax effect on scroll
        const heroSection = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        const particles = document.getElementById('particles');
        
        if (heroSection) {
            window.addEventListener('scroll', debounce(function() {
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight;
                
                if (scrollY < viewportHeight) {
                    // Parallax effect for content elements
                    if (heroContent) {
                        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                    }
                    
                    if (heroImage) {
                        heroImage.style.transform = `translateY(${scrollY * 0.4}px)`;
                    }
                    
                    if (particles) {
                        particles.style.transform = `translateY(${scrollY * 0.5}px)`;
                    }
                }
            }, 10));
        }
        
        // Mouse tracking effect on hero image
        if (heroImage) {
            heroImage.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                this.style.transform = `perspective(1200px) rotateX(${y * 5}deg) rotateY(${x * 5}deg) scale(1.02)`;
            });
            
            heroImage.addEventListener('mouseleave', function() {
                this.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)`;
            });
        }
        
        // Enhanced button interactions
        document.querySelectorAll('.hero-buttons .btn').forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.position = 'absolute';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.width = '10px';
                ripple.style.height = '10px';
                ripple.style.background = 'rgba(255, 255, 255, 0.8)';
                ripple.style.borderRadius = '50%';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'ripple 0.7s ease-out';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 700);
            });
            
            // Add glow effect on hover
            button.addEventListener('mouseenter', function() {
                this.style.boxShadow = `0 0 20px ${this.classList.contains('btn-primary') ? 'rgba(255, 122, 24, 0.6)' : 'rgba(255, 255, 255, 0.2)'}`;
            });
            
            button.addEventListener('mouseleave', function() {
                if (this.classList.contains('btn-primary')) {
                    this.style.boxShadow = '0 12px 30px rgba(255, 122, 24, 0.5)';
                } else {
                    this.style.boxShadow = '0 12px 30px rgba(255, 255, 255, 0.15)';
                }
            });
        });
        
        // Animated stat counters with better formatting
        function animateStats() {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.innerText;
                let target = 0;
                
                if (text.includes('K')) {
                    target = parseInt(text) * 1000;
                } else if (text.includes('%')) {
                    target = parseInt(text);
                } else {
                    target = parseInt(text.replace('+', ''));
                }
                
                const originalText = stat.innerText;
                let current = 0;
                const increment = target / 40;
                const decimals = text.includes('.') ? 1 : 0;
                
                stat.style.animation = 'none';
                
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.innerText = originalText;
                        clearInterval(counter);
                    } else {
                        if (originalText.includes('K')) {
                            stat.innerText = Math.floor(current / 1000) + 'K+';
                        } else if (originalText.includes('%')) {
                            stat.innerText = Math.floor(current) + '%';
                        } else {
                            stat.innerText = Math.floor(current) + '+';
                        }
                    }
                }, 25);
            });
        }
        
        // Stats counter with staggered animation
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        animateStats();
                        
                        // Stagger stat items animation
                        const statItems = entry.target.querySelectorAll('.stat-item');
                        statItems.forEach((item, index) => {
                            item.style.animation = 'none';
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                item.style.animation = `fadeInUp 0.6s ease-out forwards`;
                            }, index * 100);
                        });
                        
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            statsObserver.observe(heroStats);
        }
        
        // Hero container tilt effect
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer && window.innerWidth > 992) {
            heroContainer.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const rotateX = (y - rect.height / 2) * 0.05;
                const rotateY = (rect.width / 2 - x) * 0.05;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            heroContainer.addEventListener('mouseleave', function() {
                this.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            });
        }

        // Back to top button functionality
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });

            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Active navigation link highlighting
        function highlightActiveLink() {
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            const currentUrl = window.location.pathname;
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (currentUrl.includes(href) || (currentUrl.endsWith('/') && href === 'index.html')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
        
        highlightActiveLink();

        // Intersection Observer for card animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.quick-card, .school-card, .ej-card, .testimonial-card').forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s';
            observer.observe(el);
        });

        // --- Agents page behaviors (migrated from inline agents.html script) ---
        function debounce(fn, wait) {
            let t;
            return function (...args) {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), wait);
            };
        }

        function generatePromoCode() {
            const names = ['JOHN', 'MARY', 'PETER', 'SUSAN', 'JAMES', 'SARAH', 'DAVID', 'GRACE', 'MICHAEL', 'LUCY'];
            const numbers = Math.floor(Math.random() * 90 + 10).toString();
            const randomName = names[Math.floor(Math.random() * names.length)];
            const el = document.getElementById('randomCode');
            if (el) el.textContent = randomName + numbers;
        }

        function copyPromoCode() {
            const promoEl = document.getElementById('promoCode');
            if (!promoEl) return;
            const promoText = promoEl.innerText;
            navigator.clipboard.writeText(promoText).then(() => {
                alert('Promo code copied to clipboard!');
            }).catch(() => {
                alert('Unable to copy promo code.');
            });
        }

        function scrollToForm() {
            const form = document.getElementById('agentRegistrationForm');
            if (form) form.scrollIntoView({ behavior: 'smooth' });
        }

        function filterAgents() {
            const q = (document.getElementById('agentSearch')?.value || '').toLowerCase().trim();
            const region = (document.getElementById('regionFilter')?.value || '').toLowerCase().trim();

            // Filter referral tracking table rows
            document.querySelectorAll('.table-container table tbody tr').forEach(row => {
                const text = row.innerText.toLowerCase();
                const matchesQuery = q === '' || text.includes(q);
                const matchesRegion = region === '' || text.includes(region);
                row.style.display = (matchesQuery && matchesRegion) ? '' : 'none';
            });

            // Filter leaderboard items
            document.querySelectorAll('.leaderboard-item').forEach(item => {
                const text = item.innerText.toLowerCase();
                const matchesQuery = q === '' || text.includes(q);
                const matchesRegion = region === '' || text.includes(region);
                item.style.display = (matchesQuery && matchesRegion) ? '' : 'none';
            });
        }

        // Initialize promo code and click-to-copy
        generatePromoCode();
        const promoDisplay = document.querySelector('.promo-code-display');
        if (promoDisplay) promoDisplay.addEventListener('click', copyPromoCode);

        // Registration form handler
        const regForm = document.getElementById('agentRegistrationForm');
        if (regForm) {
            regForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alert('Thank you for registering! Our team will review your application and contact you within 2-3 business days.');
                generatePromoCode();
                this.reset();
            });
        }

        // Search and filter hooks
        const search = document.getElementById('agentSearch');
        const region = document.getElementById('regionFilter');
        const clearBtn = document.getElementById('clearFilters');
        if (search) search.addEventListener('input', debounce(filterAgents, 220));
        if (region) region.addEventListener('change', filterAgents);
        if (clearBtn) clearBtn.addEventListener('click', () => {
            if (search) search.value = '';
            if (region) region.value = '';
            filterAgents();
        });

        // Make promo code copy accessible via keyboard
        if (promoDisplay) {
            promoDisplay.setAttribute('tabindex', '0');
            promoDisplay.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') copyPromoCode();
            });
        }

        // Form validation for login forms
        document.querySelectorAll('#loginForm').forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.value.trim() === '') {
                        this.classList.add('is-invalid');
                    } else {
                        this.classList.remove('is-invalid');
                    }
                });
                input.addEventListener('input', function() {
                    if (this.value.trim() !== '') {
                        this.classList.remove('is-invalid');
                        this.classList.add('is-valid');
                    }
                });
            });
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                let isValid = true;
                inputs.forEach(input => {
                    if (input.value.trim() === '') {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                });
                if (isValid) {
                    alert('Login successful!');
                    form.reset();
                    inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
                }
            });
        });

        // Contact form validation
        document.querySelectorAll('form[name="contactForm"], #contactForm').forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.value.trim() === '') {
                        this.classList.add('is-invalid');
                    } else {
                        this.classList.remove('is-invalid');
                    }
                });
                input.addEventListener('input', function() {
                    if (this.value.trim() !== '') {
                        this.classList.remove('is-invalid');
                        this.classList.add('is-valid');
                    }
                });
            });
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                let isValid = true;
                inputs.forEach(input => {
                    if (input.value.trim() === '') {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                });
                if (isValid) {
                    alert('Thank you! Your message has been sent successfully.');
                    form.reset();
                    inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
                }
            });
        });

        // Modal animation effects
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('show.bs.modal', function() {
                this.querySelector('.modal-content').style.animation = 'slideIn 0.3s ease-out';
            });
        });

        // Button ripple effect on click
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.width = '10px';
                ripple.style.height = '10px';
                ripple.style.background = 'rgba(255,255,255,0.6)';
                ripple.style.borderRadius = '50%';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'ripple 0.6s ease-out';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Scroll spy for active sections
        const scrollSpySections = document.querySelectorAll('[data-spy-section]');
        if (scrollSpySections.length > 0) {
            window.addEventListener('scroll', debounce(function() {
                scrollSpySections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const navLink = document.querySelector(`a[href="#${section.id}"]`);
                    if (navLink && rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                        document.querySelectorAll('[data-spy-section]').forEach(s => {
                            document.querySelector(`a[href="#${s.id}"]`)?.classList.remove('active');
                        });
                        navLink.classList.add('active');
                    }
                });
            }, 150));
        }

        // Keyboard navigation - Escape key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.show');
                modals.forEach(modal => {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) bsModal.hide();
                });
            }
        });

        // Improve focus visibility for accessibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });

        // Add focus styling for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            body.keyboard-nav *:focus {
                outline: 2px solid var(--accent) !important;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);

        // ═══════════════════════════════════════════════════════════
        // LEADERSHIP TEAM CARDS INTERACTIVITY
        // ═══════════════════════════════════════════════════════════
        
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach((card, index) => {
            // Add fade-in animation on scroll
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            cardObserver.observe(card);
            
            // Add hover tilt effect
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                const rotateX = y * 8;
                const rotateY = x * -8;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
        
        // Animate social media icons on card hover
        teamCards.forEach(card => {
            const socialLinks = card.querySelectorAll('.team-card-social a');
            
            card.addEventListener('mouseenter', function() {
                socialLinks.forEach((link, index) => {
                    link.style.animation = `none`;
                    setTimeout(() => {
                        link.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s forwards`;
                    }, 10);
                });
            });
        });
        
        // Add tooltip on social link hover
        document.querySelectorAll('.team-card-social a').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.15)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Keyboard navigation for team cards
        teamCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            card.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--accent)';
                this.style.outlineOffset = '4px';
            });
            
            card.addEventListener('blur', function() {
                this.style.outline = 'none';
            });
        });

        // ═══════════════════════════════════════════════════════════
        // CONTACT FORM & MAP INTERACTIVITY
        // ═══════════════════════════════════════════════════════════
        
        const contactForm = document.getElementById('contactForm');
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const subjectInput = document.getElementById('contactSubject');
        const messageInput = document.getElementById('contactMessage');
        const submitBtn = document.getElementById('contactSubmit');
        const msgCounter = document.getElementById('msgCounter');
        const contactResponse = document.getElementById('contactResponse');
        
        // Message counter
        if (messageInput && msgCounter) {
            messageInput.addEventListener('input', function() {
                const count = this.value.length;
                msgCounter.textContent = count + '/800';
                msgCounter.style.color = count > 600 ? 'var(--accent)' : '#999';
            });
        }
        
        // Form validation
        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
        
        function checkFormValidity() {
            const isValid = nameInput && emailInput && messageInput && 
                         nameInput.value.trim() !== '' &&
                         emailInput.value.trim() !== '' &&
                         validateEmail(emailInput.value) &&
                         messageInput.value.trim() !== '';
            
            if (submitBtn) {
                submitBtn.disabled = !isValid;
            }
            return isValid;
        }
        
        // Real-time validation
        if (nameInput) nameInput.addEventListener('input', checkFormValidity);
        if (emailInput) emailInput.addEventListener('input', checkFormValidity);
        if (subjectInput) subjectInput.addEventListener('input', checkFormValidity);
        if (messageInput) messageInput.addEventListener('input', checkFormValidity);
        
        // Form submission
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!checkFormValidity()) return;
                
                // Disable button and show loading
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }
                
                // Simulate form submission
                setTimeout(() => {
                    if (contactResponse) {
                        contactResponse.classList.remove('error');
                        contactResponse.classList.add('success');
                        contactResponse.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                        contactResponse.style.display = 'block';
                    }
                    
                    // Reset form
                    contactForm.reset();
                    msgCounter.textContent = '0/800';
                    
                    // Reset button
                    if (submitBtn) {
                        submitBtn.textContent = 'Send Message';
                        submitBtn.disabled = true;
                    }
                    
                    // Clear response message after 5 seconds
                    setTimeout(() => {
                        if (contactResponse) {
                            contactResponse.style.display = 'none';
                        }
                    }, 5000);
                }, 1500);
            });
        }
        
        // Contact info cards animation on hover
        document.querySelectorAll('.contact-info-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s ease-out';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            cardObserver.observe(card);
        });
        
        // Map section animation
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            const mapObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'slideInUp 0.8s ease-out';
                        mapObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            mapObserver.observe(mapContainer);
        }
        
        // Subscribe form
        const subscribeForm = document.getElementById('subscribeForm');
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                
                if (emailInput && validateEmail(emailInput.value)) {
                    const btn = this.querySelector('button');
                    const originalText = btn.textContent;
                    
                    btn.disabled = true;
                    btn.textContent = 'Subscribing...';
                    
                    setTimeout(() => {
                        btn.textContent = 'Subscribed!';
                        btn.style.opacity = '0.8';
                        emailInput.value = '';
                        
                        setTimeout(() => {
                            btn.disabled = false;
                            btn.textContent = originalText;
                            btn.style.opacity = '1';
                        }, 2000);
                    }, 1000);
                }
            });
        }

}); // End of DOMContentLoaded

// Dynamic School Filtering (Refined)
let schools = []; // Will be populated from your HTML structure

function initializeSchoolData() {
    schools = Array.from(document.querySelectorAll('.school-card')).map(card => ({
        element: card,
        category: card.dataset.category,
        name: card.dataset.name.toLowerCase(),
        region: card.dataset.region.toLowerCase()
    }));
    populateCategoryDropdown();
    filterSchools(); // Initial filter to show all
}

function populateCategoryDropdown() {
    const categories = [...new Set(schools.map(s => s.category))];
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`).join('');
}

function filterSchools() {
    const category = document.getElementById('categoryDropdown').value.toLowerCase();
    const searchTerm = document.getElementById('searchSchools').value.toLowerCase();

    let visibleCount = 0;
    schools.forEach(school => {
        const matchesCategory = !category || school.category === category;
        const matchesSearch = !searchTerm || school.name.includes(searchTerm) || school.region.includes(searchTerm);
        const isVisible = matchesCategory && matchesSearch;
        school.element.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });

    const resultsSpan = document.getElementById('resultsCount');
    const noSchoolsDiv = document.getElementById('noSchoolsMessage');

    if (visibleCount === 0) {
        noSchoolsDiv.style.display = 'block';
        resultsSpan.innerHTML = `<i class="fas fa-times-circle me-1" style="color: #ff3b30;"></i>No schools found`;
    } else {
        noSchoolsDiv.style.display = 'none';
        resultsSpan.innerHTML = `<i class="fas fa-check-circle me-1" style="color: #28cd41;"></i>Showing ${visibleCount} school${visibleCount > 1 ? 's' : ''}`;
    }
}

function filterByCategory(category) {
    filterSchools();
}

function searchSchools(term) {
    filterSchools();
}

function clearFilters() {
    document.getElementById('categoryDropdown').value = '';
    document.getElementById('searchSchools').value = '';
    filterSchools();
}

function viewIslamicSchools() {
    document.getElementById('categoryDropdown').value = 'tahfidh';
    filterSchools();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeSchoolData);

// ===== SCHOOL DATA =====
const schoolData = [
    {
        id: 'kampala-international',
        name: 'Kampala International School',
        category: 'secondary',
        region: 'Kampala',
        location: 'Kampala, Uganda',
        rating: 4.8,
        reviews: 312,
        description: 'Premier international school offering Cambridge curriculum from Kindergarten to A-Levels with state-of-the-art facilities.',
        programs: ['Cambridge', 'IB Diploma', 'STEM', 'Sports'],
        facilities: ['wifi', 'labs', 'library', 'transport'],
        phone: '+256 414 123 456',
        featured: true,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'uganda-technical',
        name: 'Uganda Technical College',
        category: 'technical',
        region: 'Kampala',
        location: 'Kyambogo, Kampala',
        rating: 4.7,
        reviews: 245,
        description: 'Leading technical institution specializing in engineering, IT, and vocational training with strong industry partnerships.',
        programs: ['Computer Science', 'Electrical Eng', 'Mechanical Eng', 'Civil Eng'],
        facilities: ['labs', 'workshops', 'library', 'sports'],
        phone: '+256 414 234 567',
        image: 'https://images.unsplash.com/photo-1581092921461-39b21c1e7f3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'al-noor-islamic',
        name: 'Al-Noor Islamic Academy',
        category: 'tahfidh',
        region: 'Jinja',
        location: 'Jinja, Uganda',
        rating: 4.9,
        reviews: 178,
        description: 'Premier Islamic institution combining Quranic memorization with modern education. Certified by the International Islamic Educational Organization.',
        programs: ['Tahfidh Quran', 'Arabic Studies', 'Islamic Sciences', 'National Curriculum'],
        facilities: ['mosque', 'quran-lab', 'boarding', 'halal-kitchen'],
        phone: '+256 434 123 456',
        tahfidh: true,
        image: 'https://images.unsplash.com/photo-1564769625905-50f93615c769?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'gayaza-high',
        name: 'Gayaza High School',
        category: 'secondary',
        region: 'Wakiso',
        location: 'Gayaza, Wakiso',
        rating: 4.8,
        reviews: 423,
        description: 'Prestigious girls\' secondary school with outstanding academic performance and holistic development programs.',
        programs: ['STEM', 'Arts', 'Sports', 'Leadership'],
        facilities: ['labs', 'library', 'hostels', 'sports-complex'],
        phone: '+256 414 345 678',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'kampala-primary',
        name: 'Kampala Primary School',
        category: 'primary',
        region: 'Kampala',
        location: 'Old Kampala, Kampala',
        rating: 4.5,
        reviews: 156,
        description: 'Government primary school with quality education and development of all-round skills for young learners.',
        programs: ['National Curriculum', 'Sports', 'Music', 'Debates'],
        facilities: ['library', 'playground', 'sports', 'transport'],
        phone: '+256 414 456 789',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'jinja-prep',
        name: 'Jinja Preparatory School',
        category: 'primary',
        region: 'Jinja',
        location: 'Jinja, Uganda',
        rating: 4.6,
        reviews: 134,
        description: 'Private primary academy with progressive teaching methods and focus on holistic child development.',
        programs: ['Cambridge', 'STEM', 'Languages', 'Arts'],
        facilities: ['computer-labs', 'science-labs', 'music-room', 'art-studio'],
        phone: '+256 434 234 567',
        image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'little-angels',
        name: 'Little Angels Kindergarten',
        category: 'kindergarten',
        region: 'Kampala',
        location: 'Bukoto, Kampala',
        rating: 4.7,
        reviews: 98,
        description: 'Nurturing kindergarten with play-based learning and early childhood development focus in a safe environment.',
        programs: ['Play-Based', 'Montessori', 'Art', 'Music'],
        facilities: ['play-area', 'nap-room', 'cafeteria', 'parent-space'],
        phone: '+256 414 567 890',
        image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'makerere-university',
        name: 'Makerere University',
        category: 'university',
        region: 'Kampala',
        location: 'Makerere Hill, Kampala',
        rating: 4.6,
        reviews: 567,
        description: 'Uganda\'s largest and oldest institution of higher learning, offering comprehensive undergraduate and postgraduate programs.',
        programs: ['Medicine', 'Engineering', 'Law', 'Business', 'Arts'],
        facilities: ['labs', 'library', 'hostels', 'sports-facilities'],
        phone: '+256 414 678 901',
        image: 'https://images.unsplash.com/photo-1592280771190-5e5a6a7b3b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
];

// ===== GLOBAL VARIABLES =====
let filteredSchools = [...schoolData];
let currentCategory = '';
let currentSearch = '';

// ===== DOM ELEMENTS =====
const schoolsGrid = document.getElementById('schoolsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const clearFiltersBtn = document.getElementById('clearFilters');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const viewIslamicBtn = document.getElementById('viewIslamicBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    renderSchools(schoolData);
    setupEventListeners();
});

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterSchools);
    }
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('keyup', filterSchools);
    }
    
    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // View Islamic button
    if (viewIslamicBtn) {
        viewIslamicBtn.addEventListener('click', viewIslamicSchools);
    }
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

// ===== POPULATE CATEGORY DROPDOWN =====
function populateCategories() {
    if (!categoryFilter) return;
    
    const categories = [...new Set(schoolData.map(s => s.category))];
    categories.sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categoryFilter.appendChild(option);
    });
}

// ===== RENDER SCHOOLS =====
function renderSchools(schools) {
    if (!schoolsGrid) return;
    
    if (schools.length === 0) {
        schoolsGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        if (resultsCount) resultsCount.textContent = 'Showing 0 schools';
        return;
    }

    if (noResults) noResults.style.display = 'none';
    
    schoolsGrid.innerHTML = schools.map(school => `
        <div class="school-card" data-id="${school.id}">
            <img src="${school.image}" alt="${school.name}" class="school-image" loading="lazy">
            <div class="school-content">
                ${school.featured ? '<span class="school-badge">Featured</span>' : ''}
                ${school.tahfidh ? '<span class="school-badge tahfidh">Tahfidh</span>' : ''}
                <h3 class="school-name">${school.name}</h3>
                <div class="school-location">
                    <i class="fas fa-map-pin"></i> ${school.location}
                </div>
                <div class="school-rating">
                    ${getStarRating(school.rating)}
                    <span>(${school.rating} • ${school.reviews} reviews)</span>
                </div>
                <p class="school-description">${school.description}</p>
                <div class="program-tags">
                    ${school.programs.slice(0, 4).map(p => `<span class="program-tag">${p}</span>`).join('')}
                </div>
                <div class="facility-icons">
                    ${getFacilityIcons(school.facilities.slice(0, 4))}
                </div>
                <div class="school-footer">
                    <span class="contact-phone"><i class="fas fa-phone"></i> ${school.phone}</span>
                    <button class="view-btn" onclick="viewSchoolDetails('${school.id}')">View Details</button>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers to school cards
    document.querySelectorAll('.school-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('view-btn')) {
                const schoolId = this.dataset.id;
                viewSchoolDetails(schoolId);
            }
        });
    });

    if (resultsCount) {
        resultsCount.textContent = `Showing ${schools.length} school${schools.length > 1 ? 's' : ''}`;
    }
}

// ===== HELPER: GET STAR RATING =====
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '½';
    }
    
    return stars;
}

// ===== HELPER: GET FACILITY ICONS =====
function getFacilityIcons(facilities) {
    const iconMap = {
        'wifi': 'wifi',
        'labs': 'flask',
        'library': 'book',
        'transport': 'bus',
        'robotics': 'robot',
        'workshops': 'tools',
        'computer-labs': 'laptop',
        'mosque': 'mosque',
        'quran-lab': 'quran',
        'boarding': 'hotel',
        'halal-kitchen': 'utensils',
        'music-room': 'music',
        'sports-complex': 'basketball-ball',
        'play-area': 'child',
        'nap-room': 'bed',
        'cafeteria': 'utensils',
        'parent-space': 'users',
        'science-labs': 'flask',
        'art-studio': 'paint-brush',
        'hostels': 'bed',
        'sports': 'futbol',
        'playground': 'child',
        'sports-facilities': 'basketball-ball'
    };
    
    return facilities.map(f => {
        const icon = iconMap[f] || 'circle';
        return `<span><i class="fas fa-${icon}"></i> ${f.replace('-', ' ')}</span>`;
    }).join('');
}

// ===== FILTER SCHOOLS =====
function filterSchools() {
    const category = categoryFilter ? categoryFilter.value : '';
    const search = searchInput ? searchInput.value.toLowerCase() : '';

    filteredSchools = schoolData.filter(school => {
        const matchesCategory = !category || school.category === category;
        const matchesSearch = !search || 
            school.name.toLowerCase().includes(search) || 
            school.region.toLowerCase().includes(search) ||
            school.location.toLowerCase().includes(search);
        return matchesCategory && matchesSearch;
    });

    renderSchools(filteredSchools);
}

// ===== CLEAR FILTERS =====
function clearFilters() {
    if (categoryFilter) categoryFilter.value = '';
    if (searchInput) searchInput.value = '';
    filterSchools();
}

// ===== VIEW ISLAMIC SCHOOLS =====
function viewIslamicSchools() {
    if (categoryFilter) categoryFilter.value = 'tahfidh';
    filterSchools();
    
    // Smooth scroll to schools section
    document.getElementById('schools').scrollIntoView({ behavior: 'smooth' });
}

// ===== VIEW SCHOOL DETAILS =====
function viewSchoolDetails(id) {
    const school = schoolData.find(s => s.id === id);
    if (school) {
        // In a real implementation, this would navigate to a detail page
        alert(`Viewing details for ${school.name}\n\nThis would take you to a dedicated school profile page with complete information, photo gallery, programs, fees, and application form.`);
        
        // Uncomment for actual navigation:
        // window.location.href = `school-details.html?id=${id}`;
    }
}

// ===== TOGGLE MOBILE MENU =====
function toggleMobileMenu() {
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// ===== HANDLE SMOOTH SCROLL =====
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        
        // Close mobile menu if open
        if (navMenu) navMenu.classList.remove('active');
    }
}

// ===== HANDLE CONTACT FORM SUBMIT =====
function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// ===== HANDLE NEWSLETTER SUBMIT =====
function handleNewsletterSubmit(e) {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
}

// ===== CLOSE MOBILE MENU ON RESIZE =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
    }
});

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
window.clearFilters = clearFilters;
window.viewSchoolDetails = viewSchoolDetails;
window.viewIslamicSchools = viewIslamicSchools;