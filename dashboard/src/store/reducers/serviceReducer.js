import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const make_service = createAsyncThunk(
  "order/make_service",
  async (
    { serviceProduct, description, party, branch },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post("/order/make-service", {
        serviceProduct,
        description,
        party,
        branch,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_branch_services = createAsyncThunk(
  "order/get_branch_services",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/order/get-branch-services?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_company_services = createAsyncThunk(
  "order/get_company_services",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/order/get-company-services?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_company_service = createAsyncThunk(
  "order/get_company_service",
  async (serviceId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/order/get-company-service/${serviceId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_service = createAsyncThunk(
  "order/get_service",
  async (serviceId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/order/get-service/${serviceId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const service_remove = createAsyncThunk(
  "order/service_remove",
  async (serviceId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/order/remove-service/${serviceId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const update_service = createAsyncThunk(
  "order/update-service",
  async (
    { serviceId, status, station },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.put(
        "order/service-update",
        {
          serviceId,
          status,
          station,
        },
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const serviceReducer = createSlice({
  name: "service",
  initialState: {
    services: [],
    errorMessage: "",
    successMessage: "",
    myService: {},
    totalServices: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [make_service.rejected]: (state, { payload }) => {
      state.errorMessage = payload.message;
    },
    [make_service.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.myService = payload.service;
    },
    [update_service.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.myService = payload.service;
    },
    [get_company_services.fulfilled]: (state, { payload }) => {
      state.services = payload.services;
      state.totalServices = payload.totalServices;
    },
    [get_company_services.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
    },
    [get_branch_services.fulfilled]: (state, { payload }) => {
      state.services = payload.services;
      state.totalServices = payload.totalServices;
    },
    [get_branch_services.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
    },
    [get_company_service.fulfilled]: (state, { payload }) => {
      state.myService = payload.service;
    },
    [get_service.fulfilled]: (state, { payload }) => {
      state.myService = payload.service;
    },
    [service_remove.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
    },
  },
});

export const { messageClear } = serviceReducer.actions;
export default serviceReducer.reducer;
