import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

export const get_staff_request = createAsyncThunk(
    'staff/get_staff_request',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/request-staff-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_staff = createAsyncThunk(
    'staff/get_staff',
    async (staffId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-staff/${staffId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const staff_company = createAsyncThunk(
    'staff/staff_company',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/staff-company/`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const staff_branch = createAsyncThunk(
    'staff/staff_branch',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/staff-branch/`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const staff_status_update = createAsyncThunk(
    'staff/staff_status_update',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/staff-status-update`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const get_staffs = createAsyncThunk(
    'staff/get_staffs',
    async ({ parPage, page, searchValue,status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-staffs?page=${page}&&status=${status}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_company_staffs = createAsyncThunk(
    'staff/get_company_staffs',
    async ({ parPage, page, searchValue,status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-company-staffs?page=${page}&&status=${status}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_deactive_staffs = createAsyncThunk(
    'staff/get_active_staffs',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-deactive-staffs?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const create_stripe_connect_account = createAsyncThunk(
    'staff/create_stripe_connect_account',
    async () => {
        try {
            const { data: { url } } = await api.get(`/payment/create-stripe-connect-account`, { withCredentials: true })
            window.location.href = url
           // return fulfillWithValue(data)
        } catch (error) {
            //return rejectWithValue(error.response.data)
        }
    }
)

export const active_stripe_connect_account = createAsyncThunk(
    'staff/active_stripe_connect_account',
    async (activeCode, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/payment/active-stripe-connect-account/${activeCode}`, {}, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)





export const staffReducer = createSlice({
    name: 'staff',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        staffs: [],
        totalStaffs: 0,
        staff: ''
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [get_staff_request.fulfilled]: (state, { payload }) => {
            state.staffs = payload.staffs
            state.totalStaffs = payload.totalStaffs
        },
        [get_staff.fulfilled]: (state, { payload }) => {
            state.staff = payload.staff
        },
        [staff_company.fulfilled]: (state, { payload }) => {
            state.staff = payload.staff
            state.successMessage = payload.message
        },
        [staff_branch.fulfilled]: (state, { payload }) => {
            state.staff = payload.staff
            state.successMessage = payload.message
        },
        [staff_status_update.fulfilled]: (state, { payload }) => {
            state.staff = payload.staff
            state.successMessage = payload.message
        },
        [get_staffs.fulfilled]: (state, { payload }) => {
            state.staffs = payload.staffs
            state.totalStaffs = payload.totalStaffs
        },
        [get_company_staffs.fulfilled]: (state, { payload }) => {
            state.staffs = payload.staffs
            state.totalStaffs = payload.totalStaffs
        },
        [active_stripe_connect_account.pending]: (state, { payload }) => {
            state.loader = true
        },
        [active_stripe_connect_account.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.message
        },
        [active_stripe_connect_account.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
    }

})
export const { messageClear } = staffReducer.actions
export default staffReducer.reducer