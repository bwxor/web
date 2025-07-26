import React, { createContext, useEffect, useState, useContext } from 'react';

interface AuthType {
    token: string;
    email: string;
    displayName: string;
}

interface AuthenticationContextType {
    auth : AuthType;
    initAuth: (token: string, email:string, displayName: string) => void;
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthType>({ token: "", email: "", displayName: "" });

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const email = sessionStorage.getItem("email");
        const displayName = sessionStorage.getItem("displayName");
        if (token != null && token != "" && email != null && email != "" && displayName != null && displayName != "") {
            setAuth({
                token,
                email,
                displayName
            });
        }
    }, []);

    const initAuth = (token: string, email:string, displayName: string) => {
        setAuth({
            token,
            email,
            displayName
        });

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("displayName", displayName);
    };

    return (
        <AuthenticationContext.Provider value={{ auth, initAuth }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export const useAuth = (): AuthenticationContextType => {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthenticationContextProvider");
    }
    return context;
};