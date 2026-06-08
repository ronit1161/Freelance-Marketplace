import { Route, Routes, Outlet } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import CreateGig from "../pages/freelancer/CreateGig";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
import Orders from "../pages/User/Orders";
import FreelancerDashboard from "../pages/freelancer/FreelancerDashboard";
import GigDetails from "../pages/freelancer/GigDetails";
import Login from "../pages/Auth/loginPage";
import Signup from "../pages/Auth/Register";
import Dashboard from "../pages/admin/Dashboard";
import EditProfile from "../pages/freelancer/EditProfile";
import NotFoundPage from "../pages/NotFoundPage";
import ClientProfile from "../pages/User/ClientProfile";
import HomePage from "../pages/home/HomePage";

function FreelancerRouteLayout() {
  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="freelancer" element={<FreelancerRouteLayout />}>
          <Route index element={<FreelancerDashboard />} />
          <Route path="create-gig" element={<CreateGig />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        <Route path="profile" element={<FreelancerProfile />} />
        <Route path="gig-details" element={<GigDetails />} />
        <Route path="client" element={<Orders />} />
        <Route path="admin" element={<Dashboard />} />
        <Route path="client-profile" element={<ClientProfile />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}