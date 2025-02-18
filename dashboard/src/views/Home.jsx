import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { role } = useSelector((state) => state?.auth);
  if (role === "staff") return <Navigate to="/staff/dashboard" />;
  else if (role === "owner") return <Navigate to="/admin/dashboard" />;
  else if (role === "superadmin")
    return <Navigate to="/super-admin/dashboard" />;
  else return <Navigate to="/admin/login" />;
};

export default Home;
