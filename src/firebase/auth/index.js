import { auth } from '@/firebase'

export default {
	register(email, password) {
		auth.createUserWithEmailAndPassword(email, password)
			.then((result) => {
                console.log('registered')
                console.log(result)
			})
			.catch((error) => console.log(error.message))
	},
	login(email, password) {
		auth.signInWithEmailAndPassword(email, password)
			.then((result) => {
                console.log('login')
                console.log(result)
			})
			.catch((error) => console.log(error.message))
	},
	logout() {
		auth.signOut()
			.then(() => {
                console.log('logout')
			})
			.catch((error) => console.log(error.message))
	},
	resetPassword(email) {
		auth.sendPasswordResetEmail(email)
			.then(() => {
                console.log('reset')
            })
			.catch((error) => console.log(error.message))
	},
	onAuthChanged() {
		auth.onAuthStateChanged((user) => {
            console.log('status changed')
		});
	},
}