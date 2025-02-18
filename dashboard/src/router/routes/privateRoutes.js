import { superAdminRoutes } from "./superAdminRoutes";
import { ownerRoutes } from "./ownerRoutes";
import { staffRoutes } from "./staffRoutes";

export const privateRoutes = [
    ...superAdminRoutes,
    ...ownerRoutes,
    ...staffRoutes,
]