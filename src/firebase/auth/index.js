import { auth } from '@/firebase'
import store from '@/store'

export default {
	getCurrentUser() {
		// console.log('plop')
		// return true;
		return new Promise((resolve, reject) => {
		  	const unsubscribe = auth.onAuthStateChanged(user => {
				// store.dispatch('auth/fetchUser', user)
				unsubscribe();
				resolve(user);
		  	}, reject);
		})
	},
	register(email, password, success, error) {
		auth.createUserWithEmailAndPassword(email, password)
			.then((res) => success(res))
			.catch((err) => error(err))
	},
	login(email, password, success, error) {
		auth.signInWithEmailAndPassword(email, password)
			.then((res) => success(res))
			.catch((err) => error(err))
	},
	logout(success, error) {
		auth.signOut()
			.then((res) => success(res))
			.catch((err) => error(err))
	},
	resetPassword(email, success, error) {
		auth.sendPasswordResetEmail(email)
			.then((res) => success(res))
			.catch((err) => error(err))
	},
	// onAuthChanged() {
	// 	auth.onAuthStateChanged((user) => {
    //         store.dispatch('loader/done')
	// 		store.dispatch('auth/fetchUser', user)
	// 	});
	// },
}