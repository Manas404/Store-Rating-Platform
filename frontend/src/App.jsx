import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import StoreFeed from './pages/User/StoreFeed';
// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import OwnerDashboard from './pages/StoreOwner/OwnerDashboard';

// Placeholders for other roles (we will build these next)
const UserDashboard = () => <div className="p-10 text-2xl">Normal User Dashboard</div>;
// const OwnerDashboard = () => <div className="p-10 text-2xl">Store Owner Dashboard</div>;
const Unauthorized = () => <div className="p-10 text-2xl text-red-600">403 - Unauthorized</div>;

// The Gatekeeper Component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Admin Routes */}
            <Route 
                path="/admin/*" 
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <AdminDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* Protected User Routes */}
            <Route 
                path="/user/*" 
                element={
                    <ProtectedRoute allowedRole="USER">
                        <StoreFeed />
                    </ProtectedRoute>
                } 
            />

            {/* Protected Store Owner Routes */}
            <Route 
                path="/owner/*" 
                element={
                    <ProtectedRoute allowedRole="STORE_OWNER">
                        <OwnerDashboard />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}