// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Handlers
const api = {
    // Authentication
    async register(email, password, name, role = 'user') {
        // Store locally for demo
        const users = JSON.parse(localStorage.getItem('cpace_users') || '[]');
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }
        
        // Set admin/systems flags based on role
        let userData = { email, password, name, role };
        if (role === 'admin') {
            userData.is_admin = true;
        } else if (role === 'systems') {
            userData.is_systems = true;
        }
        
        users.push(userData);
        localStorage.setItem('cpace_users', JSON.stringify(users));
        
        // Store current user
        const user = { email, name, role, is_admin: role === 'admin', is_systems: role === 'systems' };
        localStorage.setItem('cpace_user', JSON.stringify(user));
        
        // Try backend if available
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, name, role })
            });
            return await response.json();
        } catch (error) {
            return { success: true, user };
        }
    },

    async login(email, password) {
        // Demo credentials for admin
        if (email === 'admin@thrive.com' && password === 'admin123') {
            const user = { email, name: 'Admin', role: 'admin', is_admin: true, is_systems: false };
            localStorage.setItem('cpace_user', JSON.stringify(user));
            return { success: true, user };
        }

        // Demo credentials for systems
        if (email === 'systems@thrive.com' && password === 'systems123') {
            const user = { email, name: 'Systems Manager', role: 'systems', is_admin: false, is_systems: true };
            localStorage.setItem('cpace_user', JSON.stringify(user));
            return { success: true, user };
        }
        
        // Check localStorage for registered users
        const users = JSON.parse(localStorage.getItem('cpace_users') || '[]');
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
            const user = { 
                email: found.email, 
                name: found.name, 
                role: found.role,
                is_admin: found.role === 'admin',
                is_systems: found.role === 'systems'
            };
            localStorage.setItem('cpace_user', JSON.stringify(user));
            return { success: true, user };
        }
        
        // Try backend if available
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.user) {
                data.user.is_admin = data.user.is_admin || false;
                data.user.is_systems = data.user.is_systems || false;
            }
            return data;
        } catch (error) {
            return { success: false, error: 'Invalid email or password' };
        }
    },

    async logout() {
        localStorage.removeItem('cpace_user');
        
        // Try backend if available
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            return { success: true };
        }
    },

    async getCurrentUser() {
        // First check localStorage (for demo/offline mode)
        const stored = localStorage.getItem('cpace_user');
        if (stored) {
            try {
                const user = JSON.parse(stored);
                // Determine role based on email or flags
                if (user.email === 'admin@thrive.com' || user.role === 'admin') {
                    user.role = 'admin';
                    user.is_admin = true;
                    user.is_systems = false;
                } else if (user.email === 'systems@thrive.com' || user.role === 'systems') {
                    user.role = 'systems';
                    user.is_admin = false;
                    user.is_systems = true;
                } else {
                    user.role = user.role || 'user';
                    user.is_admin = false;
                    user.is_systems = false;
                }
                return user;
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }
        
        // Try to get from backend if available
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                return data.user;
            }
        } catch (error) {
            console.error('Backend auth error, using localStorage:', error);
        }
        
        return null;
    },

    // Schools
    async getSchools(category = null) {
        let url = `${API_BASE_URL}/schools`;
        if (category) {
            url += `?category=${encodeURIComponent(category)}`;
        }
        const response = await fetch(url, {
            credentials: 'include'
        });
        return await response.json();
    },

    async getSchool(id) {
        const response = await fetch(`${API_BASE_URL}/schools/${id}`, {
            credentials: 'include'
        });
        return await response.json();
    },

    async createSchool(schoolData) {
        const response = await fetch(`${API_BASE_URL}/schools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(schoolData)
        });
        return await response.json();
    },

    // Events
    async getEvents() {
        const response = await fetch(`${API_BASE_URL}/events`, {
            credentials: 'include'
        });
        return await response.json();
    },

    // Jobs
    async getJobs() {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
            credentials: 'include'
        });
        return await response.json();
    },

    // Bursaries
    async getBursaries() {
        const response = await fetch(`${API_BASE_URL}/bursaries`, {
            credentials: 'include'
        });
        return await response.json();
    },

    // Agents
    async getAgents() {
        const response = await fetch(`${API_BASE_URL}/agents`, {
            credentials: 'include'
        });
        return await response.json();
    },

    // Past Papers
    async getPastPapers() {
        const response = await fetch(`${API_BASE_URL}/past-papers`, {
            credentials: 'include'
        });
        return await response.json();
    },

    // Suggestions
    async createSuggestion(name, email, message) {
        const response = await fetch(`${API_BASE_URL}/suggestions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, message })
        });
        return await response.json();
    },

    async getSuggestions() {
        const response = await fetch(`${API_BASE_URL}/suggestions`, {
            credentials: 'include'
        });
        return await response.json();
    },

    // Stats
    async getStats() {
        const response = await fetch(`${API_BASE_URL}/stats`, {
            credentials: 'include'
        });
        return await response.json();
    }
};

// Error Handling
function handleApiError(error) {
    console.error('API Error:', error);
    if (error.error === 'Unauthorized') {
        window.location.href = '/login.html';
    }
    return {
        success: false,
        error: error.error || 'An error occurred'
    };
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles (can be added to main.css)
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 12px 20px;
        background: var(--info);
        color: white;
        border-radius: 6px;
        opacity: 0;
        transition: opacity 0.3s ease-out;
        z-index: 9999;
        max-width: 400px;
        word-wrap: break-word;
    }
    
    .notification.show {
        opacity: 1;
    }
    
    .notification-success {
        background: var(--success);
    }
    
    .notification-error {
        background: var(--error);
    }
    
    .notification-warning {
        background: var(--warning);
    }
    
    .notification-info {
        background: var(--info);
    }
`;
document.head.appendChild(style);
