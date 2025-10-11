import {createContext, useContext, useEffect, useState} from "react";

interface SecurityType {
    invalidLoginCount: number;
}

interface SecurityContextType {
    security: SecurityType;
    initSecurity: (invalidLoginCount: number) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const getInitialSecurity = (): SecurityType => {
        return {
            invalidLoginCount: sessionStorage.getItem("invalidLoginCount") || 0,
        };
    };

    const [security, setSecurity] = useState<SecurityType>(getInitialSecurity);

    useEffect(() => {
        const invalidLoginCount = parseInt(sessionStorage.getItem("invalidLoginCount"));
        if (invalidLoginCount != undefined) {
            setSecurity({
                invalidLoginCount,
            });
        }
    }, [])

    const initSecurity = (invalidLoginCount: number) => {
        setSecurity({
            invalidLoginCount,
        });

        sessionStorage.setItem("invalidLoginCount", string(invalidLoginCount));
    }

    return (
        <SecurityContext.Provider value={{security, initSecurity}}>
            {children}
        </SecurityContext.Provider>
    );
};

export const useSecurity = () : SecurityContextType => {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error("useContext must be used within a SecurityContextProvider");
    }
    return context;
}
