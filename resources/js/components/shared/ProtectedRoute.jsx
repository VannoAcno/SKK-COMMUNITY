// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Cek apakah user sudah login (ada token di localStorage)
  const token = localStorage.getItem('auth_token');

  if (!token) {
    // Jika belum login, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan halaman yang diminta
  return children;
}