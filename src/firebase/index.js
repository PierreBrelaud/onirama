import firebase from "firebase";


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

export const db = firebase.firestore();
export const auth = firebase.auth();
