import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import drinkReducer from '../features/drinks/drinkSlice'
import saleReducer from '../features/sale/saleSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        drinks: drinkReducer,
        sale: saleReducer,
    },
});
