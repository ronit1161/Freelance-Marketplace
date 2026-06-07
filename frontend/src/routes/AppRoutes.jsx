import { Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/Login";
import RootLayout from "../components/layout/RootLayout";
import CreateGig from "../pages/freelancer/CreateGig";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup"element= {<Signup/>}/>

            <Route path="/" element={<RootLayout />}>
                <Route index element={<h1>Home Page</h1>} />
                <Route path="create-gig" element={<CreateGig />} />
                <Route path="profile" element={<FreelancerProfile />} />
            </Route>

        </Routes>
    )
}

