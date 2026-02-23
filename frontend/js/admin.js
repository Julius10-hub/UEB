// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const user = await api.getCurrentUser();
    if (!user || !user.is_admin) {
        window.location.href = '/index.html';
        return;
    }
    
    // Load dashboard data
    await loadStats();
    await loadSchools();
    await loadSuggestions();
    
    // Setup form handler
    setupFormHandlers();
});

async function loadStats() {
    try {
        const stats = await api.getStats();
        document.getElementById('totalSchools').textContent = stats.schools || 0;
        document.getElementById('totalStudents').textContent = (stats.students || 0).toLocaleString();
        document.getElementById('totalPrograms').textContent = stats.programs || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadSchools() {
    try {
        const schools = await api.getSchools();
        const container = document.getElementById('schoolsList');
        
        if (!schools || schools.length === 0) {
            container.innerHTML = '<p>No schools found.</p>';
            return;
        }
        
        container.innerHTML = schools.map(school => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <h3>${school.name}</h3>
                    <p>📍 ${school.location} | 👥 ${school.students} students | 📚 ${school.category}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-outline btn-small" onclick="editSchool(${school.id})">Edit</button>
                    <button class="btn btn-secondary btn-small" onclick="deleteSchool(${school.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading schools:', error);
    }
}

async function loadSuggestions() {
    try {
        const suggestions = await api.getSuggestions();
        const container = document.getElementById('suggestionsList');
        
        if (!suggestions || suggestions.length === 0) {
            container.innerHTML = '<p>No suggestions yet.</p>';
            return;
        }
        
        container.innerHTML = suggestions.map(suggestion => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <h3>${suggestion.name}</h3>
                    <p>${suggestion.message}</p>
                    <p style="color: var(--gray-400); font-size: 0.8rem; margin-top: var(--spacing-sm);">
                        📧 ${suggestion.email} | 📅 ${new Date(suggestion.date).toLocaleDateString()}
                    </p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading suggestions:', error);
    }
}

function showCreateSchoolForm() {
    const modal = document.getElementById('schoolModal');
    modal.style.display = 'flex';
    document.getElementById('addSchoolForm').reset();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function navigateTo(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupFormHandlers() {
    document.getElementById('addSchoolForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const schoolData = {
            name: formData.get('name'),
            location: formData.get('location'),
            category: formData.get('category'),
            description: formData.get('description'),
            students: parseInt(formData.get('students')) || 0,
            programs: []
        };
        
        try {
            const result = await api.createSchool(schoolData);
            if (result.error) {
                showNotification(result.error, 'error');
            } else {
                showNotification('School added successfully!', 'success');
                closeModal('schoolModal');
                await loadSchools();
            }
        } catch (error) {
            showNotification('Error adding school', 'error');
        }
    });
}

function editSchool(schoolId) {
    showNotification('Edit functionality coming soon', 'info');
}

function deleteSchool(schoolId) {
    if (confirm('Are you sure you want to delete this school?')) {
        showNotification('Delete functionality coming soon', 'info');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('schoolModal');
    if (e.target === modal) {
        closeModal('schoolModal');
    }
});
