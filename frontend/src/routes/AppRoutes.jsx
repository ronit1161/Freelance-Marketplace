import { Route, Routes } from "react-router-dom";
// import Login from "../pages/Auth/Login";
import RootLayout from "../components/layout/RootLayout";
import CreateGig from "../pages/freelancer/CreateGig";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
import Orders from "../pages/User/Orders";
export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup"element= {<Signup/>}/>

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