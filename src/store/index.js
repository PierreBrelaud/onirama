import { createStore } from 'vuex'
import { loader } from '@/store/modules/loader'
import { labeling } from '@/store/modules/labeling'
import { restitution } from "@/store/modules/restitution";

const store = createStore({
    modules: {
        loader,
        labeling,
        restitution
    }
})


export default store