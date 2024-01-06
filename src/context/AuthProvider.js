import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth } from "../config/firebaseConfig";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [account, setaccount] = useState(null);

    useEffect(() => {
        const unsub = () => onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log("Authenticated user", user);
                setaccount(user);
            }
        });

        // Component unmount
        return () => {
            unsub();
        }
    }, [])

    return (<AuthContext.Provider value={{ account, setaccount }}>{children}</AuthContext.Provider>)
}

export default AuthProvider;