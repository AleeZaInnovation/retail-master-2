import { lazy } from "react";
const SuperAdminDashboard = lazy(() => import("../../views/superAdmin/SuperAdminDashboard"));
const Companies = lazy(() => import("../../views/superAdmin/Companies.jsx"));
const CompanyDetails = lazy(() => import("../../views/superAdmin/CompanyDetails.jsx"));
const Branches = lazy(() => import("../../views/superAdmin/Branches.jsx"));
const BranchDetails = lazy(() => import("../../views/superAdmin/BranchDetails.jsx"));
const OwnerRequest = lazy(() => import("../../views/superAdmin/OwnerRequest.jsx"));
const StaffRequest = lazy(() => import("../../views/superAdmin/StaffRequest.jsx"));
const OwnerDetails = lazy(() => import("../../views/superAdmin/OwnerDetails.jsx"));
const Owners = lazy(() => import("../../views/superAdmin/Owners.jsx"));
const StaffDetails = lazy(() => import("../../views/superAdmin/StaffDetails.jsx"));
const Staffs = lazy(() => import("../../views/superAdmin/Staffs.jsx"));
export const superAdminRoutes = [
    {
        path: '/super-admin/dashboard',
        element: <SuperAdminDashboard />,
        role: 'superadmin',
    },
    {
        path: '/super-admin/dashboard/companies',
        element: <Companies />,
        role: 'superadmin',
    },
    {
        path: '/super-admin/dashboard/company/details/:companyId',
        element: <CompanyDetails />,
        role: 'superadmin',
    },
    {
        path: '/super-admin/dashboard/branches',
        element: <Branches />,
        role: 'superadmin',
    },
    {
        path: '/super-admin/dashboard/branch/details/:branchId',
        element: <BranchDetails />,
        role: 'superadmin',
    },
    {
        path: '/super-admin/dashboard/owner-request',
        element: <OwnerRequest />,
        role: 'superadmin',
    }, 
    {
        path: '/super-admin/dashboard/owners',
        element: <Owners />,
        role: 'superadmin',
    },   
    {
        path: '/super-admin/dashboard/owner/details/:ownerId',
        element: <OwnerDetails />,
        role: 'superadmin',
    },
    {
        path: '/super-admin/dashboard/staff-request',
        element: <StaffRequest />,
        role: 'superadmin',
    },
    {
        path: '/super-admin/dashboard/staffs',
        element: <Staffs />,
        role: 'superadmin',
    },   
    {
        path: '/super-admin/dashboard/staff/details/:staffId',
        element: <StaffDetails />,
        role: 'superadmin',
    },
    // {
    //     path: '/super-admin/dashboard/chat-owners',
    //     element: <ChatSellers />,
    //     role: 'superadmin',
    // }
    // ,
    // {
    //     path: '/super-admin/dashboard/chat-owners/:ownerId',
    //     element: <ChatSellers />,
    //     role: 'superadmin',
    // },


]