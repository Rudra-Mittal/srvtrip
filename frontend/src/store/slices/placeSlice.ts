import { createSlice } from "@reduxjs/toolkit";
const places = localStorage.getItem("places")
    ? JSON.parse(localStorage.getItem("places") || "")
    : [];
const initialState = {
    places: places,
    activePlaceId:null,
    isChatBotOpen: false,
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
        setChatbotOpen: (state, action) => {
            state.isChatBotOpen = action.payload;
        },
    },
});
export const { setPlaces, addPlace,setActivePlaceId,toggleChatbot,setChatbotOpen } = placeSlice.actions;
export default placeSlice.reducer;