import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

import StoreFeed from './pages/User/StoreFeed';
import ManageStores from './pages/Admin/ManageStores';
import ManageUsers from './pages/Admin/ManageUsers';
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
    const { user } = useAuth();
    
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'STORE_OWNER' ? '/owner' : '/user'} replace /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Admin Routes - Specific routes MUST come before the catch-all */}
            <Route 
                path="/admin/stores" 
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <ManageStores />
                    </ProtectedRoute>
                } 
            />

            <Route 
                path="/admin/users" 
                element={<ProtectedRoute allowedRole="ADMIN"><ManageUsers /></ProtectedRoute>} 
            />

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