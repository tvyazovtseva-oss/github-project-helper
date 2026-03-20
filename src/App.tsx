import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProtectedRoute, RoleGuard } from "@/components/ProtectedRoute";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import MamaLayout from "@/layouts/MamaLayout";
import AdminLayout from "@/layouts/AdminLayout";

import MamaHomePage from "@/pages/mama/MamaHomePage";
import MamaCoursesPage from "@/pages/mama/MamaCoursesPage";
import MamaCourseDetailPage from "@/pages/mama/MamaCourseDetailPage";
import MamaHealthPage from "@/pages/mama/MamaHealthPage";
import MamaLibraryPage from "@/pages/mama/MamaLibraryPage";
import MamaChatPage from "@/pages/mama/MamaChatPage";
import MamaNotificationsPage from "@/pages/mama/MamaNotificationsPage";
import MamaProfilePage from "@/pages/mama/MamaProfilePage";

import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminBroadcastsPage from "@/pages/admin/AdminBroadcastsPage";
import AdminFunnelsPage from "@/pages/admin/AdminFunnelsPage";
import AdminLessonsPage from "@/pages/admin/AdminLessonsPage";
import AdminAccessPage from "@/pages/admin/AdminAccessPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import AdminContentPage from "@/pages/admin/AdminContentPage";
import AdminPaymentsPage from "@/pages/admin/AdminPaymentsPage";
import DoctorTicketsPage from "@/pages/admin/DoctorTicketsPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getDefaultRedirect = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'mama': return '/mama';
      case 'doctor': return '/doctor';
      case 'admin': return '/admin';
      default: return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRedirect()} replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to={getDefaultRedirect()} replace /> : <RegisterPage />} />

      {/* Mama Portal */}
      <Route path="/mama" element={<ProtectedRoute><RoleGuard allowedRoles={['mama']}><MamaLayout /></RoleGuard></ProtectedRoute>}>
        <Route index element={<MamaHomePage />} />
        <Route path="courses" element={<MamaCoursesPage />} />
        <Route path="courses/:id" element={<MamaCourseDetailPage />} />
        <Route path="health" element={<MamaHealthPage />} />
        <Route path="library" element={<MamaLibraryPage />} />
        <Route path="chat" element={<MamaChatPage />} />
        <Route path="notifications" element={<MamaNotificationsPage />} />
        <Route path="profile" element={<MamaProfilePage />} />
      </Route>

      {/* Doctor Portal */}
      <Route path="/doctor" element={<ProtectedRoute><RoleGuard allowedRoles={['doctor']}><AdminLayout role="doctor" /></RoleGuard></ProtectedRoute>}>
        <Route index element={<DoctorTicketsPage />} />
      </Route>

      {/* Support Portal */}
      <Route path="/support" element={<ProtectedRoute><RoleGuard allowedRoles={['support']}><AdminLayout role="admin" /></RoleGuard></ProtectedRoute>}>
        <Route index element={<DoctorTicketsPage />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<ProtectedRoute><RoleGuard allowedRoles={['admin']}><AdminLayout role="admin" /></RoleGuard></ProtectedRoute>}>
        <Route index element={<AdminAnalyticsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="tickets" element={<DoctorTicketsPage />} />
        <Route path="broadcasts" element={<AdminBroadcastsPage />} />
        <Route path="funnels" element={<AdminFunnelsPage />} />
        <Route path="lessons" element={<AdminLessonsPage />} />
        <Route path="access" element={<AdminAccessPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? getDefaultRedirect() : '/login'} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
