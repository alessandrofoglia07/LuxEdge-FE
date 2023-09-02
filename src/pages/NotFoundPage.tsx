import React from 'react';
import { Navigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return <Navigate to='/' />;
};

export default NotFoundPage;
