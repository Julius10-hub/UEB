// Schools page functionality
let allSchools = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load schools
        await loadSchools();
        
        // Setup event listeners
        setupFilterListeners();
    } catch (error) {
        console.error('Error loading schools:', error);
        showErrorMessage();
    }
});

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
