
const getInitialState = () => {
    return {
        current: null,
        dreams: null,
        previousView: null,
    }
};

export const visualisation = {
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
            state.current = data.current;
            state.dreams = data.dreams;
			state.previousView = data.previousView;
		}
	},
};