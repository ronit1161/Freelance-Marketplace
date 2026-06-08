import { Route, Routes } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import CreateGig from "../pages/freelancer/CreateGig";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
import Orders from "../pages/User/Orders";
import FreelancerDashboard from '../pages/freelancer/FreelancerDashboard';
import GigDetails from '../pages/freelancer/GigDetails';
import Login from '../pages/Auth/loginPage';
import Signup from '../pages/Auth/Register';
import Dashboard from "../pages/admin/Dashboard";
import EditProfile from "../pages/freelancer/EditProfile";
import NotFoundPage from "../pages/NotFoundPage";
import ClientProfile from "../pages/User/ClientProfile";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFoundPage />} />

            <Route path="/" element={<RootLayout />}>
                <Route index element={<FreelancerDashboard />} />
                <Route path="create-gig" element={<CreateGig />} />
                <Route path="gig-details" element={<GigDetails />} />
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="profile" element={<FreelancerProfile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/client-profile" element={<ClientProfile />} />
            </Route>

        </Routes>
    )
}
