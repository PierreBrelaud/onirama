import { db } from '@/firebase/index.js'

const collection = 'user'

export default {
    add: (id, data, successCallback, errorCallback) => {
        db
            .collection(collection)
            .doc(id)
            .set(data)
            .then((result) => {
                successCallback(result)
            })
            .catch((error) => {
                errorCallback(error)
            })
    },
    getDeviceData: (userId, successCallback, errorCallback) => {
        db
            .collection(collection)
            .doc(userId)
            .collection('deviceData')
            .get()
            .then((result) => {
                successCallback(result)
            })
            .catch((error) => {
                errorCallback(error)
            })
    },
}
