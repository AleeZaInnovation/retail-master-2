import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const place_order = createAsyncThunk(
  "order/place_order",
  async (
    {
      cartItems,
      totalAmount,
      totalQuantity,
      discount,
      payment,
      party,
      value,
      paid,
      due,
      branch,
      description,
    },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post("/order/place-order", {
        cartItems,
        totalAmount,
        totalQuantity,
        discount,
        payment,
        party,
        value,
        paid,
        due,
        branch,
        description,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_branch_orders = createAsyncThunk(
  "order/get_branch_orders",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/order/get-branch-orders?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_order = createAsyncThunk(
  "order/get_order",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/order/get-order/${orderId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_company_orders = createAsyncThunk(
  "order/get_company_orders",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/order/get-company-orders?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_company_order = createAsyncThunk(
  "order/get_company_order",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/order/get-company-order/${orderId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const confirm_purchase = createAsyncThunk(
  "order/confirm_purchase",
  async (
    {
      cartItems,
      totalAmount,
      totalQuantity,
      party,
      value,
      description,
      branch,
    },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post("/order/confirm-purchase", {
        cartItems,
        totalAmount,
        totalQuantity,
        party,
        value,
        description,
        branch,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_purchases = createAsyncThunk(
  "order/get_purchases",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/order/get-purchases?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_purchase = createAsyncThunk(
  "order/get_purchase",
  async (purchaseId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/order/get-purchase/${purchaseId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const orderReducer = createSlice({
  name: "order",
  initialState: {
    orders: [],
    errorMessage: "",
    successMessage: "",
    myOrder: {},
    totalOrders: 0,
    purchases: [],
    myPurchase: {},
    totalPurchases: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [place_order.rejected]: (state, { payload }) => {
      state.errorMessage = payload.message;
    },
    [place_order.fulfilled]: (state, { payload }) => {
      state.myOrder = payload.order;
      state.successMessage = payload.message;
    },
    [get_company_orders.fulfilled]: (state, { payload }) => {
      state.orders = payload.orders;
      state.totalOrders = payload.totalOrders;
    },
    [get_company_orders.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
    },
    [get_company_order.fulfilled]: (state, { payload }) => {
      state.myOrder = payload.order;
    },
    [get_branch_orders.fulfilled]: (state, { payload }) => {
      state.orders = payload.orders;
      state.totalOrders = payload.totalOrders;
    },
    [get_branch_orders.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
    },
    [get_order.fulfilled]: (state, { payload }) => {
      state.myOrder = payload.order;
    },
    [confirm_purchase.rejected]: (state, { payload }) => {
      state.errorMessage = payload.message;
    },
    [confirm_purchase.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
    },
    [get_purchases.fulfilled]: (state, { payload }) => {
      state.purchases = payload.purchases;
      state.totalPurchases = payload.totalPurchases;
    },
    [get_purchases.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
    },
    [get_purchase.fulfilled]: (state, { payload }) => {
      state.myPurchase = payload.purchase;
    },
  },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
