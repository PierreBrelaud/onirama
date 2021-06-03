import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'; 
import { loader } from '@/store/modules/loader'
import { labeling } from '@/store/modules/labeling'
import { restitution } from "@/store/modules/restitution";
import { auth } from "@/store/modules/auth";


const store = createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    modules: {
        loader,
        labeling,
        restitution,
        auth
    }
})


export default store