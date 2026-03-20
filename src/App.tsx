import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "./components/AdminLayout";
import ProductsPage from "./pages/ProductsPage";
import NotificationsPage from "./pages/NotificationsPage";
import BroadcastsPage from "./pages/BroadcastsPage";
import UsersPage from "./pages/UsersPage";
import FunnelsPage from "./pages/FunnelsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LmsPage from "./pages/LmsPage";
import ContentGenPage from "./pages/ContentGenPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="broadcasts" element={<BroadcastsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="funnels" element={<FunnelsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="lms" element={<LmsPage />} />
            <Route path="content-gen" element={<ContentGenPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
