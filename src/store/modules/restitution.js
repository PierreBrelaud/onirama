
const initialState = {
	title: 'Images de voyage',
	date: new Date(),
	text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi velit, suscipit ea iste error omnis sint, corporis recusandae, quae ad necessitatibus quidem dolorem animi earum veniam molestiae ipsa placeat aut.',
	feeling: 2,
	memory: 3,
	credibility: 0,
	lucidity: true,
	recurrence: false,
	perspective: 2,
	sleep: 1,
	mood: 0,
	impact: 1
};
// title: 'Images de voyage',
// date: '',
// text: '',
// feeling: -1,
// memory: -1,
// credibility: -1,
// lucidity: false,
// recurrence: false,
// perspective: -1,
// sleep: -1,
// mood: -1,
// impact: -1

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
		resetState(state) {
			state = { ...initialState }
		},
		setData(state, data) {
			state = data
		}
	},
};