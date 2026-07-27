import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CreateProjectModal from "../Components/CreateProjectModal"
import ClientNavBar from "../Components/ClientNavBar";
import { useOrders } from "../../Hooks/useOrder";
import OrdersList from "../../orders/components/OrderList";
import WalletCard from "../../wallet/components/WalletCard";

export default function ClientDashboard() {
    const navigate = useNavigate();
    const { orders, isLoading, error } = useOrders({ userId: 42, limit: 3, page: 1 });
    const [isOpenCreateProjectModal, setIsOpenCreateProjectModal] = useState(false);
    return (
        <div>
            <div>Welcome User Name</div>
            <div> <button onClick={() => setIsOpenCreateProjectModal(true)}>Post a new request</button>
                <br />
                <button onClick={() => navigate('/gigs')}>Search</button>
            </div>
            <ClientNavBar />
            <div>
                <OrdersList isLoading={isLoading} error={error} orders={orders} />
            </div>
            <div>
                <WalletCard userId={null} />
            </div>
            <div>
                <CreateProjectModal
                    isOpen={isOpenCreateProjectModal}
                    onClose={() => setIsOpenCreateProjectModal(false)}
                />
            </div>

        </div>
    )
}
