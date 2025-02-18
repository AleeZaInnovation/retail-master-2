import { lazy } from "react";
import SuperAdminLogin from "../../views/auth/SuperAdminLogin.jsx";
import Pending from "../../views/Pending.jsx";
const Login = lazy(() => import("../../views/auth/Login"))
const Register = lazy(() => import("../../views/auth/Register"))
const AdminLogin = lazy(() => import("../../views/auth/AdminLogin.jsx"))
const ForgotPassword = lazy(() => import("../../views/auth/ForgotPassword.jsx"))
const ResetPassword = lazy(() => import("../../views/auth/ResetPassword.jsx"))
const AdminRegister = lazy(() => import("../../views/auth/AdminRegister.jsx"))
const Home = lazy(() => import("../../views/Home.jsx"))
const UnAuthorized = lazy(() => import("../../views/UnAuthorized.jsx"))
const Success = lazy(() => import("../../views/Success.jsx"))

const publicRoutes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/forgot/password',
        element: <ForgotPassword />
    },
    {
        path: '/reset/password/:token',
        element: <ResetPassword />
    },
    {
        path: '/admin/login',
        element: <AdminLogin />
    },
    {
        path: '/admin/register',
        element: <AdminRegister />
    },
    {
        path: '/super-admin/login',
        element: <SuperAdminLogin />
    },
    {
        path: '/unauthorized',
        element: <UnAuthorized />
    },
    {
        path: '/success?',
        element: <Success />
    },
    {
        path: '/pending?',
        element: <Pending />
    },

]

export default publicRoutes;