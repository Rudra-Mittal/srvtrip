import { createSlice } from "@reduxjs/toolkit";
const places = localStorage.getItem("places")
    ? JSON.parse(localStorage.getItem("places") || "")
    : null;
const initialState = {
    places: places,
    activePlaceId:null,
    isChatBotOpen: false,
    reviewLoading: null, // Track which place is currently loading reviews
};

const placeSlice = createSlice({
    name: "place",
    initialState,
    reducers: {
        setPlaces: (state, action) => {
            state.places = action.payload;
            localStorage.setItem("places", JSON.stringify(action.payload));
        },
        appendPlaces: (state,action) =>
        {
            const oldplaces = localStorage.getItem("places")
            const newplaces = action.payload
            const updatedPlaces = oldplaces ? [...JSON.parse(oldplaces), ...newplaces] : newplaces;
            state.places = updatedPlaces;
            localStorage.setItem("places", JSON.stringify(updatedPlaces));
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
        setReviewLoading: (state, action) => {
            state.reviewLoading = action.payload; // placeId or null
        },
        setReview: (state, action) => {
            const { placeId, summarizedReview, rating, itineraryIdx } = action.payload;
            console.log("Place ID:", placeId, "Summarized Review:", summarizedReview, "Rating:", rating, "Itinerary Index:", itineraryIdx);
            console.log("Places before update:", places);
            const placeIndex = state.places[itineraryIdx].map((days:any)=>{
                return days.map((place:any)=>{
                    return {
                        ...place,
                        summarizedReview:(place.id==placeId)?summarizedReview:place.summarizedReview,
                        rating:(place.id==placeId && rating !== undefined)?rating:place.rating
                    }
                })
            })
            state.places[itineraryIdx] = placeIndex;
            localStorage.setItem("places", JSON.stringify(state.places));
        },
    },
});
export const { setPlaces, addPlace, setActivePlaceId, setChatbotOpen, setReview, setReviewLoading, appendPlaces } = placeSlice.actions;
export default placeSlice.reducer;