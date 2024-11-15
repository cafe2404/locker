// PasswordContext.tsx
import { useLock } from '@renderer/hooks/useLock';
import React, { createContext, useEffect, useState } from 'react';

export type PasswordContextType = {
    passwordData: IPasswordData[];
    setPasswordData: React.Dispatch<React.SetStateAction<IPasswordData[]>>;
    createPasswordData: (data: IPasswordData) => Promise<boolean>;
    deletePasswordData: (id: number) => Promise<void>;
    updatePasswordData: (data: IPasswordData) => Promise<boolean>;
};

export const PasswordContext = createContext<PasswordContextType | null>(null);

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [passwordData, setPasswordData] = useState<IPasswordData[]>([]);
    const { currentUser,isLocked } = useLock();

    useEffect(() => {
        const fetchPasswordData = async () => {
            const data = await window.api.getPasswordData();
            setPasswordData(data);
        };
        if (!isLocked) {
            fetchPasswordData();
        }
    }, [isLocked]);

    const createPasswordData = async (data: IPasswordData) => {
        if (currentUser?.id) {
            const newData = {
                ...data,
                user_id: currentUser.id,
                icon: data.icon || 'https://static.vecteezy.com/system/resources/previews/012/909/522/non_2x/internet-icon-in-blue-circle-free-png.png',
            };
            const { id } = await window.api.createPasswordData(newData);
            newData.id = id;
            setPasswordData([newData, ...passwordData]);
            return true
        }
        return false
    }
    const deletePasswordData = async (id: number) => {
        await window.api.deletePasswordData(id);
        setPasswordData(passwordData.filter(item => item.id !== id));
    };
    const updatePasswordData = async (data: IPasswordData) => {
        if (currentUser?.id && data.id) {
            await window.api.updatePasswordData({
                ...data,
            });
            setPasswordData(passwordData.map(item => item.id === data.id ? data : item));
            return true
        }
        return false
    };

    return (
        <PasswordContext.Provider value={{
            passwordData, setPasswordData,
            createPasswordData,
            deletePasswordData,
            updatePasswordData,
        }}>
            {children}
        </PasswordContext.Provider>
    );
};
