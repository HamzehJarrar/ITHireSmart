import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const role = localStorage.getItem("role");
  if (role !== allowedRole) {
    return <Navigate to="/404" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
