import axios from "axios";

const baseURL = "https://pitaya-server.herokuapp.com/";
const baseURLdev = "http://192.168.0.156:5500/";

export const createClient = axios.create({
	baseURL: process.env.NODE_ENV !== "production" ? baseURL : baseURL,
	headers: {
		"Content-Type": "application/json"
	}
});
