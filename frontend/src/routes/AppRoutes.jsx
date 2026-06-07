import { Route, Routes } from "react-router-dom";
// import Login from "../pages/Auth/Login";
import RootLayout from "../components/layout/RootLayout";
import CreateGig from "../pages/freelancer/CreateGig";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
<<<<<<< HEAD
import Orders from "../pages/User/Orders";
=======
import GigDetails from "../pages/freelancer/GigDetails";
>>>>>>> 67175829047176df81f4a4fe0b8756e8999ce320
export default function AppRoutes(){
    return(
        <Routes>
            {/* <Route path="/login" element={<Login />} /> */}

            <Route path="/" element={<RootLayout />}>
                <Route index element={ <FreelancerDashboard /> } />
                <Route path="create-gig" element={<CreateGig />} />
                <Route path="gig-details" element={<GigDetails />} />
                <Route path="profile" element={<FreelancerProfile />} />
                {/* <Route path="user" element={<UserDashboard/>}/> */}
                <Route path="/orders" element={<Orders />} />
            </Route>

        </Routes>
    )
}