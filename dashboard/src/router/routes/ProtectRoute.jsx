import React from "react";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const ProtectRoute = ({ route, children }) => {
  const { role, userInfo } = useSelector((state) => state?.auth);
  if (role) {
    if (userInfo) {
      if (route.role) {
        if (userInfo.role === route.role) {
          if (route.status) {
            if (route.status === userInfo.status) {
              return <Suspense fallback={null}>{children}</Suspense>;
            } else {
              if (userInfo.status === "Pending") {
                return <Navigate to="/pending" replace />;
              } else {
                return <Navigate to="/account-deactive" replace />;
              }
            }
          } else {
            if (route.visibility) {
              if (route.visibility.some((r) => r === userInfo.status)) {
                return <Suspense fallback={null}>{children}</Suspense>;
              } else {
                return <Navigate to="/account-pending" replace />;
              }
            } else {
              return <Suspense fallback={null}>{children}</Suspense>;
            }
          }
          //return <Suspense fallback={null}>{children}</Suspense>
        } else {
          return <Navigate to="/unauthorized" replace />;
        }
      } else {
        if (route.ability === "staff") {
          return <Suspense fallback={null}>{children}</Suspense>;
        }
      }
    }
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectRoute;
