import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyBsLO7Ggxn3bFW_-1bxutRh4WbCwcX-s3A",
	authDomain: "onirama-gobelins.firebaseapp.com",
	projectId: "onirama-gobelins",
	storageBucket: "onirama-gobelins.appspot.com",
	messagingSenderId: "8973216839",
	appId: "1:8973216839:web:df2999922bf60bdd1d1562",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
