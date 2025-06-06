'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import FireEffects from './FireEffects';

interface FireContextType {
    isFireEnabled: boolean;
    toggleFire: () => void;
    setFireEnabled: (enabled: boolean) => void;
}

const FireContext = createContext<FireContextType | undefined>(undefined);

export const useFireContext = () => {
    const context = useContext(FireContext);
    if (!context) {
        throw new Error('useFireContext must be used within a FireProvider');
    }
    return context;
};

interface FireProviderProps {
    children: ReactNode;
    defaultEnabled?: boolean;
}

export const FireProvider: React.FC<FireProviderProps> = ({
    children,
    defaultEnabled = false
}) => {
    const [isFireEnabled, setIsFireEnabled] = useState(defaultEnabled);

    const toggleFire = () => {
        setIsFireEnabled(prev => !prev);
    };

    const value = {
        isFireEnabled,
        toggleFire,
        setFireEnabled: setIsFireEnabled
    };

    return (
        <FireContext.Provider value={value}>
            {children}
            {isFireEnabled && <FireEffects />}
        </FireContext.Provider>
    );
};

export default FireProvider;
