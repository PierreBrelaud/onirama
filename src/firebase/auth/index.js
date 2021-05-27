import { auth } from '@/firebase'
import store from '@/store'

export default {
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
	onAuthChanged() {
		auth.onAuthStateChanged((user) => {
			console.log('auth changed')
			store.dispatch('auth/fetchUser', user)
		});
	},
}