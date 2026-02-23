// Admin Dashboard JavaScript
let mockSchools = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const user = await api.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Update user info in header
    document.getElementById('userName').textContent = user.name || 'Admin';
    document.getElementById('userEmailDisplay').textContent = user.email;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userRole').textContent = 'Admin';

    // Load dashboard statistics
    await loadDashboardStats();
});

async function loadDashboardStats() {
    try {
        // For demo purposes, using mock data
        const schools = getMockSchools();
        mockSchools = schools;

        // Calculate statistics
        const totalSchools = schools.length;
        const totalStudents = schools.reduce((sum, s) => sum + (s.students || 0), 0);
        const locations = new Set(schools.map(s => s.location.split(',')[0])).size;

        // Update statistics
        document.getElementById('totalSchools').textContent = totalSchools;
        document.getElementById('totalStudents').textContent = totalStudents.toLocaleString();
        document.getElementById('totalLocations').textContent = locations;

        // Update category breakdown
        const categories = {};
        schools.forEach(school => {
            const cat = school.category || 'Other';
            categories[cat] = (categories[cat] || 0) + 1;
        });

        const breakdown = document.getElementById('categoryBreakdown');
        breakdown.innerHTML = Object.entries(categories)
            .map(([cat, count]) => `
                <div class="category-item">
                    <span class="category-name">${cat}</span>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${(count / totalSchools) * 100}%"></div>
                    </div>
                    <span class="category-count">${count}</span>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Mock data function (replace with API calls when backend is ready)
function getMockSchools() {
    const schools = [
        {
            id: 1,
            name: "Nairobi High School",
            location: "Nairobi, Kenya",
            category: "Secondary",
            students: 450,
            established: 1995,
            description: "Premier secondary institution in Nairobi",
            programs: ["Science", "Arts", "Commercial"]
        },
        {
            id: 2,
            name: "Mombasa Primary Academy",
            location: "Mombasa, Kenya",
            category: "Primary",
            students: 380,
            established: 2005,
            description: "Leading primary school on the coast",
            programs: ["Standard Curriculum"]
        },
        {
            id: 3,
            name: "University of Nairobi",
            location: "Nairobi, Kenya",
            category: "University",
            students: 2500,
            established: 1956,
            description: "Premier university institution",
            programs: ["Engineering", "Medicine", "Law", "Business"]
        },
        {
            id: 4,
            name: "Technical Institute Kisumu",
            location: "Kisumu, Kenya",
            category: "Technical",
            students: 280,
            established: 2010,
            description: "Vocational and technical training center",
            programs: ["Plumbing", "Electrical", "Welding"]
        },
        {
            id: 5,
            name: "Kilifi Secondary School",
            location: "Kilifi, Kenya",
            category: "Secondary",
            students: 350,
            established: 2000,
            description: "Quality secondary education",
            programs: ["Science", "Arts"]
        }
    ];

    // Load from localStorage if available
    const stored = localStorage.getItem('cpace_schools');
    return stored ? JSON.parse(stored) : schools;
}
