import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'; 
import { loader } from '@/store/modules/loader'
import { labeling } from '@/store/modules/labeling'
import { restitution } from "@/store/modules/restitution";
import { auth } from "@/store/modules/auth";
import { filter } from "@/store/modules/filter";
import { visualisation } from "@/store/modules/visualisation";
import { fake } from "@/store/modules/fake";
import { settings } from "@/store/modules/settings";


const store = createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
        paths: ['filter', 'visualisation', 'auth', 'settings']
    })],
    modules: {
        loader,
        labeling,
        restitution,
        auth,
        filter,
        visualisation,
        fake,
        settings
    }
})


export default store