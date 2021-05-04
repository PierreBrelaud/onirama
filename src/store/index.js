import { createStore } from 'vuex'
import { loader } from '@/store/modules/loader'
import { labeling } from '@/store/modules/labeling'

const store = createStore({
    modules: {
        loader,
        labeling
    }
})


export default store