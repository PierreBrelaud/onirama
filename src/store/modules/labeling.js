import LabelingHelper from '@/utils/labelingHelper.js'

export const labeling = {
	namespaced: true,
	state: {
        labelingHelper: null
	},
	actions: {
		init({ commit }) {
			commit("init")
		},
	},
	mutations: {
		init(state) {
            if(!state.labelingHelper) {
                state.labelingHelper = new LabelingHelper()
                console.log("init labeling helper");
            }
            else {
                console.log("init labeling helper exists")
            }
		},
        destroy(state) {
            state.labelingHelper = null
            console.log("destroy labeling helper")
        }
	},
    getters: {
        instance(state) {
            return state.labelingHelper
        }
    }
};
