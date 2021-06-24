import { db } from '@/firebase/index.js'

const collection = 'user'

export default {
    getDeviceState: (userId, successCallback, errorCallback) => {
        db
            .collection(collection)
            .doc(userId)
            .collection('device')
            .doc('listener')
            .get()
            .then(result => successCallback(result))
            .catch(error => errorCallback(error))
    },
}

