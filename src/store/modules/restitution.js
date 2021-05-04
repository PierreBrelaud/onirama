
const initialState = {
	title: '',
	date: '',
	text: '',
};

export const restitution = {
	namespaced: true,
	state: {
		...initialState,
	},
	getters: {
        data: (state) => {
            return state
        },
		title: (state) => {
			return state.title
		},
		date: (state) => {
			return state.date
		},
		text: (state) => {
			return state.text
		},
	},
	mutations: {
		resetState(state) {
			state = { ...initialState }
		},
		setTitle: (state, title) => {
			state.title = title
		},
		setDate: (state, date) => {
			state.date = date
		},
		setText: (state, text) => {
			state.text = text
		},
	},
};