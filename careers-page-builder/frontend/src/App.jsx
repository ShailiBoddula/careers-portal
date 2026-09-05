import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import RecruiterBuilder from './pages/RecruiterBuilder';
import PublicCareers from './pages/PublicCareers';
import JobDetail from './pages/JobDetail';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Recruiter Routes */}
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/:companySlug/edit"
          element={
            <ProtectedRoute>
              <RecruiterBuilder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:companySlug/preview"
          element={
            <ProtectedRoute>
              <RecruiterBuilder />
            </ProtectedRoute>
          }
        />

        {/* Public Candidate Routes (No JWT required) */}
        <Route path="/:companySlug/careers" element={<PublicCareers />} />
        <Route path="/:companySlug/careers/jobs/:jobId" element={<JobDetail />} />

        {/* Default redirect to demo login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
