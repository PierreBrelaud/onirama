const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { DeviceHelper } = require("./helpers/device/DeviceHelper");
const { VisionHelper } = require("./helpers/vision/VisionHelper");
const { ElasticsearchHelper } = require("./helpers/elasticsearch/ElasticsearchHelper");

//init firebase
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.emotionValueCount = functions.https.onCall(async (data, context) => {
	const elasticsearchHelper = new ElasticsearchHelper(data.userId);
	return elasticsearchHelper.getEmotionValueCount(data.type, data.value)
});

exports.createDream = functions.firestore
	.document("dream/{dreamId}")
	.onCreate(async (snap, context) => {
 		const helper = new ElasticsearchHelper();
		await helper.createDreamIndex(snap, context);
	});

exports.updateDream = functions.firestore
	.document("dream/{dreamId}")
	.onUpdate(async (snap, context) => {
 		const helper = new ElasticsearchHelper();
		await helper.updateDreamIndex(snap, context);
	});

exports.deleteDream = functions.firestore
	.document("dream/{dreamId}")
	.onDelete(async (snap, context) => {
 		const helper = new ElasticsearchHelper();
		await helper.deleteDreamIndex(snap, context);
	});

exports.deviceListener = functions.firestore
	.document("user/{userId}/device/listener")
	.onWrite(async (change, context) => {
		//get user id
		const userId = context.params.userId;
		//check status
		const data = change.after.data();
		const status = data.status;

		//if data are available
		if (status === "done") {
			//init helper
			const helper = new DeviceHelper(userId, db);
			//get temp data from device
			const data = await helper.getData();
			//save data as a new dream
			await helper.saveDream(data);
			//reset temp data
			await helper.deleteTempData();
			//reset device listener status
			await helper.setNewStatus();
		}
	});

exports.imageToText = functions.https.onCall(async (data, context) => {
	const helper = new VisionHelper(data.base64Image);

	return await helper.getTextFromImage();
});
