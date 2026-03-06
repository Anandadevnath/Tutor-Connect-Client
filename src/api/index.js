// API base URL
const API_BASE = 'https://tutor-connect-backend-zoji.onrender.com';

// Generic fetch utility for API calls
export async function apiFetch(path, options = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
    const res = await fetch(url, options);
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || error.message || 'API Error');
    }
    return res.json();
}

// Centralized API methods
export const api = {
    // Tutorials
    getTutorials: () => apiFetch('/api/tutorials'),
    getTutorialById: (id, token) => apiFetch(`/api/tutorials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    }),
    addTutorial: (data, token) => apiFetch('/api/tutorials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }),
    updateTutorial: (id, data, token) => apiFetch(`/api/tutorials/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }),
    deleteTutorial: (id, email) => apiFetch(`/api/tutorials/${id}?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
    }),

    // Bookings
    getMyBookings: (token) => apiFetch('/api/my-bookings', {
        headers: { Authorization: `Bearer ${token}` },
    }),
    bookTutorial: (data, token) => apiFetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }),
    reviewTutorial: (tutorId, token) => apiFetch(`/api/tutorials/${tutorId}/review`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
    }),

    // Auth
    login: (email, password) => apiFetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }),
    register: (data) => apiFetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }),
    googleLogin: (data) => apiFetch('/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }),

    // Stats
    getStats: () => apiFetch('/api/stats'),

    // My Tutorials
    getMyTutorials: (email) => apiFetch(`/api/my-tutorials?email=${encodeURIComponent(email)}`),
};
