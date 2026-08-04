import { Route, Routes } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Terms from "../features/auth/pages/Terms";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../components/common/NotFoundPage";

// Freelancer pages
import FreelancerDashboard from "../features/dashboard/pages/FreelancerDashboardPage";
import CreateGig from "../features/gigs/pages/CreateGigPage";
import MyGigsPage from "../features/gigs/pages/MyGigsPage";
import EditProfile from "../features/profile/pages/EditProfilePage";
import FreelancerProfile from "../features/profile/pages/FreelancerProfilePage";
import FreelancerOrdersPage from "../features/orders/pages/FreelancerOrdersPage";
import FreelancerReviewsPage from "../features/reviews/pages/FreelancerReviewsPage";
import FreelancerWalletPage from "../features/wallet/pages/FreelancerWalletPage";

// Client pages
import ClientDashboard from "../features/Client/Pages/ClientDashboard";
import ClientProfile from "../features/profile/pages/ClientProfilePage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import WalletPage from "../features/wallet/pages/WalletPage";

// Gig pages
import GigMarketplacePage from "../features/gigs/pages/GigMarketplacePage";
import GigDetailsPage from "../features/gigs/pages/GigDetailsPage";

// Admin page
import Dashboard from "../features/dashboard/pages/AdminDashboardPage";
import CategoryManagementPage from "../features/categories/pages/CategoryManagementPage";
import AdminGigManagementPage from "../features/gigs/pages/AdminGigManagementPage";
import AdminOrderManagementPage from "../features/orders/pages/AdminOrderManagementPage";
import AdminProfilePage from "../features/profile/pages/AdminProfilePage";


import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />

        {/* Gig Marketplace */}
        <Route path="gigs" element={<GigMarketplacePage />} />
        <Route path="gigs/:id" element={<GigDetailsPage />} />

        {/* Freelancer Console */}
        <Route path="freelancer" element={<ProtectedRoute allowedRoles={["FREELANCER"]} />}>
          <Route index element={<FreelancerDashboard />} />
          <Route path="gigs" element={<MyGigsPage />} />
          <Route path="my-gigs" element={<MyGigsPage />} />
          <Route path="orders" element={<FreelancerOrdersPage />} />
          <Route path="reviews" element={<FreelancerReviewsPage />} />
          <Route path="wallet" element={<FreelancerWalletPage />} />
          <Route path="create-gig" element={<CreateGig />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="profile" element={<FreelancerProfile />} />
        </Route>

        {/* Client Console */}
        <Route path="client" element={<ProtectedRoute allowedRoles={["CLIENT"]} />}>
          <Route index element={<ClientDashboard />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="projects" element={<OrdersPage />} />
        </Route>

        {/* Admin Console */}
        <Route path="admin" element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="gigs" element={<AdminGigManagementPage />} />
          <Route path="orders" element={<AdminOrderManagementPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}