import { NavLink } from "react-router-dom";

export default function ClientNavBar() {
    return (
        <div>
            <div>
                <NavLink to="/client">Home</NavLink>
                <NavLink to="/client/orders">All Orders</NavLink>
                <NavLink to="/client/wallet">Wallet</NavLink>
                <NavLink to="/client/analytics">Analytics</NavLink>
            </div>
        </div>
    )
}