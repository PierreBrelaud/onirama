export const fake = {
    namespaced: true,
    state: {
        isFake: false,
        fakeText: 'Je suis un imposteur',
    },
    getters: {
        isFake(state) {
            return state.isFake
        },
        fakeText(state) {
            return state.fakeText
        },
    },
    mutations: {
        setIsFake(state, value) {
            state.isFake = value
        }
    },
}