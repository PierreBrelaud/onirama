import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

const firebaseConfig = {
	apiKey: "AIzaSyBqVaYFgabWZ7xAbNdvbZelYMomDBrYTvk",
	authDomain: "gobelins-onirama.firebaseapp.com",
	projectId: "gobelins-onirama",
	storageBucket: "gobelins-onirama.appspot.com",
	messagingSenderId: "881779640866",
	appId: "1:881779640866:web:654b30a9b9df917859187b"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.getCurrentUser = () => {
	return new Promise((resolve, reject) => {
	  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
		unsubscribe();
		resolve(user);
	  }, reject);
	})
};

export const user = firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
export const functions = firebase.functions();
