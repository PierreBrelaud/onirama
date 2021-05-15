export const auth = {
    namespaced: true,
    state: {
        user: {
            loggedIn: false,
            data: null,
        },
    },
    getters: {
        user(state) {
            return state.user
        },
    },
    mutations: {
        setLoggedIn(state, value) {
            state.user.loggedIn = value
        },
        setUser(state, data) {
            state.user.data = data
        },
    },
    actions: {
        fetchUser({ commit }, user) {
            commit('setLoggedIn', user !== null)
            if (user) {
                commit('setUser', {
                    uid: user.uid,
                    email: user.email,
                })
            } else {
                commit('setUser', null)
            }
        },
    },
};
