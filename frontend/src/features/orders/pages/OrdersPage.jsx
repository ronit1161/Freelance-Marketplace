import { useOrders } from "../../Hooks/useOrder";
import { useSearchParams } from "react-router-dom";
import OrdersList from "../components/OrderList";
import { PaginationControls } from "../../../components/common/PaginationControl";

export default function OrdersPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const { orders, totalPages, isLoading, error } = useOrders({ page: currentPage, limit: 10 });
    const handlePageChange = (newPage) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSearchParams({ page: newPage });
    }
    return (
        <div>
            <h1>Orders</h1>
            <OrdersList orders={orders} isLoading={isLoading} error={error} />
            <PaginationControls
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
            />
        </div>
    )
}