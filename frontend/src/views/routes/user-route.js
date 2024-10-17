import React from "react";
import { Outlet } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";

const UserRoute = () => {
    // const { account } = useAuth();

    // if (account && account.role === 1) {
        return <Outlet />;
    // } else {
    //     return <Navigate to="/auth/login" />;
    // }
};

export default UserRoute;
