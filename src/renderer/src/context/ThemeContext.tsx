// ThemeContext.tsx
import React, { createContext, useEffect, useState } from 'react';

export type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const storedMode = localStorage.getItem('theme');
        return storedMode ? storedMode : 'system';
    });

    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    const applyTheme = (newTheme: string) => {
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (newTheme === 'system') {
            // Áp dụng chế độ màu của hệ thống
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        // Gửi thông báo thay đổi theme
        window.electron.ipcRenderer.send('change-theme', newTheme);

        // Lưu theme vào localStorage
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        // Lắng nghe sự thay đổi của chế độ màu hệ thống
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        // Kiểm tra và thiết lập giá trị ban đầu cho isDarkMode
        setIsDarkMode(mediaQueryList.matches);
        mediaQueryList.addEventListener('change', handleChange);

        return () => {
            mediaQueryList.removeEventListener('change', handleChange);
        };
    }, []);

    useEffect(() => {
        // Gọi hàm applyTheme mỗi khi theme thay đổi
        applyTheme(theme);
    }, [theme, isDarkMode]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, setIsDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
