import { db } from '@/firebase/index.js'

const collection = 'dream'

export default {
    addDream: (data, successCallback, errorCallback) => {
        db
            .collection(collection)
            .add(data)
            .then((result) => {
                successCallback(result)
            })
            .catch((error) => {
                errorCallback(error)
            })
    }
}