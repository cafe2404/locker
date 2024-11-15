// LockContext.tsx
import React, { createContext, useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';

export type LockContextType = {
    isLocked: boolean;
    lock: (user?: IUser) => void;
    unlock: ({ username, password }: { username: string, password: string }) => Promise<boolean>;
    currentUser?: IUser | null;
    setCurrentUser: (user: IUser | null) => void;
    settings: IUserSettings | null;
    setSettings: (settings: IUserSettings) => void;
}

export const LockContext = createContext<LockContextType | undefined>(undefined);

export const LockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLocked, setIsLocked] = useState(true);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [settings, setSettings] = useState<IUserSettings | null>(null);
    const [idleTimeoutId, setIdleTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const lock = (user?: IUser) => {
        setIsLocked(true);
        if (user) {
            setCurrentUser(user);
        }
        navigate('/lock');
    };
    const unlock = async ({ username, password }: { username: string, password: string }): Promise<boolean> => {
        if (isLocked) {
            const authenticated = await window.api.authenticateUser({ username, password });
            if (authenticated.success) {
                setIsLocked(false);
                setCurrentUser(authenticated.user);
                if (authenticated.user.settings) {
                    setSettings(authenticated.user.settings);
                    resetIdleTimer();
                }
                navigate('/');
                return true;
            }
            return false;
        }
        return false;
    };
    const resetIdleTimer = () => {
        if (idleTimeoutId) {
            clearTimeout(idleTimeoutId);
        }
        if (settings?.auto_lock_time  && settings?.auto_lock_time !== -1) {
            const timeout = setTimeout(() => {
                lock();
            }, settings?.auto_lock_time * 1000);
            setIdleTimeoutId(timeout);
        }
    };

    useEffect(() => {
        const handleLock = () => {
            if (currentUser) { 
                lock(currentUser);
            }
        };
        window.electron.ipcRenderer.on("lock-app", handleLock);
        return () => {
            window.electron.ipcRenderer.removeListener("lock-app", handleLock);
        };
    }, [currentUser]);

    useEffect(() => {
        const handleSelectUser = (_, user: IUser) => {
            lock(user);
        };
        window.electron.ipcRenderer.on("select-user", handleSelectUser);
        return () => {
            window.electron.ipcRenderer.removeListener("select-user", handleSelectUser);
        };
    }, []);

    useEffect(() => {
        resetIdleTimer();
    }, [settings?.auto_lock_time]);

    useEffect(() => {
        const onChangeSettings = async () => {
            await window.api.updateUserSettings(settings);
            if (settings) {
                await window.api.toggleStartUp(settings.start_up_mode);
            }
        }
        if (settings) {
            onChangeSettings();
        }
    }, [settings]);


    return (
        <LockContext.Provider value={{
            isLocked, lock, unlock,
            currentUser, setCurrentUser,
            settings, setSettings
        }}>
            {children}
        </LockContext.Provider>
    );
};