
const getInitialState = () => {
	return {
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
		temperatureAvg: null,
		cardiacAvg: null
	}
};

export const restitution = {
	namespaced: true,
	state: getInitialState(),
	getters: {
        data: (state) => {
            return state
        },
	},
	mutations: {
		resetData(state) {
			Object.assign(state, getInitialState())
		},
		setData(state, data) {
			state = data
		}
	},
};