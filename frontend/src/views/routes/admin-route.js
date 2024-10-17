import React from "react";
import { Outlet } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";

const AdminRoute = () => {
    // const { account } = useAuth();

    // if (account && account.role === 3) {
        return <Outlet />;
    // } else {
    //     return <Navigate to="/auth/login" />;
    // }
    
};

export default AdminRoute;
