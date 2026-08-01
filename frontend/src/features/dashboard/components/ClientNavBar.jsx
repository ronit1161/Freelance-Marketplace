import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Wallet } from "lucide-react";

export default function ClientNavBar() {
    const navItems = [
        { to: "/client", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/client/orders", label: "Orders", icon: ShoppingBag },
        { to: "/client/wallet", label: "Wallet", icon: Wallet },
    ];

    return (
        <div className="bg-white border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto py-2">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                    ? "bg-blue-50 text-[#0058be] border border-blue-100 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
