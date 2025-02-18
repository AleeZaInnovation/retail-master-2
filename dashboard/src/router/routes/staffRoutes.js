import { lazy } from "react";
const StaffDashboard = lazy(() =>
  import("../../views/staff/StaffDashboard.jsx")
);
const MakeOrder = lazy(() => import("../../views/staff/MakeOrder.jsx"));
const Drafts = lazy(() => import("../../views/staff/Drafts.jsx"));
const Orders = lazy(() => import("../../views/staff/Orders.jsx"));
const Profile = lazy(() => import("../../views/staff/Profile.jsx"));
const Service = lazy(() => import("../../views/staff/Service.jsx"));
// const Products = lazy(() => import("../../views/staff/Products.jsx"));
// const DiscountProducts = lazy(() => import("../../views/staff/DiscountProducts.jsx"));
// const Orders = lazy(() => import("../../views/staff/Orders.jsx"));
const Transactions = lazy(() => import("../../views/staff/Transactions.jsx"));
const Reports = lazy(() => import("../../views/staff/Reports.jsx"));
const IncomeStatement = lazy(() =>
  import("../../views/staff/IncomeStatement.jsx")
);
const BalanceSheet = lazy(() => import("../../views/staff/BalanceSheet.jsx"));

export const staffRoutes = [
  // {
  //     path: '/staff/account-pending',
  //     element: <Pending />,
  //     ability: 'staff'
  // },
  // {
  //     path: '/staff/account-deactive',
  //     element: <Deactive />,
  //     ability: 'staff'
  // },

  {
    path: "staff/dashboard",
    element: <StaffDashboard />,
    role: "staff",
    status: "Active",
  },
  {
    path: "staff/dashboard/make-order",
    element: <MakeOrder />,
    role: "staff",
    status: "Active",
  },
  {
    path: "staff/dashboard/orders",
    element: <Orders />,
    role: "staff",
    status: "Active",
  },
  {
    path: "staff/dashboard/drafts",
    element: <Drafts />,
    role: "staff",
    status: "Active",
  },
  {
    path: "staff/dashboard/services",
    element: <Service />,
    role: "staff",
    status: "Active",
  },
  {
    path: "staff/dashboard/transactions",
    element: <Transactions />,
    role: "staff",
    status: "Active",
  },
  {
    path: "staff/dashboard/profile",
    element: <Profile />,
    role: "staff",
    visibility: ["Active", "Block", "Pending"],
  },
  {
    path: "staff/dashboard/reports",
    element: <Reports />,
    role: "staff",
    status: "Active",
  },
  {
    path: "/staff/dashboard/income-statements",
    element: <IncomeStatement />,
    role: "staff",
    status: "Active",
  },
  {
    path: "/staff/dashboard/balance-sheet",
    element: <BalanceSheet />,
    role: "staff",
    status: "Active",
  },
  // {
  //     path: 'staff/dashboard/edit-product/:productId',
  //     element: <EditProduct />,
  //     role: 'staff',
  //     status: 'active'
  // },
  // {
  //     path: 'staff/dashboard/discount-products',
  //     element: <DiscountProducts />,
  //     role: 'staff',
  //     status: 'active'
  // },
  // {
  //     path: 'staff/dashboard/orders',
  //     element: <Orders />,
  //     role: 'staff',
  //     visibility: ['active', 'deactive']
  // },
  // {
  //     path: 'staff/dashboard/order/details/:orderId',
  //     element: <OrderDetails />,
  //     role: 'staff',
  //     visibility: ['active', 'deactive']
  // },
  // {
  //     path: 'staff/dashboard/Transactions',
  //     element: <Transactions />,
  //     role: 'staff',
  //     status: 'active'
  // },
  // {
  //     path: 'staff/dashboard/chat-support',
  //     element: <staffToAdmin />,
  //     role: 'staff',
  //     visibility: ['active', 'deactive', 'pending']
  // },
  // {
  //     path: 'staff/dashboard/chat-customer',
  //     element: <staffToCustomer />,
  //     role: 'staff',
  //     status: 'active'
  // },
  // {
  //     path: 'staff/dashboard/banners',
  //     element: <Banners />,
  //     role: 'staff',
  //     status: 'active'
  // },
  // {
  //     path: 'staff/dashboard/add-banner/:productId',
  //     element: <AddBanner />,
  //     role: 'staff',
  //     status: 'active'
  // },
  // {
  //     path: 'staff/dashboard/chat-customer/:customerID',
  //     element: <staffToCustomer />,
  //     role: 'staff',
  //     status: 'active'
  // }
  // ,
  // {
  //     path: 'staff/dashboard/profile',
  //     element: <Profile />,
  //     role: 'staff',
  //     visibility: ['active', 'deactive', 'pending']
  // }
];
