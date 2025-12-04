// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  // Register
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal register');
    return data;
  },

  // Login
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal login');
    
    // Simpan ke localStorage
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  // Logout
  logout: async () => {
    const token = localStorage.getItem('auth_token');
    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};