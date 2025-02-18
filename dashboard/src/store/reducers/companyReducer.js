import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'
export const companyAdd = createAsyncThunk(
    'company/companyAdd',
    async (info , { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('name', info.name)
            formData.append('email', info.email)
            formData.append('address', info.address)
            formData.append('mobile', info.mobile)
            formData.append('description', info.description)
            formData.append('image', info.image)
            const { data } = await api.post('/company-add', formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const companyUpdate = createAsyncThunk(
    'company/companyUpdate',
    async (info , { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('name', info.name)
            formData.append('email', info.email)
            formData.append('address', info.address)
            formData.append('mobile', info.mobile)
            formData.append('description', info.description)
            formData.append('image', info.image)
            const { data } = await api.put(`/company-update/${info.id}`, formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_company = createAsyncThunk(
    'company/get_company',
    async ({ parPage, page, searchValue,status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/company-get?page=${page}&&status=${status}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const set_status = createAsyncThunk(
    'company/set_status',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/company-status`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_a_company = createAsyncThunk(
    'company/get_a_company',
    async (companyId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/a-company-get/${companyId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const branchAdd = createAsyncThunk(
    'company/branchAdd',
    async (branch, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/branch-add', branch, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_branch = createAsyncThunk(
    'company/get_branch',
    async ({ parPage, page, searchValue,status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/branch-get?page=${page}&&status=${status}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const company_branch = createAsyncThunk(
    'company/company_branch',
    async (companyId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/company-branch/${companyId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const set_branch_status = createAsyncThunk(
    'company/set_branch_status',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/branch-status`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_a_branch = createAsyncThunk(
    'company/get_a_branch',
    async (branchId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/a-branch-get/${branchId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const branchUpdate = createAsyncThunk(
    'company/branchUpdate',
    async (branch, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put('/branch-update', branch, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const companyReducer = createSlice({
    name: 'company',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        companies: [],
        totalCompany : 0,
        company:{},
        branches: [],
        totalBranch : 0,
        companyBranch:[]
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [companyAdd.pending]: (state, _) => {
            state.loader = true
        },
        [companyAdd.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [companyAdd.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.companies = [...state.companies, payload.company]
        },
        [companyUpdate.pending]: (state, _) => {
            state.loader = true
        },
        [companyUpdate.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [companyUpdate.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.companies = [...state.companies, payload.company]
        },
        [get_company.fulfilled]: (state, { payload }) => {
            state.totalCompany = payload.totalCompany
            state.companies = payload.companies
        },
        [set_status.fulfilled]: (state, { payload }) => {
            state.status = payload.status
        },
        [get_a_company.fulfilled]: (state, { payload }) => {
            state.company = payload.company
        },
        [branchAdd.pending]: (state, _) => {
            state.loader = true
        },
        [branchAdd.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [branchAdd.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [get_branch.fulfilled]: (state, { payload }) => {
            state.totalBranch = payload.totalBranch
            state.branches = payload.branches
        },
        [company_branch.fulfilled]: (state, { payload }) => {
            state.companyBranch = payload.companyBranch
            state.totalCompanyBranch = payload.totalCompanyBranch
        },
        [set_branch_status.fulfilled]: (state, { payload }) => {
            state.status = payload.status
        },
        [get_a_branch.fulfilled]: (state, { payload }) => {
            state.branch = payload.branch
        },
        [branchUpdate.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
    }

})
export const { messageClear } = companyReducer.actions
export default companyReducer.reducer