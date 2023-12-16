import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";

import { getStorage } from "firebase/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail
} from "firebase/auth";

import {
	EXPO_PUBLIC_REACT_APP_FIREBASE_API_KEY,
	EXPO_PUBLIC_REACT_APP_FIREBASE_AUTH_DOMAIN,
	EXPO_PUBLIC_REACT_APP_FIREBASE_PROJECT_ID,
	EXPO_PUBLIC_REACT_APP_FIREBASE_STORAGE_BUCKET,
	EXPO_PUBLIC_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	EXPO_PUBLIC_REACT_APP_FIREBASE_APP_ID
} from "@env";

const firebaseConfig = {
	apiKey: EXPO_PUBLIC_REACT_APP_FIREBASE_API_KEY,
	authDomain: EXPO_PUBLIC_REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: EXPO_PUBLIC_REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: EXPO_PUBLIC_REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: EXPO_PUBLIC_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: EXPO_PUBLIC_REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

const db = getFirestore(app);

export { db };

// const auth = getAuth();

export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage)
});

export const authUser = async (email, password) => {
	if (!email || !password) return;
	return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
	onAuthStateChanged(auth, callback);

export const triggerResetEmail = async (email) => {
	console.log("Password reset email sent");
	return await sendPasswordResetEmail(auth, email);
};
