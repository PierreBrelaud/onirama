const functions = require("firebase-functions");
const admin = require("firebase-admin")

//init firebase
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const { DeviceHelper } = require('./helpers/device/DeviceHelper');
const { VisionHelper } = require('./helpers/vision/VisionHelper');



exports.deviceListener = functions.firestore
    .document('user/{userId}/device/listener')
    .onWrite(async (change, context) => {
        //get user id
        const userId = context.params.userId;
        //check status
        const data = change.after.data();
        const status = data.status;

        //if data are available
        if(status === 'done') {
            //init helper
            const helper = new DeviceHelper(userId, db)
            //get temp data from device
            const data = await helper.getData();
            //save data as a new dream
            await helper.saveDream(data)
            //reset temp data
            await helper.deleteTempData();
            //reset device listener status
            await helper.setNewStatus();
        }
    });

exports.imageToText = functions.https.onCall( async (data, context) => {

    const helper = new VisionHelper(data.base64Image);
    
    return await helper.getTextFromImage();

    });