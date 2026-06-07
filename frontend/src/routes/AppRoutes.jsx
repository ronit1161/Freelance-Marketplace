import { Route, Routes } from "react-router-dom";
// import Login from "../pages/Auth/Login";
import RootLayout from "../components/layout/RootLayout";
import CreateGig from "../pages/freelancer/CreateGig";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
import GigDetails from "../pages/freelancer/GigDetails";
export default function AppRoutes(){
    return(
        <Routes>
            {/* <Route path="/login" element={<Login />} /> */}

            <Route path="/" element={<RootLayout />}>
                <Route index element={ <FreelancerDashboard /> } />
                <Route path="create-gig" element={<CreateGig />} />
                <Route path="gig-details" element={<GigDetails />} />
                <Route path="profile" element={<FreelancerProfile />} />
            </Route>

        </Routes>
    )
}