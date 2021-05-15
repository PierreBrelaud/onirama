import { createStore } from 'vuex'
import { loader } from '@/store/modules/loader'
import { labeling } from '@/store/modules/labeling'
import { restitution } from "@/store/modules/restitution";
import { auth } from "@/store/modules/auth";

const store = createStore({
    modules: {
        loader,
        labeling,
        restitution,
        auth
    }
})


export default store