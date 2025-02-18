import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

export const get_owner_request = createAsyncThunk(
    'owner/get_owner_request',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/request-owner-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_owner = createAsyncThunk(
    'owner/get_owner',
    async (ownerId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-owner/${ownerId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const owner_company = createAsyncThunk(
    'owner/owner_company',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/owner-company/`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const owner_status_update = createAsyncThunk(
    'owner/owner_status_update',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/owner-status-update`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const get_owners = createAsyncThunk(
    'owner/get_owners',
    async ({ parPage, page, searchValue,status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-owners?page=${page}&&status=${status}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const create_stripe_connect_account = createAsyncThunk(
    'owner/create_stripe_connect_account',
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
    'owner/active_stripe_connect_account',
    async (activeCode, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/payment/active-stripe-connect-account/${activeCode}`, {}, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)





export const ownerReducer = createSlice({
    name: 'owner',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        owners: [],
        totalOwners: 0,
        owner: ''
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [get_owner_request.fulfilled]: (state, { payload }) => {
            state.owners = payload.owners
            state.totalOwners = payload.totalOwners
        },
        [get_owner.fulfilled]: (state, { payload }) => {
            state.owner = payload.owner
        },
        [owner_company.fulfilled]: (state, { payload }) => {
            state.owner = payload.owner
            state.successMessage = payload.message
        },
        [owner_status_update.fulfilled]: (state, { payload }) => {
            state.owner = payload.owner
            state.successMessage = payload.message
        },
        [get_owners.fulfilled]: (state, { payload }) => {
            state.owners = payload.owners
            state.totalOwners = payload.totalOwners
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
export const { messageClear } = ownerReducer.actions
export default ownerReducer.reducer