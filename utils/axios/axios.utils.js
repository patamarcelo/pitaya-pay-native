import axios from "axios";
import {
	EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN
} from "@env";

const baseURL = "https://pitaya-server.herokuapp.com/";
const baseURLdev = "http://192.168.1.108:8080/"; // Use your current local IP
const baseURLdevDjango = "https://pitaya-django-pay.up.railway.app/"; // Use your current local IP

export const createClient = axios.create({
	baseURL: process.env.NODE_ENV !== "production" ? baseURL : baseURL,
	headers: {
		"Content-Type": "application/json",
	}
});
export const createDjangoClient = axios.create({
	baseURL: process.env.NODE_ENV !== "production" ? baseURLdev : baseURLdevDjango,
	headers: {
		"Content-Type": "application/json",
		'Authorization': `Token ${EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN}`
	}
});
