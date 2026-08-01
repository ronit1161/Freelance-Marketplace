import { Route, Routes } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Terms from "../features/auth/pages/Terms";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../components/common/NotFoundPage";

// Protected Route Component
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Freelancer pages
import FreelancerDashboard from "../features/dashboard/pages/FreelancerDashboardPage";
import CreateGig from "../features/gigs/pages/CreateGigPage";
import EditProfile from "../features/profile/pages/EditProfilePage";
import FreelancerProfile from "../features/profile/pages/FreelancerProfilePage";

// Client pages
import ClientDashboardPage from "../features/dashboard/pages/ClientDashboardPage";
import ClientProfile from "../features/profile/pages/ClientProfilePage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import WalletPage from "../features/wallet/pages/WalletPage";

// Gig pages
import GigMarketplacePage from "../features/gigs/pages/GigMarketplacePage";
import GigDetailsPage from "../features/gigs/pages/GigDetailsPage";

// Admin page
import Dashboard from "../features/dashboard/pages/AdminDashboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />

        {/* Public Gig Marketplace */}
        <Route path="gigs" element={<GigMarketplacePage />} />
        <Route path="gigs/:id" element={<GigDetailsPage />} />

        {/* Protected Freelancer Console */}
        {/* <Route element={<ProtectedRoute allowedRoles={["FREELANCER"]} />}> */}
          <Route path="freelancer">
            <Route index element={<FreelancerDashboard />} />
            <Route path="create-gig" element={<CreateGig />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="profile" element={<FreelancerProfile />} />
          </Route>
        {/* </Route> */}

        {/* Protected Client Console */}
        {/* <Route element={<ProtectedRoute allowedRoles={["CLIENT"]} />}> */}
          <Route path="client">
            <Route index element={<ClientDashboardPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>
        {/* </Route> */}

        {/* Protected Admin Console */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="admin" element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}