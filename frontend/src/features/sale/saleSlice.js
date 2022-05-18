import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import saleService from "./saleService";
import {logout} from "../auth/authSlice";

const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const saveSingleSale = createAsyncThunk('sale/single', async (drinkData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await saleService.saveSingleSale(drinkData, token)
    } catch (e) {
        if (e.response.status === 401) {
            thunkAPI.dispatch(logout())
        }
        const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const saleSlice = createSlice({
    name: 'sale',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveSingleSale.pending, (state) => {
                state.isLoading = true
            })
            .addCase(saveSingleSale.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(saveSingleSale.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = saleSlice.actions
export default saleSlice.reducer