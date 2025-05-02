// import { Navigate, Outlet } from "react-router-dom";
// import axiosInstance from "./axiosInstance";
// import { useEffect, useState } from "react";
//
// const ProtectedRoute = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(null);
//
//     useEffect(() => {
//         axiosInstance
//             .get("/auth/check-session") // Backend endpoint to check session
//             .then(() => setIsAuthenticated(true))
//             .catch(() => setIsAuthenticated(false));
//     }, []);
//
//     if (isAuthenticated === null) return <p>Loading...</p>;
//
//     return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
// };
//
// export default ProtectedRoute;
