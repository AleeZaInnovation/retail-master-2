import {
  AiFillDashboard,
  AiOutlineShoppingCart,
  AiOutlineTransaction,
} from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { CiChat1 } from "react-icons/ci";
import { BsChat } from "react-icons/bs";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { RiProductHuntLine } from "react-icons/ri";
import { HiBuildingOffice } from "react-icons/hi2";
import { SiOnlyoffice } from "react-icons/si";
import { FcManager } from "react-icons/fc";
import { GrUserWorker } from "react-icons/gr";
import { IoReceiptOutline } from "react-icons/io5";
import { MdDrafts, MdInventory } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { FaBitbucket } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { TbSettingsSearch } from "react-icons/tb";
export const allNav = [
  {
    id: 1,
    title: "Dashboard",
    icon: <AiFillDashboard />,
    role: "owner",
    path: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Orders",
    icon: <AiOutlineShoppingCart />,
    role: "owner",
    path: "/admin/dashboard/orders",
  },
  {
    id: 3,
    title: "Services",
    icon: <TbSettingsSearch />,
    role: "owner",
    path: "/admin/dashboard/services",
  },
  {
    id: 4,
    title: "Purchases",
    icon: <FaBitbucket />,
    role: "owner",
    path: "/admin/dashboard/purchases",
  },
  // {
  //   id: 5,
  //   title: "Inventory",
  //   icon: <MdInventory />,
  //   role: "owner",
  //   path: "/admin/dashboard/inventory",
  // },
  {
    id: 6,
    title: "Category",
    icon: <BiCategory />,
    role: "owner",
    path: "/admin/dashboard/category",
  },
  {
    id: 7,
    title: "All Product",
    icon: <RiProductHuntLine />,
    role: "owner",
    path: "/admin/dashboard/products",
  },
  // {
  //   id: 8,
  //   title: "Employee",
  //   icon: <FiUsers />,
  //   role: "owner",
  //   path: "/admin/dashboard/staffs",
  // },
  {
    id: 9,
    title: "Party",
    icon: <HiUserGroup />,
    role: "owner",
    path: "/admin/dashboard/parties",
  },
  {
    id: 10,
    title: "Transaction",
    icon: <AiOutlineTransaction />,
    role: "owner",
    path: "/admin/dashboard/transactions",
  },
  {
    id: 11,
    title: "Reports",
    icon: <FaFileInvoiceDollar />,
    role: "owner",
    path: "/admin/dashboard/reports",
  },
  {
    id: 12,
    title: "Profile",
    icon: <ImProfile />,
    role: "owner",
    path: "/admin/dashboard/profile",
  },
  // {
  //     id: 6,
  //     title: 'Deactive Sellers',
  //     icon: <FiUsers />,
  //     role: 'owner',
  //     path: '/admin/dashboard/deactive-sellers'
  // },
  // {
  //     id: 7,
  //     title: 'Sellers Request',
  //     icon: <BiLoaderCircle />,
  //     role: 'owner',
  //     path: '/admin/dashboard/sellers-request'
  // },
  // {
  //     id: 8,
  //     title: 'Chat Seller',
  //     icon: <CiChat1 />,
  //     role: 'owner',
  //     path: '/admin/dashboard/chat-sellers'
  // },
  {
    id: 12,
    title: "Dashboard",
    icon: <AiFillDashboard />,
    role: "staff",
    path: "/staff/dashboard",
  },
  {
    id: 13,
    title: "Make Order",
    icon: <IoReceiptOutline />,
    role: "staff",
    path: "/staff/dashboard/make-order",
  },
  {
    id: 14,
    title: "Orders",
    icon: <AiOutlineShoppingCart />,
    role: "staff",
    path: "/staff/dashboard/orders",
  },
  {
    id: 15,
    title: "Drafts",
    icon: <MdDrafts />,
    role: "staff",
    path: "/staff/dashboard/drafts",
  },
  {
    id: 16,
    title: "Services",
    icon: <TbSettingsSearch />,
    role: "staff",
    path: "/staff/dashboard/services",
  },
  {
    id: 17,
    title: "Transaction",
    icon: <AiOutlineTransaction />,
    role: "staff",
    path: "/staff/dashboard/transactions",
  },
  {
    id: 18,
    title: "Reports",
    icon: <FaFileInvoiceDollar />,
    role: "staff",
    path: "/staff/dashboard/reports",
  },
  {
    id: 19,
    title: "Chat Customer",
    icon: <BsChat />,
    role: "staff",
    path: "/staff/dashboard/chat-customer",
  },
  {
    id: 20,
    title: "Chat Support",
    icon: <CiChat1 />,
    role: "staff",
    path: "/staff/dashboard/chat-support",
  },
  {
    id: 21,
    title: "Profile",
    icon: <ImProfile />,
    role: "staff",
    path: "/staff/dashboard/profile",
  },
  {
    id: 22,
    title: "Dashboard",
    icon: <AiFillDashboard />,
    role: "superadmin",
    path: "/super-admin/dashboard",
  },
  {
    id: 23,
    title: "Company",
    icon: <HiBuildingOffice />,
    role: "superadmin",
    path: "/super-admin/dashboard/companies",
  },
  {
    id: 24,
    title: "Branch",
    icon: <SiOnlyoffice />,
    role: "superadmin",
    path: "/super-admin/dashboard/branches",
  },
  {
    id: 25,
    title: "Owner Request",
    icon: <FcManager />,
    role: "superadmin",
    path: "/super-admin/dashboard/owner-request",
  },
  {
    id: 26,
    title: "Staff Request",
    icon: <GrUserWorker />,
    role: "superadmin",
    path: "/super-admin/dashboard/staff-request",
  },
  {
    id: 27,
    title: "Chat Owner",
    icon: <CiChat1 />,
    role: "superadmin",
    path: "/super-admin/dashboard/chat-owner",
  },
];
