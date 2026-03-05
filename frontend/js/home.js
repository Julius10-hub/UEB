// Home page functionality
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load stats
        const stats = await api.getStats();
        
        document.getElementById('schoolCount').textContent = stats.schools + '+';
        document.getElementById('studentCount').textContent = '50,000+';
        document.getElementById('programCount').textContent = stats.programs + '+';
        
        // Animate stats on scroll
        animateStatsOnScroll();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
});

// Animate stats when they come into view
function animateStatsOnScroll() {
    const statCards = document.querySelectorAll('.stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    statCards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
