import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

interface Props {
    isAuth: boolean;
}

const PrivateRoutes: React.FC<Props> = ({ isAuth }: Props) => {
    return isAuth ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoutes;
