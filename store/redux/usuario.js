import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: "",
	termsAccepted: false,
	createdUser: "",
	creditCardInfo: "",
	clientIp: ""
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
		},
		setCreatedUser: (state, action) => {
			state.createdUser = action.payload;
		},
		setCreditCardInfo: (state, action) => {
			state.creditCardInfo = action.payload;
		},
		setIp: (state, action) => {
			state.clientIp = action.payload;
		},
		clearData: (state) => {
			state.createdUser = "";
			state.creditCardInfo = "";
			state.clientIp = "";
		}
	}
});

export const userActions = UserSlice.actions;

export default UserSlice.reducer;
