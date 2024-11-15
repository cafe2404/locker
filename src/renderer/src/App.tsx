// App.tsx
import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import MainScreen from "./screen/MainScreen";
import LockScreen from "./screen/LockScreen";
import PrivateRoute from "./routes/PrivateRoute";
import { LockProvider } from '@context/LockContext'; // Nhập LockProvider và useLock
import { ThemeProvider } from "./context/ThemeContext";
import { PasswordProvider } from "./context/PasswordContext";
import { Toaster } from "react-hot-toast";

function App(): JSX.Element {
    return (
        <ThemeProvider>
            <LockProvider>
                <div className="app bg-transparent">
                    <PasswordProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route
                                    index
                                    element={
                                        <PrivateRoute>
                                            <MainScreen />
                                        </PrivateRoute>
                                    }
                                />
                                <Route path="lock" element={<LockScreen />} />
                                <Route path="*" element={<div>404</div>} />
                            </Route>
                        </Routes>
                    </PasswordProvider>
                    <Toaster position="top-center" />
                </div>
            </LockProvider>
        </ThemeProvider>
    );
}

export default App;
