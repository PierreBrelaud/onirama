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
        destroy({commit}) {
            commit("destroy")
        }
	},
	mutations: {
		init(state) {
            if(!state.labelingHelper) {
                state.labelingHelper = new LabelingHelper()
            }
		},
        destroy(state) {
            state.labelingHelper = null
        }
	},
    getters: {
        instance(state) {
            return state.labelingHelper
        }
    }
};
