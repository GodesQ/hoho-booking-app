"use client"
import { createContext, useContext, useState } from "react";

const AppContext = createContext({
    token: ''
});

export function AppWrapper({children}) {
    let  [state, setState] = useState({
        token: ''
    });

    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}