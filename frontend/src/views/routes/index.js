import { Routes, Route } from "react-router-dom";
import AdminRoute from "./admin-route";
import UserRoute from "./user-route";
import PublicRoute from "./public-route";
import LoadableComponent from "../../components/loadable-component";

const Schedule = LoadableComponent(() => import("../pages/schedule/index.jsx"));

const AllRoutes = () => {
    return (
        <Routes>
            {/* // public route  */}
            <Route element={<PublicRoute />}>
                <Route path="/schedule" element={<Schedule />} />
            </Route>

            {/* organization route */}
            <Route element={<AdminRoute />}>
                {/* <Route
                    path="/create-post/:activityId"
                    element={<MainLayout component={CreatePost} />}
                /> */}
            </Route>

            {/* candidate route */}
            <Route element={<UserRoute />}></Route>
        </Routes>
    );
};

export default AllRoutes;
