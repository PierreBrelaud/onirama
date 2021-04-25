import { createStore } from 'vuex'
import { loader } from '@/store/modules/loader'

const store = createStore({
    modules: {
        loader
    }
})


export default store