import { createSlice } from "@reduxjs/toolkit";

// const itineraries = localStorage.getItem("itineraries")
//     ? JSON.parse(localStorage.getItem("itineraries") || "")
//     : null;
const itineraries = null; // Initialize as null or an empty array if needed
const initialState={
    itineraries: itineraries  as any[] | null,
    selectedItinerary: {},
} 

const itinerarySlice = createSlice({
    name: "itinerary",
    initialState,
    reducers: {
        setItineraries: (state, action) => {
            // console.log("Setting itineraries", action.payload);
            state.itineraries = action.payload;
            // localStorage. setItem("itineraries", JSON.stringify(action.payload));
        },
        appenditinerary: (_state,_action) =>
            {
                // const olditinerary = localStorage.getItem("itineraries")
                // const newitinerary = action.payload
                // const updateditinerary = olditinerary ? [...JSON.parse(olditinerary), ...newitinerary] : newitinerary;
                // state.itineraries = updateditinerary;
                // localStorage.setItem("itineraries", JSON.stringify(updateditinerary));
            },
        addItinerary: (state, action) => {
            if (!state.itineraries) {
                state.itineraries = [];
            }
            state.itineraries.push(action.payload);
            // localStorage.setItem("itineraries", JSON.stringify(state.itineraries));
        },
        setSelectedItinerary: (state, action) => {
            state.selectedItinerary = action.payload;
        }
    },
});
export const {setItineraries,addItinerary,setSelectedItinerary , appenditinerary} = itinerarySlice.actions;
export default itinerarySlice.reducer;