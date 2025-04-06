import { createSlice } from "@reduxjs/toolkit";

const initialState={
    itineraries: [],
    selectedItinerary: {},
} 

const itinerarySlice = createSlice({
    name: "itinerary",
    initialState,
    reducers: {
        setItineraries: (state, action) => {
            console.log("Setting itineraries", action.payload);
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
export const {setItineraries,addItinerary,setSelectedItinerary} = itinerarySlice.actions;
export default itinerarySlice.reducer;