// COMPREHENSIVE SECTION INTERACTIVITY ENHANCEMENTS

document.addEventListener('DOMContentLoaded', function() {
    // Quick Access Cards - Staggered Animation
    const quickCards = document.querySelectorAll('.quick-card');
    quickCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`;
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        cardObserver.observe(card);
        
        card.addEventListener('click', function() {
            this.style.animation = 'pulse 0.5s ease-out';
        });
    });
    
    // School Cards - Enhanced Interactions
    const schoolCards = document.querySelectorAll('.school-card');
    schoolCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) rotateX(-10deg)';
        
        const schoolObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) rotateX(0)';
                    }, index * 150);
                    schoolObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        schoolObserver.observe(card);
    });
    
    // Events/Jobs Cards
    const eventCards = document.querySelectorAll('.ej-card, .events-card');
    eventCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        const eventObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    eventObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        eventObserver.observe(card);
    });
    
    // Partner Logos - Staggered Reveal
    const partnerLogos = document.querySelectorAll('.partner-logo');
    partnerLogos.forEach((logo, index) => {
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.8) rotateZ(-10deg)';
        
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1) rotateZ(0)';
                    }, index * 80);
                    logoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        logoObserver.observe(logo);
    });
    
    // Testimonial Cards - Bounce In
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';
        
        const testimonialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 120);
                    testimonialObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        testimonialObserver.observe(card);
    });
    
    // Button Interactions
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add animations if not present
    if (!document.querySelector('style[data-section-anim]')) {
        const animStyle = document.createElement('style');
        animStyle.setAttribute('data-section-anim', 'true');
        animStyle.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(animStyle);
    }
});
