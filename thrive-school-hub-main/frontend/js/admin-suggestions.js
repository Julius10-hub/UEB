// Admin Suggestions Management JavaScript
let suggestions = [];
let filteredSuggestions = [];
let currentSuggestion = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const user = await api.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Load suggestions
    await loadSuggestions();

    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchSuggestions').addEventListener('input', () => {
        filterSuggestions();
    });

    // Sort functionality
    document.getElementById('sortSuggestions').addEventListener('change', () => {
        sortSuggestions();
    });
}

async function loadSuggestions() {
    try {
        suggestions = getMockSuggestions();
        filteredSuggestions = [...suggestions];
        renderSuggestions();
    } catch (error) {
        console.error('Error loading suggestions:', error);
        document.getElementById('suggestionsList').innerHTML = 
            '<p class="error">Failed to load suggestions. Please try again.</p>';
    }
}

function getMockSuggestions() {
    const mockData = [
        {
            id: 1,
            name: "John Kamau",
            email: "john.kamau@email.com",
            message: "The platform is very helpful in finding schools. Would be great to have more filters for school facilities.",
            date: getRandomDate(90)
        },
        {
            id: 2,
            name: "Mary Kiprotich",
            email: "mary.kiprot@email.com",
            message: "Great initiative! Could you please add a feature to compare schools side by side?",
            date: getRandomDate(60)
        },
        {
            id: 3,
            name: "David Omondi",
            email: "david.omondi@email.com",
            message: "Love the past papers section. Please add more subjects.",
            date: getRandomDate(45)
        },
        {
            id: 4,
            name: "Sarah Mwangi",
            email: "sarah.mwangi@email.com",
            message: "The bursary information is very useful. Could you highlight scholarship opportunities?",
            date: getRandomDate(30)
        },
        {
            id: 5,
            name: "Anonymous",
            email: "anonymous@example.com",
            message: "Mobile app would be amazing for easy access on the go.",
            date: getRandomDate(15)
        },
        {
            id: 6,
            name: "Peter Kipchoge",
            email: "peter.kipchoge@email.com",
            message: "Excellent resource for parents helping children with school selection. Very impressed!",
            date: getRandomDate(7)
        }
    ];

    // Load from localStorage if available
    const stored = localStorage.getItem('cpace_suggestions');
    return stored ? JSON.parse(stored) : mockData;
}

function getRandomDate(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date.toISOString();
}

function filterSuggestions() {
    const search = document.getElementById('searchSuggestions').value.toLowerCase();

    filteredSuggestions = suggestions.filter(suggestion => {
        return (
            suggestion.name.toLowerCase().includes(search) ||
            suggestion.email.toLowerCase().includes(search) ||
            suggestion.message.toLowerCase().includes(search)
        );
    });

    renderSuggestions();
}

function sortSuggestions() {
    const sortBy = document.getElementById('sortSuggestions').value;

    switch(sortBy) {
        case 'newest':
            filteredSuggestions.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredSuggestions.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'name':
            filteredSuggestions.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    renderSuggestions();
}

function renderSuggestions() {
    const container = document.getElementById('suggestionsList');
    const countBadge = document.getElementById('suggestionCount');

    // Update count
    countBadge.textContent = filteredSuggestions.length;

    if (filteredSuggestions.length === 0) {
        container.innerHTML = '<p class="no-data">No suggestions found.</p>';
        return;
    }

    container.innerHTML = filteredSuggestions.map(suggestion => `
        <div class="suggestion-card">
            <div class="suggestion-header">
                <div class="suggestion-author">
                    <h3 class="author-name">${suggestion.name}</h3>
                    <p class="author-email">📧 ${suggestion.email}</p>
                </div>
                <span class="suggestion-date">${formatDate(suggestion.date)}</span>
            </div>
            <div class="suggestion-content">
                <p class="suggestion-message">${suggestion.message}</p>
            </div>
            <div class="suggestion-actions">
                <button class="btn btn-outline btn-small" onclick="openSuggestionDetail(${suggestion.id})">
                    View Details
                </button>
                <button class="btn btn-secondary btn-small" onclick="deleteSuggestion(${suggestion.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openSuggestionDetail(id) {
    const suggestion = suggestions.find(s => s.id === id);
    if (!suggestion) return;

    currentSuggestion = suggestion;
    document.getElementById('modalSuggestionName').textContent = suggestion.name;
    document.getElementById('detailName').textContent = suggestion.name;
    document.getElementById('detailEmail').textContent = suggestion.email;
    document.getElementById('detailDate').textContent = formatDateLong(suggestion.date);
    document.getElementById('detailMessage').textContent = suggestion.message;

    document.getElementById('suggestionModal').style.display = 'flex';
}

function closeSuggestionModal() {
    document.getElementById('suggestionModal').style.display = 'none';
    currentSuggestion = null;
}

function deleteSuggestion(id) {
    if (confirm('Are you sure you want to delete this suggestion?')) {
        suggestions = suggestions.filter(s => s.id !== id);
        localStorage.setItem('cpace_suggestions', JSON.stringify(suggestions));
        
        const search = document.getElementById('searchSuggestions').value.toLowerCase();
        filteredSuggestions = suggestions.filter(s =>
            s.name.toLowerCase().includes(search) ||
            s.email.toLowerCase().includes(search) ||
            s.message.toLowerCase().includes(search)
        );

        renderSuggestions();
        showNotification('Suggestion deleted successfully!', 'success');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function formatDateLong(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function exportAsCSV() {
    const headers = ['Name', 'Email', 'Message', 'Date'];
    const rows = suggestions.map(s => [
        s.name,
        s.email,
        `"${s.message.replace(/"/g, '""')}"`,
        formatDateLong(s.date)
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    downloadFile(csv, 'suggestions.csv', 'text/csv');
    closeExportModal();
    showNotification('Suggestions exported as CSV!', 'success');
}

function exportAsJSON() {
    const json = JSON.stringify(suggestions, null, 2);
    downloadFile(json, 'suggestions.json', 'application/json');
    closeExportModal();
    showNotification('Suggestions exported as JSON!', 'success');
}

function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function closeExportModal() {
    document.getElementById('exportModal').style.display = 'none';
}

function showNotification(message, type) {
    // Simple notification (can be enhanced with toast library)
    alert(message);
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const suggestionModal = document.getElementById('suggestionModal');
    const exportModal = document.getElementById('exportModal');

    if (e.target === suggestionModal) {
        closeSuggestionModal();
    }
    if (e.target === exportModal) {
        closeExportModal();
    }
});
