import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const make_draft = createAsyncThunk(
  "order/make_draft",
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
    },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      console.log(value);
      const { data } = await api.post("/order/make-draft", {
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
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_branch_drafts = createAsyncThunk(
  "order/get_branch_drafts",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/order/get-branch-drafts?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_company_drafts = createAsyncThunk(
  "order/get_company_drafts",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/order/get-company-drafts?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_draft = createAsyncThunk(
  "order/get_draft",
  async (draftId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/order/get-draft/${draftId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const draft_remove = createAsyncThunk(
  "order/draft_remove",
  async (draftId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/order/remove-draft/${draftId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const draftReducer = createSlice({
  name: "draft",
  initialState: {
    drafts: [],
    errorMessage: "",
    successMessage: "",
    myDraft: {},
    totalDrafts: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [make_draft.rejected]: (state, { payload }) => {
      state.errorMessage = payload.message;
    },
    [make_draft.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
    },
    [get_company_drafts.fulfilled]: (state, { payload }) => {
      state.drafts = payload.drafts;
      state.totalDrafts = payload.totalDrafts;
    },
    [get_company_drafts.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
    },
    [get_branch_drafts.fulfilled]: (state, { payload }) => {
      state.drafts = payload.drafts;
      state.totalDrafts = payload.totalDrafts;
    },
    [get_branch_drafts.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
    },
    [get_draft.fulfilled]: (state, { payload }) => {
      state.myDraft = payload.draft;
    },
    [draft_remove.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
    },
  },
});

export const { messageClear } = draftReducer.actions;
export default draftReducer.reducer;
