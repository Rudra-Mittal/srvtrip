import { createSlice } from "@reduxjs/toolkit";

interface ChatMessage {
    type: "user" | "ai";
    message: string;
}

interface ChatState {
    chats: {
        [placeId: string]: ChatMessage[];
    };
}

const initialState: ChatState = {
    chats: {}, // key: placeId, value: array of chat msgs
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
    // Load chat messages for a specific placeId from sessionStorage
    loadChatForPlace: (state, action) => {
        const placeId = action.payload;
        const stored = sessionStorage.getItem("chats");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed[placeId]) {
            state.chats[placeId] = parsed[placeId];
          }
        }
      },
  
    // Add a new chat message (user or AI)
    addChat: (state, action) => {
        const { placeId, message } = action.payload;
        if (!state.chats[placeId]) {
          state.chats[placeId] = [];
        }
        state.chats[placeId].push(message);
  
        // Update sessionStorage only for this place
        const stored = sessionStorage.getItem("chats");
        const parsed = stored ? JSON.parse(stored) : {};
        parsed[placeId] = state.chats[placeId];
        sessionStorage.setItem("chats", JSON.stringify(parsed));
      },
    },
});

export const {loadChatForPlace,addChat} = chatSlice.actions;
export default chatSlice.reducer;