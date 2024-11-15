import { useContext } from "react";
import { LockContext } from "@context/LockContext";


export function useLock() {
    const context = useContext(LockContext);
    if (!context) {
        throw new Error('useLock must be used within a LockProvider');
    }
    return context;
}
