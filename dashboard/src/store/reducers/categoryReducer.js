import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'


export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('image', image)
            const { data } = await api.post('/category-add', formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const categoryUpdate = createAsyncThunk(
    'category/categoryUpdate',
    async (formData, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put('/category-update', formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_categories = createAsyncThunk(
    'category/get_categories',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/categories-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_category = createAsyncThunk(
    'category/get_category',
    async (categoryId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/category-get/${categoryId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const inventoryAdd = createAsyncThunk(
    'inventory/inventoryAdd',
    async ({ name, unit }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('unit', unit)
            const { data } = await api.post('/inventory-add', formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const inventoryUpdate = createAsyncThunk(
    'category/inventoryUpdate',
    async (formData, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put('/inventory-update', formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_inventories = createAsyncThunk(
    'category/get_inventories',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/inventories-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_out_inventories = createAsyncThunk(
    'category/get_out_inventories',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/out-inventories-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const get_inventory = createAsyncThunk(
    'inventory/get_inventory',
    async (inventoryId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/inventory-get/${inventoryId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categories: [],
        category: '',
        totalCategory: 0,
        inventories: [],
        inventory: '',
        totalInventory: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [categoryAdd.pending]: (state, _) => {
            state.loader = true
        },
        [categoryAdd.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [categoryAdd.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.categories = [...state.categories, payload.category]
        },
        [categoryUpdate.pending]: (state, _) => {
            state.loader = true
        },
        [categoryUpdate.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [categoryUpdate.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.categories = [...state.categories, payload.category]
        },
        [get_categories.fulfilled]: (state, { payload }) => {
            state.totalCategory = payload.totalCategory
            state.categories = payload.categories
        },
        [get_category.fulfilled]: (state, { payload }) => {
            state.category = payload.category
        },
        [inventoryAdd.pending]: (state, _) => {
            state.loader = true
        },
        [inventoryAdd.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [inventoryAdd.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.inventories = [...state.inventories, payload.inventory]
        },
        [inventoryUpdate.pending]: (state, _) => {
            state.loader = true
        },
        [inventoryUpdate.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [inventoryUpdate.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.inventories = [...state.inventories, payload.inventory]
        },
        [get_inventories.fulfilled]: (state, { payload }) => {
            state.totalInventory = payload.totalInventory
            state.inventories = payload.inventories
        },
        [get_inventory.fulfilled]: (state, { payload }) => {
            state.inventory = payload.inventory
        },
        [get_out_inventories.fulfilled]: (state, { payload }) => {
            state.totalInventory = payload.totalInventory
            state.inventories = payload.inventories
        },
    }

})
export const { messageClear } = categoryReducer.actions
export default categoryReducer.reducer