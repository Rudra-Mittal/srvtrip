import { createSlice } from "@reduxjs/toolkit";

const initialState={
    chats: [],
    selectedChat: {},
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
            sessionStorage.setItem("chats", JSON.stringify(action.payload));
        },
        addChat: (state, action) => {
            state.chats.push(action.payload);
            sessionStorage.setItem("chats", JSON.stringify(state.chats));
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        }
    },
});

export const {setChats,addChat,setSelectedChat} = chatSlice.actions;
export default chatSlice.reducer;