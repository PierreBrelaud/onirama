
const initialState = {
	title: 'La noyade',
	date: null,
	text: '',
	type: null,
	emotions: [
		{emotionId: 1, subEmotionId: 2}, {emotionId: 3, subEmotionId: 2}, {emotionId: 0, subEmotionId: 2}
	],
	feeling: -1,
	memory: -1,
	credibility: -1,
	lucidity: false,
	recurrence: false,
	perspective: -1,
	sleep: -1,
	mood: -1,
	impact: -1
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
		resetData(state) {
			state = initialState
		},
		setData(state, data) {
			state = data
		}
	},
};