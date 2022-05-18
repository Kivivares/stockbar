import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import drinkService from "./drinkService";
import {logout} from "../auth/authSlice";

const initialState = {
    drinks: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const createDrink = createAsyncThunk('drinks/create', async (drinkData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await drinkService.createDrink(drinkData, token)
    } catch (e) {
        if (e.response.status === 401) {
            thunkAPI.dispatch(logout())
        }
        const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getDrinks = createAsyncThunk('drinks/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await drinkService.getDrinks(token)
    } catch (e) {
        if (e.response.status === 401) {
            thunkAPI.dispatch(logout())
        }
        const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteDrink = createAsyncThunk('drinks/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await drinkService.deleteDrink(id, token)
    } catch (e) {
        if (e.response.status === 401) {
            thunkAPI.dispatch(logout())
        }
        const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const editDrink = createAsyncThunk('drinks/edit', async (drinkData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await drinkService.editDrink(drinkData, token)
    } catch (e) {
        if (e.response.status === 401) {
            thunkAPI.dispatch(logout())
        }
        const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const drinkSlice = createSlice({
    name: 'drink',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createDrink.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createDrink.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.drinks.push(action.payload)
            })
            .addCase(createDrink.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getDrinks.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getDrinks.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.drinks = action.payload
            })
            .addCase(getDrinks.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteDrink.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteDrink.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.drinks = state.drinks.filter((drink) => drink._id !== action.payload.id)
            })
            .addCase(deleteDrink.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(editDrink.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(editDrink.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.drinks = state.drinks.map(
                    (drink) => drink._id === action.payload._id ? {...drink, ...action.payload}
                        : drink
                )
            })
            .addCase(editDrink.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = drinkSlice.actions
export default drinkSlice.reducer