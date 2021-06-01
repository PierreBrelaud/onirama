const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Client } = require("@elastic/elasticsearch");

//init firebase
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const env = functions.config();

const auth = {
	username: env.elasticsearch.username,
	password: env.elasticsearch.password,
};

const client = new Client({
	node: env.elasticsearch.url,
	auth: auth,
});

exports.createDream = functions.firestore
	.document("dream/{dreamId}")
	.onCreate(async (snap, context) => {
		await client.index({
			index: "dream",
			type: "_doc",
			id: context.params.dreamId,
			body: snap.data(),
		});
	});

exports.updateDream = functions.firestore
	.document("dream/{dreamId}")
	.onUpdate(async (snap, context) => {
		await client.update({
			index: "dream",
			id: context.params.dreamId,
			body: {
				doc: snap.after.data(),
			}
		});
	});

exports.deleteDream = functions.firestore
	.document("dream/{dreamId}")
	.onDelete(async (snap, context) => {
		await client.delete({
			index: "dream",
			type: "_doc",
			id: context.params.dreamId,
		});
	});

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
