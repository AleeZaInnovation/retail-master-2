import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_seller_dashboard_index_data = createAsyncThunk(
  "dashboardIndex/get_seller_dashboard_index_data",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-dashboard-index-data`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const dashboardIndexReducer = createSlice({
  name: "dashboardIndex",
  initialState: {
    totalSales: 0,
    totalOrder: 0,
    totalProducts: 0,
    totalSellers: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [get_seller_dashboard_index_data.fulfilled]: (state, { payload }) => {
      state.totalSales = payload.totalSales;
      state.totalOrder = payload.totalOrders;
      state.totalProducts = payload.totalProducts;
      state.totalSellers = payload.totalParty;
    },
  },
});
export const { messageClear } = dashboardIndexReducer.actions;
export default dashboardIndexReducer.reducer;
