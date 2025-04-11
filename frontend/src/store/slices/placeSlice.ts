import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    places: [],
    activePlaceId:null
};

const placeSlice = createSlice({
    name: "place",
    initialState,
    reducers: {
        setPlaces: (state, action) => {
            state.places = action.payload;
            localStorage.setItem("places", JSON.stringify(action.payload));
        },
        addPlace: (state, action) => {
            state.places.push(action.payload);
            localStorage.setItem("places", JSON.stringify(state.places));
        },
        setActivePlaceId: (state, action) => {
            state.activePlaceId = action.payload;
        },
    },
});
export const { setPlaces, addPlace } = placeSlice.actions;
export default placeSlice.reducer;