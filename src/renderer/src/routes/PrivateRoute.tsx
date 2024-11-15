// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLock } from '@hooks/useLock'; // Nhập context lock

interface PrivateRouteProps {
    children: React.ReactNode; // Tham số cho children là các component cần bảo vệ
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isLocked } = useLock(); // Lấy trạng thái isLocked từ context

    // Nếu bị khóa, điều hướng đến màn hình khóa, nếu không hiển thị children
    return isLocked ? <Navigate to="/lock" replace /> : <>{children}</>;
};

export default PrivateRoute;
