import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage'; // Renamed Login component to LoginPage for clarity
import DashboardPage from './pages/DashboardPage'; // Assuming Dashboard component is now a page
import UserManagementPage from './pages/UserManagementPage'; // Assuming UserManagement is a page
import ProductManagementPage from './pages/ProductManagementPage'; // Assuming ProductManagement is a page

// Placeholder pages for Analytics and Settings
const AnalyticsPage: React.FC = () => <div className="text-center py-12"><p>Analytics page coming soon...</p></div>;
const SettingsPage: React.FC = () => <div className="text-center py-12"><p>Settings page coming soon...</p></div>;
const NotFoundPage: React.FC = () => <div className="text-center py-12"><p>404 - Page Not Found</p></div>;


// ProtectedRoute component
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout> {/* Layout now wraps Outlet for protected routes */}
      <Outlet /> {/* Child routes will render here */}
    </Layout>
  );
};


const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Default to dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/products" element={<ProductManagementPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}
    </Routes>
  );
};

function App() {
  // IMPORTANT: Ensure react-router-dom is installed (npm install react-router-dom)
  // Also, ensure page components like LoginPage, DashboardPage etc. are created or renamed.
  // For this refactor, I'm assuming:
  // - Login.tsx -> pages/LoginPage.tsx
  // - Dashboard.tsx -> pages/DashboardPage.tsx (or similar)
  // - UserManagement.tsx -> pages/UserManagementPage.tsx
  // - ProductManagement.tsx -> pages/ProductManagementPage.tsx
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;