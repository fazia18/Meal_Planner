import React from 'react'
import { Navigate } from 'react-router-dom'
function PrivateRoute({ children }) {
    const userData = localStorage.getItem('loggedInUser');
    if (!userData) {
        return <Navigate to="/" replace />
    }
    return children
}
export default PrivateRoute;
