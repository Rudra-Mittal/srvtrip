import { createSlice } from "@reduxjs/toolkit";

// function parseNestedJSON(data: any): any {
//     if (typeof data === 'string') {
//       try {
//         return parseNestedJSON(JSON.parse(data));
//       } catch (e) {
//         return data; // If it's not valid JSON, return the string as is
//       }
//     } else if (Array.isArray(data)) {
//       return data.map(item => parseNestedJSON(item));
//     } else if (data !== null && typeof data === 'object') {
//       return Object.keys(data).reduce((result, key) => {
//         result[key] = parseNestedJSON(data[key]);
//         return result;
//       }, {} as Record<string, any>);
//     }
//     return data;
//   }
  
//   const itineraries = localStorage.getItem("itineraries")
//       ? parseNestedJSON(JSON.parse(localStorage.getItem("itineraries")?.replace(/\/\s*\.\.\//g, "") || "[]"))
//       : [];
//   console.log("Itineraries from local storage:", itineraries);
// const initialState={
//     itineraries: itineraries,
//     selectedItinerary: {},
// } 


const itineraries = localStorage.getItem("itineraries")
    ? JSON.parse(localStorage.getItem("itineraries") || "")
    : [];
const initialState={
    itineraries: itineraries,
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