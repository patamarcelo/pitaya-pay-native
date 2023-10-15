import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: "",
	termsAccepted: false
};
const UserSlice = createSlice({
	name: "usuario",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		resetUser: (state) => {
			state.user = null;
		},
		registerTerms: (state) => {
			state.termsAccepted = true;
		},
		unregisterTerms: (state) => {
			state.termsAccepted = false;
		}
	}
});

export const userActions = UserSlice.actions;

export default UserSlice.reducer;
