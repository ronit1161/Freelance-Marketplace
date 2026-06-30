import { Route, Routes } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/home/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

// Freelancer pages
import FreelancerDashboard from "../pages/freelancer/FreelancerDashboard";
import CreateGig from "../pages/freelancer/CreateGig";
import EditProfile from "../pages/freelancer/EditProfile";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";

// Client pages
import ClientDashboard from "../pages/client/ClientDashboard";
import ClientProjects from "../pages/client/ClientProjects";
import ClientWallet from "../pages/client/ClientWallet";
import ClientProfile from "../pages/client/ClientProfile";

// Gig pages
import GigMarketplacePage from "../pages/gigs/GigMarketplacePage";
import GigDetailsPage from "../pages/gigs/GigDetailsPage";

// Admin page
import Dashboard from "../pages/admin/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        
        {/* Gig Marketplace */}
        <Route path="gigs" element={<GigMarketplacePage />} />
        <Route path="gigs/:id" element={<GigDetailsPage />} />

        {/* Freelancer Console */}
        <Route path="freelancer">
          <Route index element={<FreelancerDashboard />} />
          <Route path="create-gig" element={<CreateGig />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="profile" element={<FreelancerProfile />} />
        </Route>

        {/* Client Console */}
        <Route path="client">
          <Route index element={<ClientDashboard />} />
          <Route path="projects" element={<ClientProjects />} />
          <Route path="wallet" element={<ClientWallet />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* Admin Console */}
        <Route path="admin" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}