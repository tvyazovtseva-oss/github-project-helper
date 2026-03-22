import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProtectedRoute, RoleGuard } from "@/components/ProtectedRoute";

// Lazy-load all pages to prevent module-level crashes from killing the app
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

const MamaLayout = lazy(() => import("@/layouts/MamaLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const MamaHomePage = lazy(() => import("@/pages/mama/MamaHomePage"));
const MamaCoursesPage = lazy(() => import("@/pages/mama/MamaCoursesPage"));
const MamaCourseDetailPage = lazy(() => import("@/pages/mama/MamaCourseDetailPage"));
const MamaHealthPage = lazy(() => import("@/pages/mama/MamaHealthPage"));
const MamaLibraryPage = lazy(() => import("@/pages/mama/MamaLibraryPage"));
const MamaChatPage = lazy(() => import("@/pages/mama/MamaChatPage"));
const MamaNotificationsPage = lazy(() => import("@/pages/mama/MamaNotificationsPage"));
const MamaProfilePage = lazy(() => import("@/pages/mama/MamaProfilePage"));

const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminBroadcastsPage = lazy(() => import("@/pages/admin/AdminBroadcastsPage"));
const AdminFunnelsPage = lazy(() => import("@/pages/admin/AdminFunnelsPage"));
const AdminLessonsPage = lazy(() => import("@/pages/admin/AdminLessonsPage"));
const AdminAccessPage = lazy(() => import("@/pages/admin/AdminAccessPage"));
const AdminNotificationsPage = lazy(() => import("@/pages/admin/AdminNotificationsPage"));
const AdminContentPage = lazy(() => import("@/pages/admin/AdminContentPage"));
const AdminPaymentsPage = lazy(() => import("@/pages/admin/AdminPaymentsPage"));
const DoctorTicketsPage = lazy(() => import("@/pages/admin/DoctorTicketsPage"));

const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-dvh flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppRoutes() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
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
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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
