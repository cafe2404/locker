import { useContext } from "react";
import { PasswordContext } from "@context/PasswordContext";


export function usePassword() {
    const context = useContext(PasswordContext);
    if (!context) {
        throw new Error('usePassword must be used within a PasswordProvider');
    }
    return context;
}
