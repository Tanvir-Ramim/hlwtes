import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  startTime: null,
  endTime: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    adminInfo: (state, action) => {
      state.user = action.payload;
    },
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.startTime = null;
      state.endTime = null;
    },
  },
});

export const { adminInfo, setStartTime, setEndTime, logoutUser } = authSlice.actions;
export default authSlice.reducer;
