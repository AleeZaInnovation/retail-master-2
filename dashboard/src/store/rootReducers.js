import authReducer from "./reducers/authReducer";
import companyReducer from "./reducers/companyReducer";
import ownerReducer from "./reducers/ownerReducer";
import staffReducer from "./reducers/staffReducer";
import categoryReducer from "./reducers/categoryReducer";
import productReducer from "./reducers/productReducer";
import cartReducer from "./reducers/cartReducer";
import draftReducer from "./reducers/draftReducer";
import partyReducer from "./reducers/partyReducer";
import orderReducer from "./reducers/orderReducer";
import transactionReducer from "./reducers/transactionReducer";
import serviceReducer from "./reducers/serviceReducer";
import dashboardIndexReducer from "./reducers/dashboardIndexReducer";

const rootReducers = {
  auth: authReducer,
  dashboard: dashboardIndexReducer,
  company: companyReducer,
  owner: ownerReducer,
  staff: staffReducer,
  category: categoryReducer,
  product: productReducer,
  cart: cartReducer,
  draft: draftReducer,
  party: partyReducer,
  order: orderReducer,
  transaction: transactionReducer,
  service: serviceReducer,
};

export default rootReducers;
