import { lazy } from "react";
const AdminDashboard = lazy(() =>
  import("../../views/admin/AdminDashboard.jsx")
);
const Orders = lazy(() => import("../../views/admin/Orders"));
const MakeOrder = lazy(() => import("../../views/admin/MakeOrder"));
const Service = lazy(() => import("../../views/admin/Service.jsx"));
const Drafts = lazy(() => import("../../views/admin/Drafts"));
const Category = lazy(() => import("../../views/admin/Category"));
const Purchases = lazy(() => import("../../views/admin/Purchases"));
const Inventory = lazy(() => import("../../views/admin/Inventory"));
const OutInventory = lazy(() => import("../../views/admin/OutInventory"));
const PurchaseInventory = lazy(() =>
  import("../../views/admin/PurchaseInventory")
);
const Party = lazy(() => import("../../views/admin/Party"));
const AddProduct = lazy(() => import("../../views/admin/AddProduct.jsx"));
const Products = lazy(() => import("../../views/admin/Products.jsx"));
const OutProducts = lazy(() => import("../../views/admin/OutProducts.jsx"));
const EditProduct = lazy(() => import("../../views/admin/EditProduct.jsx"));
const StaffDetails = lazy(() => import("../../views/admin/StaffDetails.jsx"));
const Staffs = lazy(() => import("../../views/admin/Staffs.jsx"));
const Profile = lazy(() => import("../../views/admin/Profile"));
const Transactions = lazy(() => import("../../views/admin/Transactions"));
const Reports = lazy(() => import("../../views/admin/Reports"));
const IncomeStatement = lazy(() => import("../../views/admin/IncomeStatement"));
const BalanceSheet = lazy(() => import("../../views/admin/BalanceSheet"));
const AccountType = lazy(() => import("../../views/admin/AccountType"));
const DayBook = lazy(() => import("../../views/admin/DayBook"));
const Pending = lazy(() => import("../../views/Pending.jsx"));
export const ownerRoutes = [
  {
    path: "/admin/account-pending",
    element: <Pending />,
    ability: "owner",
  },
  {
    path: "admin/dashboard",
    element: <AdminDashboard />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/orders",
    element: <Orders />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/services",
    element: <Service />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/make-order",
    element: <MakeOrder />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/drafts",
    element: <Drafts />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/purchases",
    element: <Purchases />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/inventory",
    element: <Inventory />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/out-inventories",
    element: <OutInventory />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/inventory-purchase",
    element: <PurchaseInventory />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/category",
    element: <Category />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/add-product",
    element: <AddProduct />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/products",
    element: <Products />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/out-products",
    element: <OutProducts />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/edit-product/:productId",
    element: <EditProduct />,
    role: "owner",
    status: "Active",
  },
  {
    path: "/admin/dashboard/staffs",
    element: <Staffs />,
    role: "owner",
    status: "Active",
  },
  {
    path: "/admin/dashboard/staff/details/:staffId",
    element: <StaffDetails />,
    role: "owner",
    status: "Active",
  },
  {
    path: "/admin/dashboard/parties",
    element: <Party />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/transactions",
    element: <Transactions />,
    role: "owner",
    status: "Active",
  },
  {
    path: "/admin/dashboard/reports",
    element: <Reports />,
    role: "owner",
    status: "Active",
  },
  {
    path: "admin/dashboard/profile",
    element: <Profile />,
    role: "owner",
    visibility: ["Active", "Block", "Pending"],
  },
  {
    path: "/admin/dashboard/income-statements",
    element: <IncomeStatement />,
    role: "owner",
    status: "Active",
  },
  {
    path: "/admin/dashboard/balance-sheet",
    element: <BalanceSheet />,
    role: "owner",
    status: "Active",
  },
  {
    path: "/admin/dashboard/account-type",
    element: <AccountType />,
    role: "owner",
    status: "Active",
  },
  {
    path: "/admin/dashboard/day-book",
    element: <DayBook />,
    role: "owner",
    status: "Active",
  },
  // {
  //     path: 'admin/dashboard/sellers',
  //     element: <Sellers />,
  //     role: 'admin'
  // },
  // {
  //     path: 'admin/dashboard/payment-request',
  //     element: <PaymentRequest />,
  //     role: 'admin'
  // },
  // {
  //     path: 'admin/dashboard/deactive-sellers',
  //     element: <DeactiveSellers />,
  //     role: 'admin'
  // },
  // {
  //     path: 'admin/dashboard/sellers-request',
  //     element: <SellerRequest />,
  //     role: 'admin'
  // },
  // {
  //     path: 'admin/dashboard/seller/details/:sellerId',
  //     element: <SellerDetails />,
  //     role: 'admin'
  // },
  // {
  //     path: 'admin/dashboard/chat-sellers',
  //     element: <ChatSellers />,
  //     role: 'admin'
  // }
  // ,
  // {
  //     path: 'admin/dashboard/chat-sellers/:sellerId',
  //     element: <ChatSellers />,
  //     role: 'admin'
  // },

  // {
  //     path: 'admin/dashboard/order/details/:orderId',
  //     element: <OrderDetails />,
  //     role: 'admin'
  // }
];
