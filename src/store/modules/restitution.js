
const initialState = {
	title: '',
	date: null,
	text: '',
	type: null,
	emotions: [ {}, {}, {} ],
	absurd: 0,
	perception: 0,
	lucidity: false,
	recurrence: false,
	impact: 0,
	mood: 0,
	sleep: -1,
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
	},
	mutations: {
		resetData(state) {
			Object.assign(state, initialState)
		},
		setData(state, data) {
			state = data
		}
	},
};