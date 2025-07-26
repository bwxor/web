import React, { createContext, useEffect, useState, useContext } from 'react';

interface AuthType {
    email: string;
    displayName: string;
}

interface AuthenticationContextType {
    auth : AuthType;
    initAuth: (email:string, displayName: string) => void;
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthType>({ email: "", displayName: "" });

    useEffect(() => {
        const email = sessionStorage.getItem("email");
        const displayName = sessionStorage.getItem("displayName");
        if (email != null && displayName != null) {
            setAuth({
                email,
                displayName
            });
        }
    }, []);

    const initAuth = (email:string, displayName: string) => {
        setAuth({
            email,
            displayName
        });

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