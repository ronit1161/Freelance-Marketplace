import {  useState } from "react";
import { createOrder } from "../../../Services/ordersApi";

export default function CreateProjectModal({ isOpen, onClose }){
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState({ error: null, success: false ,values: { name: "", email: "" }});
    
    const handleFormSubmit=async(e)=>{
   
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
   try {
      await createOrder(payload);
      // On success, clear the stored inputs
      setState({ error: null, success: true, values: { name: "", email: "" } });
      e.target.reset(); // Reset the DOM form
      onClose();
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
    if (!isOpen) return null;
    
    return(
        <div>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="freelancerId">freelancerId
                    <input id="freelancerId" name="freelancerId" type="text" required defaultValue={state.values.freelancerId|| ""}></input>
                </label>
                <label htmlFor="gigId">gigId
                    <input id="gigId" name="gigId" type="text" required defaultValue={state.values.gigId|| ""}></input>
                </label>
                <label htmlFor="requirements">requiremnets
                    <input id="requirements" name="requirements" type="text" required defaultValue={state.values.requirements|| ""}></input>
                </label>
                <button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
                </button>
                <button onClick={onClose}>Cancel</button>
            </form>
        </div>
    )
}