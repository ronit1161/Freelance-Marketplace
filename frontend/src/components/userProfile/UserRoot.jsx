import { Outlet } from "react-router-dom"
import Footer from "../layout/Footer"
import UserNavbar from "./UserNavbar"

const UserRoot =()=>{
    return (
         <div className="min-h-screen bg-white font-[Inter,Helvetica,sans-serif] text-[#191c1d]">
      <UserNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
    )
}

export default UserRoot