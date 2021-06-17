import { db } from '@/firebase/index.js'

const collection = 'dream'

export default {
    generateDream: (dreamId, successCallback, errorCallback) => {
        db
            .collection(collection)
            .doc(dreamId)
            .update({
                isGenerated: true
            })
            .then(result => {
                successCallback(result)
            })
            .catch(error => errorCallback(error)) 
    },
    getNotGeneratedDream: (userId, successCallback, errorCallback) => {
        db
            .collection(collection)
            .where('isGenerated', '==', false)
            .where('userid', '==', userId)
            .limit(1)
            .get()
            .then(result => successCallback(result))
            .catch(error => errorCallback(error)) 
    },
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
    },
    getDreamsForVisualisation: (userId, successCallback, errorCallback) => {
        db
            .collection(collection)
            .where('userId', '==', userId)
            .limit(10)
            .get()
            .then((result) => {
                successCallback(result)
            })
            .catch((error) => {
                errorCallback(error)
            })

    },
    getAll: (successCallback, errorCallback) => {
        db
            .collection(collection)
            .get()
            .then((result) => {
                successCallback(result)
            })
            .catch((error) => {
                errorCallback(error)
            })
    }
}
