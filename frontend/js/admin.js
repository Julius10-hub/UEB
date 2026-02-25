// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const user = await api.getCurrentUser();
    if (!user || !user.is_admin) {
        window.location.href = '/index.html';
        return;
    }
    
    // Setup real-time broadcasting
    setupSchoolBroadcasting();
    
    // Load dashboard data
    await loadStats();
    await loadSchools();
    await loadSuggestions();
    
    // Setup form handler  
    setupFormHandlers();

    // Wire quick action Add School button (if present)
    const addSchoolBtn = document.getElementById('addSchoolBtn');
    if (addSchoolBtn) addSchoolBtn.addEventListener('click', () => openModal('schoolModal'));
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
        const tableBody = document.getElementById('schoolsTableBody');
        
        if (!schools || schools.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No schools found. Add one to get started.</td></tr>';
            return;
        }
        
        tableBody.innerHTML = schools.map(school => `
            <tr>
                <td><strong>${school.name || 'N/A'}</strong></td>
                <td>${school.category || 'N/A'}</td>
                <td>${school.location || 'N/A'}</td>
                <td>${school.students || 0}</td>
                <td>${school.contact_email || 'N/A'}</td>
                <td>
                    <button class="btn btn-outline btn-small" onclick="editSchool(${school.id})">Edit</button>
                    <button class="btn btn-secondary btn-small" onclick="deleteSchool(${school.id})">Delete</button>
                </td>
                <td></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading schools:', error);
        const tableBody = document.getElementById('schoolsTableBody');
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Error loading schools</td></tr>';
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
    // Reset the school form if it exists
    const form = document.getElementById('schoolForm');
    if (form) form.reset();
}

// Generic open modal helper used by markup and buttons
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'flex';
    // If opening school modal, reset form and title
    if (modalId === 'schoolModal') {
        const form = document.getElementById('schoolForm');
        if (form) form.reset();
        const titleEl = document.getElementById('schoolModalTitle');
        if (titleEl) titleEl.textContent = 'Add New School';
    }
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
    // Removed - using handleSchoolSubmit instead
}

// Handle comprehensive school form submission
async function handleSchoolSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Build school data from form
    const schoolData = {
        name: formData.get('name'),
        location: formData.get('location'),
        city: formData.get('city'),
        country: formData.get('country'),
        category: formData.get('category'),
        description: formData.get('description'),
        long_description: formData.get('long_description'),
        established: formData.get('established') ? parseInt(formData.get('established')) : null,
        students: formData.get('students') ? parseInt(formData.get('students')) : 0,
        faculty: formData.get('faculty') ? parseInt(formData.get('faculty')) : 0,
        contact_email: formData.get('contact_email'),
        contact_phone: formData.get('contact_phone'),
        website: formData.get('website'),
        meta_keywords: formData.get('meta_keywords'),
        meta_description: formData.get('meta_description'),
        programs: formData.get('programs_text') 
            ? formData.get('programs_text').split(',').map(p => p.trim()).filter(p => p)
            : []
    };
    
    try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
        
        // Submit to API
        const result = await api.createSchool(schoolData);
        
        if (result.error) {
            showNotification('Error: ' + result.error, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        } else {
            showNotification('School added successfully!', 'success');
            
            // Broadcast to all tabs
            if (window.schoolUpdateChannel) {
                window.schoolUpdateChannel.postMessage({
                    type: 'schoolAdded',
                    school: result.school || result,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Reset form and close modal
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal
            const modal = document.getElementById('schoolModal');
            if (modal) modal.style.display = 'none';
            
            // Reload schools list
            await loadSchools();
        }
    } catch (error) {
        console.error('School submission error:', error);
        showNotification('Error adding school: ' + error.message, 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Setup real-time broadcast channel for school updates
function setupSchoolBroadcasting() {
    try {
        window.schoolUpdateChannel = new BroadcastChannel('school-updates');
        
        window.schoolUpdateChannel.onmessage = async (event) => {
            const { type, school, timestamp } = event.data;
            
            console.log('Received school update:', type, school);
            
            if (type === 'schoolAdded' || type === 'schoolUpdated') {
                // Reload schools list
                await loadSchools();
            } else if (type === 'schoolDeleted') {
                // Reload schools list
                await loadSchools();
            }
        };
        
        console.log('School broadcast channel established');
    } catch (error) {
        console.warn('Broadcast Channel not supported, real-time updates disabled:', error);
    }
}

function editSchool(schoolId) {
    showNotification('Edit functionality coming soon', 'info');
}

function deleteSchool(schoolId) {
    if (confirm('Are you sure you want to delete this school?')) {
        showNotification('Delete functionality coming soon', 'info');
    }
}

// Helper: Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Helper: Show notification toast
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        toast.style.backgroundColor = '#10b981';
        toast.style.color = 'white';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#ef4444';
        toast.style.color = 'white';
    } else {
        toast.style.backgroundColor = '#3b82f6';
        toast.style.color = 'white';
    }
    
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('schoolModal');
    if (e.target === modal) {
        closeModal('schoolModal');
    }
});
