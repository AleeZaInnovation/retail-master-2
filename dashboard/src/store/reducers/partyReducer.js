import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
export const partyAdd = createAsyncThunk(
  "party/partyAdd",
  async (
    { name, address, mobile, description, accountType },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("mobile", mobile);
      formData.append("description", description);
      formData.append("accountType", accountType);
      const { data } = await api.post("/party-add", formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const partyNewAdd = createAsyncThunk(
  "party/partyNewAdd",
  async (
    { name, address, mobile, description, accountType },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("mobile", mobile);
      formData.append("description", description);
      formData.append("accountType", accountType);
      const { data } = await api.post("/party-add", formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const partyUpdate = createAsyncThunk(
  "party/partyUpdate",
  async (formData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put("/party-update", formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_parties = createAsyncThunk(
  "party/get_parties",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/parties-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_payment_parties = createAsyncThunk(
  "party/get_payment_parties",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/payment-parties-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_purchase_parties = createAsyncThunk(
  "party/get_purchase_parties",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/purchase-parties-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_party = createAsyncThunk(
  "party/get_party",
  async (partyId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/party-get/${partyId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_draft_party = createAsyncThunk(
  "party/get_draft_party",
  async (partyId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/party-get/${partyId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const account_type_parties = createAsyncThunk(
  "party/account_type_parties",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/account-type-parties?accountType=${info}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const partyReducer = createSlice({
  name: "party",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    parties: [],
    party: "",
    totalParty: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [partyAdd.pending]: (state, _) => {
      state.loader = true;
    },
    [partyAdd.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [partyAdd.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.parties = [...state.parties, payload.party];
    },
    [partyNewAdd.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorNewMessage = payload.error;
    },
    [partyNewAdd.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successNewMessage = payload.message;
      state.parties = [...state.parties, payload.party];
      state.newParty = payload.party;
    },
    [partyUpdate.pending]: (state, _) => {
      state.loader = true;
    },
    [partyUpdate.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [partyUpdate.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.parties = [...state.parties, payload.party];
    },
    [get_parties.fulfilled]: (state, { payload }) => {
      state.totalParty = payload.totalParty;
      state.parties = payload.parties;
    },
    [get_payment_parties.fulfilled]: (state, { payload }) => {
      state.totalParty = payload.totalParty;
      state.parties = payload.parties;
    },
    [get_purchase_parties.fulfilled]: (state, { payload }) => {
      state.totalParty = payload.totalParty;
      state.parties = payload.parties;
    },
    [account_type_parties.fulfilled]: (state, { payload }) => {
      state.totalParty = payload.totalParty;
      state.parties = payload.parties;
    },
    [get_party.fulfilled]: (state, { payload }) => {
      state.party = payload.party;
    },
    [get_draft_party.fulfilled]: (state, { payload }) => {
      state.draftParty = payload.party;
    },
  },
});
export const { messageClear } = partyReducer.actions;
export default partyReducer.reducer;
