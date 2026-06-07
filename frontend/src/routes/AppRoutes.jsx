import { Route, Routes } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import CreateGig from "../pages/freelancer/CreateGig";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
import FreelancerDashboard from "../pages/freelancer/FreelancerDashboard";
import EditProfile from "../pages/freelancer/EditProfile";
export default function AppRoutes(){
    return(
        <Routes>

            <Route path="/" element={<RootLayout />}>
                <Route index element={ <FreelancerDashboard /> } />
                <Route path="create-gig" element={<CreateGig />} />
                <Route path="profile" element={<FreelancerProfile />} />
                <Route path="dashboard" element={<FreelancerDashboard />} />
                <Route path="edit-profile" element={<EditProfile />} />
            </Route>

        </Routes>
    )
}