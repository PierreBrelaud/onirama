import { auth } from '@/firebase'

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
            console.log('status changed')
		});
	},
}