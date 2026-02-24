// Schools page functionality
let allSchools = [];
let broadcastChannel = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load schools
        await loadSchools();
        
        // Setup event listeners
        setupFilterListeners();
        
        // Setup real-time listeners for new schools
        setupRealtimeListeners();
    } catch (error) {
        console.error('Error loading schools:', error);
        showErrorMessage();
    }
});

// Setup real-time listeners for school additions from admin dashboard
function setupRealtimeListeners() {
    // Use Broadcast Channel API if available (modern browsers)
    if (typeof BroadcastChannel !== 'undefined') {
        try {
            broadcastChannel = new BroadcastChannel('edubridge_schools');
            broadcastChannel.addEventListener('message', (event) => {
                if (event.data.type === 'SCHOOL_ADDED') {
                    handleNewSchool(event.data.school);
                }
            });
        } catch (error) {
            console.log('Broadcast Channel setup failed, using fallback method');
            setupLocalStorageListener();
        }
    } else {
        // Fallback for older browsers using localStorage events
        setupLocalStorageListener();
    }
    
    // Also listen for custom document events
    document.addEventListener('schoolAdded', (event) => {
        handleNewSchool(event.detail.school);
    });
}

// Fallback listener using localStorage events
function setupLocalStorageListener() {
    window.addEventListener('storage', (event) => {
        if (event.key === 'edubridge_last_school_added' && event.newValue) {
            try {
                const data = JSON.parse(event.newValue);
                handleNewSchool(data.school);
            } catch (error) {
                console.error('Error parsing new school data:', error);
            }
        }
    });
}

// Handle newly added school with professional animation
function handleNewSchool(school) {
    if (!school || !school.id) return;
    
    // Check if school already exists
    const exists = allSchools.find(s => s.id === school.id);
    if (exists) return;
    
    // Add the new school to the beginning of the array for prominence
    allSchools.unshift(school);
    
    // Reapply current filters if any
    applyFilters();
    
    // Show notification
    showNewSchoolNotification(school);
}

// Display professional notification for new school
function showNewSchoolNotification(school) {
    const container = document.getElementById('schoolsContainer');
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'school-notification-banner';
    notificationDiv.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">✨</div>
            <div class="notification-text">
                <strong>${escapeHtml(school.name)}</strong> has been added to our platform
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    if (container && container.parentElement) {
        container.parentElement.insertBefore(notificationDiv, container);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationDiv.parentElement) {
                notificationDiv.classList.add('fade-out');
                setTimeout(() => notificationDiv.remove(), 300);
            }
        }, 5000);
    }
}

async function loadSchools() {
    const container = document.getElementById('schoolsContainer');
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading schools...</p>
        </div>
    `;
    
    try {
        allSchools = await api.getSchools();
        renderSchools(allSchools);
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Error Loading Schools</h3>
                <p>Please try again later or contact support.</p>
            </div>
        `;
    }
}

function renderSchools(schools) {
    const container = document.getElementById('schoolsContainer');
    
    if (!schools || schools.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No Schools Found</h3>
                <p>Try adjusting your filters to find what you're looking for.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = schools.map(school => createSchoolCard(school)).join('');
}

function createSchoolCard(school) {
    const programs = school.programs || [];
    const programsHtml = programs.slice(0, 2).map(p => 
        `<span class="program-badge">${escapeHtml(p)}</span>`
    ).join('');
    
    const additionalPrograms = programs.length > 2 ? 
        `<span class="program-badge">+${programs.length - 2} more</span>` : '';
    
    return `
        <div class="school-card">
            <div class="school-image">
                ${school.image ? 
                    `<img src="${escapeHtml(school.image)}" alt="${escapeHtml(school.name)}" onerror="this.style.display='none'">` : 
                    `<div class="school-image-placeholder">🏫</div>`
                }
            </div>
            <div class="school-content">
                <span class="school-category">${escapeHtml(school.category)}</span>
                <h3 class="school-name">${escapeHtml(school.name)}</h3>
                <div class="school-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${escapeHtml(school.location)}
                </div>
                <p class="school-description">${escapeHtml(school.description)}</p>
                <div class="school-stats">
                    <div class="school-stat">
                        <div class="school-stat-value">${school.students || 0}</div>
                        <div class="school-stat-label">Students</div>
                    </div>
                    <div class="school-stat">
                        <div class="school-stat-value">${school.established || 'N/A'}</div>
                        <div class="school-stat-label">Established</div>
                    </div>
                </div>
                ${programs.length > 0 ? `
                    <div class="school-programs">
                        <div class="school-programs-label">Programs</div>
                        <div class="school-programs-list">
                            ${programsHtml}
                            ${additionalPrograms}
                        </div>
                    </div>
                ` : ''}
                <div class="school-action">
                    <button class="btn btn-primary btn-small" onclick="viewSchoolDetails(${school.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupFilterListeners() {
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    const resetFilters = document.getElementById('resetFilters');
    
    categoryFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
    resetFilters.addEventListener('click', () => {
        categoryFilter.value = '';
        searchInput.value = '';
        applyFilters();
    });
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allSchools;
    
    // Filter by category
    if (categoryFilter) {
        filtered = filtered.filter(s => s.category === categoryFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(searchTerm) ||
            s.location.toLowerCase().includes(searchTerm) ||
            (s.description || '').toLowerCase().includes(searchTerm)
        );
    }
    
    renderSchools(filtered);
}

function viewSchoolDetails(schoolId) {
    // In a real app, you might navigate to a detail page
    // For now, show a modal or navigate to a details page
    const school = allSchools.find(s => s.id === schoolId);
    if (school) {
        showNotification(`Viewing details for ${school.name}`, 'info');
        // Could redirect to a details page like: window.location.href = `/school-detail.html?id=${schoolId}`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showErrorMessage() {
    const container = document.getElementById('schoolsContainer');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h3>Error Loading Schools</h3>
            <p>Please try again later or contact support.</p>
        </div>
    `;
}
