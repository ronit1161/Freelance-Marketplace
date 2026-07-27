import { useState } from "react";
import { addMoneyToWallet } from "../../../Services/walletapi";
import WalletCard from "../components/WalletCard";

export default function WalletPage({ userId }) {
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState({ error: null, success: false, values: { amount: "" } });
    const handleFormSubmit = async (e) => {

        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        try {
            await addMoneyToWallet(userId, Number(payload.amount));
            // On success, clear the stored inputs
            setState({ error: null, success: true, values: { amount: "" } });
            e.target.reset(); // Reset the DOM form
        } catch (err) {
            // On failure, preserve the typed payload in state alongside the error message!
            setState({
                error: err.message,
                success: false,
                values: payload,
            });
        } finally {
            setIsPending(false);
        }
    }
    return (
        <div>
            <div>
                <h1>Wallet</h1>
                <WalletCard userId={userId} />
            </div>
            <div>
                <h1>Add Money</h1>
                <form onSubmit={handleFormSubmit}>
                    <label htmlFor="amount">Amount
                        <input id="amount" name="amount" type="number" required defaultValue={state.values.amount || ""}></input>
                    </label>
                    <button type="submit">Add Money</button>
                </form>
            </div>
        </div>
    );
}