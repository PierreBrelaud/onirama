export const settings = {
    namespaced: true,
    state: {
        quality: 'Moyenne',
    },
    getters: {
        getQuality(state) {
            return state.quality
        },
    },
    mutations: {
        setQuality(state, value) {
            state.quality = value
        }
    },
}