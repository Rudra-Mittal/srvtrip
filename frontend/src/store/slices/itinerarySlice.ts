import { createSlice } from "@reduxjs/toolkit";

const initialState={
    itineraries: [{}],
    selectedItinerary: {},
} 

const itinerarySlice = createSlice({
    name: "itinerary",
    initialState,
    reducers: {
        setItineraries: (state, action) => {
            state.itineraries = action.payload;
            localStorage. setItem("itineraries", JSON.stringify(action.payload));
        },
        addItinerary: (state, action) => {
            state.itineraries.push(action.payload);
            localStorage.setItem("itineraries", JSON.stringify(state.itineraries));
        },
        setSelectedItinerary: (state, action) => {
            state.selectedItinerary = action.payload;
        }
    },
});