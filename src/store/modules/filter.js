export const filter = {
    namespaced: true,
    state: {
        navigationItem: null,
        nebulaData: {
            step: 0,
            emotionId: null,
            subEmotionId: null,
        },
        mapData: null,
        chronologyData: null,
    },
    getters: {
        navigationItem(state) {
            return state.navigationItem
        },
        nebulaData(state) {
            return state.nebulaData
        },
        mapData(state) {
            return state.mapData
        },
        chronologyData(state) {
            return state.chronologyData
        },
    },
    mutations: {
        setNavigationItem(state, value) {
            state.navigationItem = value;
        },
        setNebulaData(state, value) {
            state.nebulaData = value;
        },
    }
};