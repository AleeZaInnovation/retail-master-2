import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwt from "jwt-decode";
import api from "../../api/api";
export const super_admin_login = createAsyncThunk(
  "auth/super-admin-login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/super-admin-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const owner_login = createAsyncThunk(
  "auth/owner-login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/owner-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const owner_register = createAsyncThunk(
  "auth/owner-register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/owner-register", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const staff_register = createAsyncThunk(
  "auth/staff-register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/staff-register", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const profile_image_upload = createAsyncThunk(
  "auth/profile_image_upload",
  async (image, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-image-upload", image, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const staff_login = createAsyncThunk(
  "auth/staff-login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/staff-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const get_user_info = createAsyncThunk(
  "auth/get-user-info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-user", { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/logout", { withCredentials: true });
      localStorage.removeItem("accessToken");
      if (role === "admin") {
        navigate("/admin/login");
      } else {
        navigate("/admin/login");
      }

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const returnRole = (token) => {
  if (token) {
    const decodeToken = jwt(token);
    const expireTime = new Date(decodeToken.exp * 1000);
    if (new Date() > expireTime) {
      localStorage.removeItem("accessToken");
      return "";
    } else {
      return decodeToken.role;
    }
  } else {
    return "";
  }
};

export const profile_info_add = createAsyncThunk(
  "auth/profile_info_add",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put("/profile-info-add", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forget_password = createAsyncThunk(
  "auth/forget_password",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/forget-password", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const reset_password = createAsyncThunk(
  "auth/reset_password",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/reset-password", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const change_password = createAsyncThunk(
  "auth/change_password",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put("/change-password", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: "",
    role: returnRole(localStorage.getItem("accessToken")),
    token: localStorage.getItem("accessToken"),
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [super_admin_login.pending]: (state, _) => {
      state.loader = true;
    },
    [super_admin_login.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [super_admin_login.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token);
    },
    [owner_register.pending]: (state, _) => {
      state.loader = true;
    },
    [owner_register.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [owner_register.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token);
    },
    [owner_login.pending]: (state, _) => {
      state.loader = true;
    },
    [owner_login.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [owner_login.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token);
    },
    [staff_register.pending]: (state, _) => {
      state.loader = true;
    },
    [staff_register.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [staff_register.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token);
    },
    [staff_login.pending]: (state, _) => {
      state.loader = true;
    },
    [staff_login.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [staff_login.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token);
      state.userInfo = payload.userInfo;
    },
    [get_user_info.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.userInfo = payload.userInfo;
      state.role = payload.userInfo.role;
    },
    [profile_image_upload.pending]: (state, _) => {
      state.loader = true;
    },
    [profile_image_upload.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.userInfo = payload.userInfo;
      state.successMessage = payload.message;
    },
    [profile_info_add.pending]: (state, _) => {
      state.loader = true;
    },
    [profile_info_add.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.userInfo = payload.userInfo;
      state.successMessage = payload.message;
    },
    [forget_password.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [forget_password.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [reset_password.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [reset_password.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [change_password.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [change_password.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
  },
});
export const { messageClear } = authReducer.actions;
export default authReducer.reducer;
