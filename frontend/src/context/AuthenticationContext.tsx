import React, { createContext, useEffect, useState, useContext } from 'react';

interface AuthType {
    token: string;
    id: string,
    email: string;
    displayName: string;
}

interface AuthenticationContextType {
    auth : AuthType;
     initAuth: (token: string, id:string, email:string, displayName: string) => void;
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const getInitialAuth = (): AuthType => {
        return {
            token: sessionStorage.getItem("token") || "",
            id: sessionStorage.getItem("id") || "",
            email: sessionStorage.getItem("email") || "",
            displayName: sessionStorage.getItem("displayName") || "",
        };
    };

    const [auth, setAuth] = useState<AuthType>(getInitialAuth);


    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const id = sessionStorage.getItem("id");
        const email = sessionStorage.getItem("email");
        const displayName = sessionStorage.getItem("displayName");
        if (token != null && token != "" && id != null && id != "" && email != null && email != "" && displayName != null && displayName != "") {
            setAuth({
                token,
                id,
                email,
                displayName
            });
        }
    }, []);

    const initAuth = (token: string, id:string, email:string, displayName: string) => {
        setAuth({
            token,
            id,
            email,
            displayName
        });

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("id", id);
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