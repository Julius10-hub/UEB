// Admin Schools Management JavaScript
let schools = [];
let filteredSchools = [];
let editingSchoolId = null;
let deletingSchoolId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const user = await api.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Load schools
    await loadSchools();

    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchSchools').addEventListener('input', (e) => {
        filterSchools();
    });

    // Category filter
    document.getElementById('filterCategory').addEventListener('change', (e) => {
        filterSchools();
    });

    // School form submission
    document.getElementById('schoolForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSchool();
    });

    // Delete confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        confirmDeleteSchool();
    });
}

async function loadSchools() {
    try {
        schools = getMockSchools();
        filteredSchools = [...schools];
        renderSchools();
    } catch (error) {
        console.error('Error loading schools:', error);
        document.getElementById('schoolsList').innerHTML = 
            '<p class="error">Failed to load schools. Please try again.</p>';
    }
}

function getMockSchools() {
    const schools = [
        {
            id: 1,
            name: "Nairobi High School",
            location: "Nairobi, Kenya",
            category: "Secondary",
            students: 450,
            established: 1995,
            description: "Premier secondary institution offering quality education",
            image: "https://images.unsplash.com/photo-1427504494785-cdbed64a66d8?w=500&q=80",
            programs: ["Science", "Arts", "Commercial"]
        },
        {
            id: 2,
            name: "Mombasa Primary Academy",
            location: "Mombasa, Kenya",
            category: "Primary",
            students: 380,
            established: 2005,
            description: "Leading primary school focused on holistic development",
            image: "https://images.unsplash.com/photo-1509884287085-764bc8e83d4f?w=500&q=80",
            programs: ["Standard Curriculum"]
        },
        {
            id: 3,
            name: "University of Nairobi",
            location: "Nairobi, Kenya",
            category: "University",
            students: 2500,
            established: 1956,
            description: "Premier research and teaching university",
            image: "https://images.unsplash.com/photo-1541339907198-a29e1db03faf?w=500&q=80",
            programs: ["Engineering", "Medicine", "Law", "Business", "Education"]
        },
        {
            id: 4,
            name: "Technical Institute Kisumu",
            location: "Kisumu, Kenya",
            category: "Technical",
            students: 280,
            established: 2010,
            description: "Vocational training center for skilled trades",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80",
            programs: ["Plumbing", "Electrical", "Welding", "Carpentry"]
        },
        {
            id: 5,
            name: "Kilifi Secondary School",
            location: "Kilifi, Kenya",
            category: "Secondary",
            students: 350,
            established: 2000,
            description: "Quality education with modern facilities",
            image: "https://images.unsplash.com/photo-1427504494785-cdbed64a66d8?w=500&q=80",
            programs: ["Science", "Arts"]
        }
    ];

    // Load from localStorage if available
    const stored = localStorage.getItem('cpace_schools');
    return stored ? JSON.parse(stored) : schools;
}

function filterSchools() {
    const search = document.getElementById('searchSchools').value.toLowerCase();
    const category = document.getElementById('filterCategory').value;

    filteredSchools = schools.filter(school => {
        const matchesSearch = 
            school.name.toLowerCase().includes(search) ||
            school.location.toLowerCase().includes(search);
        const matchesCategory = !category || school.category === category;
        return matchesSearch && matchesCategory;
    });

    renderSchools();
}

function renderSchools() {
    const container = document.getElementById('schoolsList');

    if (filteredSchools.length === 0) {
        container.innerHTML = '<p class="no-data">No schools found. Try a different search or add a new school.</p>';
        return;
    }

    container.innerHTML = filteredSchools.map(school => `
        <div class="admin-item school-item">
            <div class="school-info">
                <div class="school-header">
                    <h3>${school.name}</h3>
                    <span class="school-category ${school.category.toLowerCase()}">${school.category}</span>
                </div>
                <p class="school-location">📍 ${school.location}</p>
                <p class="school-meta">👥 ${school.students} students | 📅 Est. ${school.established}</p>
                <p class="school-description">${school.description}</p>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-outline btn-small" onclick="openEditSchoolModal(${school.id})">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="openDeleteModal(${school.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function openAddSchoolModal() {
    editingSchoolId = null;
    document.getElementById('modalTitle').textContent = 'Add New School';
    document.getElementById('schoolForm').reset();
    document.getElementById('schoolId').value = '';
    document.getElementById('schoolModal').style.display = 'flex';
}

function openEditSchoolModal(id) {
    const school = schools.find(s => s.id === id);
    if (!school) return;

    editingSchoolId = id;
    document.getElementById('modalTitle').textContent = 'Edit School';
    document.getElementById('schoolId').value = school.id;
    document.getElementById('schoolName').value = school.name;
    document.getElementById('schoolLocation').value = school.location;
    document.getElementById('schoolCategory').value = school.category;
    document.getElementById('schoolStudents').value = school.students || 0;
    document.getElementById('schoolEstablished').value = school.established || '';
    document.getElementById('schoolImage').value = school.image || '';
    document.getElementById('schoolDescription').value = school.description || '';
    document.getElementById('schoolPrograms').value = (school.programs || []).join(', ');

    document.getElementById('schoolModal').style.display = 'flex';
}

function closeSchoolModal() {
    document.getElementById('schoolModal').style.display = 'none';
    editingSchoolId = null;
}

function saveSchool() {
    const schoolId = document.getElementById('schoolId').value;
    const schoolData = {
        name: document.getElementById('schoolName').value,
        location: document.getElementById('schoolLocation').value,
        category: document.getElementById('schoolCategory').value,
        students: parseInt(document.getElementById('schoolStudents').value) || 0,
        established: parseInt(document.getElementById('schoolEstablished').value) || new Date().getFullYear(),
        image: document.getElementById('schoolImage').value || 'https://images.unsplash.com/photo-1427504494785-cdbed64a66d8?w=500&q=80',
        description: document.getElementById('schoolDescription').value,
        programs: document.getElementById('schoolPrograms').value
            .split(',')
            .map(p => p.trim())
            .filter(p => p)
    };

    if (schoolId) {
        // Edit existing school
        const school = schools.find(s => s.id == schoolId);
        if (school) {
            Object.assign(school, schoolData);
        }
    } else {
        // Add new school
        const newSchool = {
            id: Math.max(...schools.map(s => s.id), 0) + 1,
            ...schoolData
        };
        schools.push(newSchool);
    }

    // Save to localStorage
    localStorage.setItem('cpace_schools', JSON.stringify(schools));

    // Refresh display
    filteredSchools = [...schools];
    renderSchools();
    closeSchoolModal();
    showNotification(schoolId ? 'School updated successfully!' : 'School added successfully!', 'success');
}

function openDeleteModal(id) {
    deletingSchoolId = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    deletingSchoolId = null;
}

function confirmDeleteSchool() {
    schools = schools.filter(s => s.id !== deletingSchoolId);
    localStorage.setItem('cpace_schools', JSON.stringify(schools));
    
    filteredSchools = schools.filter(s => {
        const search = document.getElementById('searchSchools').value.toLowerCase();
        const category = document.getElementById('filterCategory').value;
        return (s.name.toLowerCase().includes(search) || s.location.toLowerCase().includes(search)) &&
               (!category || s.category === category);
    });

    renderSchools();
    closeDeleteModal();
    showNotification('School deleted successfully!', 'success');
}

function showNotification(message, type) {
    // Simple notification (can be enhanced with toast library)
    alert(message);
}
