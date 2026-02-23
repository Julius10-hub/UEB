// Navbar functionality
document.addEventListener('DOMContentLoaded', async () => {
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const navbarAuth = document.getElementById('navbarAuth');
    const navbarUser = document.getElementById('navbarUser');
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmail = document.getElementById('userEmail');

    // Mobile menu toggle
    navbarToggle?.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navbarMenu?.querySelectorAll('.nav-link');
    navLinks?.forEach(link => {
        link.addEventListener('click', () => {
            navbarToggle?.classList.remove('active');
            navbarMenu?.classList.remove('active');
        });
    });

    // Update active nav link
    const currentPath = window.location.pathname;
    navLinks?.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath === '/' && href === 'index.html') ||
            (currentPath.includes('admin') && href.includes('admin'))) {
            link.classList.add('active');
        }
    });

    // Check authentication status
    const currentUser = await api.getCurrentUser();
    
    if (currentUser) {
        // User is logged in
        navbarAuth.style.display = 'none';
        navbarUser.style.display = 'flex';
        userEmail.textContent = currentUser.email;
        
        // Show appropriate dashboard link based on role
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            if (currentUser.is_admin) {
                adminLink.style.display = 'inline-block';
                adminLink.href = 'admin-dashboard.html';
                adminLink.textContent = 'Admin Dashboard';
            } else if (currentUser.is_systems) {
                adminLink.style.display = 'inline-block';
                adminLink.href = 'services-dashboard.html';
                adminLink.textContent = 'Services Dashboard';
            } else {
                adminLink.style.display = 'none';
            }
        }
    } else {
        // User is not logged in
        navbarAuth.style.display = 'flex';
        navbarUser.style.display = 'none';
    }

    // Logout handler
    logoutBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await api.logout();
            showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } catch (error) {
            showNotification('Error logging out', 'error');
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
});
