import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'
import placeReducer from './slices/placeSlice'
import chatReducer from './slices/chatSlice'
import itineraryReducer from './slices/itinerarySlice'
export const store=configureStore({
    reducer:{
        user:userReducer,
        place:placeReducer,
        chat:chatReducer,
        itinerary:itineraryReducer
    }
});