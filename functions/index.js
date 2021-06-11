const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { DeviceHelper } = require("./helpers/device/DeviceHelper");
const { VisionHelper } = require("./helpers/vision/VisionHelper");
const { ElasticsearchHelper } = require("./helpers/elasticsearch/ElasticsearchHelper");

//init firebase
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const elasticsearchHelper = new ElasticsearchHelper();
 
exports.searchDream = functions.https.onCall(async (data, context) => {
	const result = await elasticsearchHelper
		.searchDream(data.userId, data.searchValue);
	return result;
});

exports.getDreamByDate = functions.https.onCall(async (data, context) => {
	const result = await elasticsearchHelper.
		getDreamsByDate(data.userId);
	return result;
});

exports.getDreamByType = functions.https.onCall(async (data, context) => {
	const result = await elasticsearchHelper.
		getDreamsByType(data.userId, data.typeId);
	return result;
});

exports.getDreamByEmotion = functions.https.onCall(async (data, context) => {
	const result = await elasticsearchHelper.
		getEmotionByValue(data.userId, data.emotionId, data.subEmotionId);
	return result;
});

exports.emotionCount = functions.https.onCall(async (data, context) => {
	const result = [];
	const userId = data.userId;
	/* eslint-disable no-await-in-loop */
	for(const emotion of data.emotions) {
		const count = await elasticsearchHelper.getEmotionCount(userId, emotion.id);

		result.push({
			...emotion,
			count: count
		});
	}
	/* eslint-enable no-await-in-loop */
	return result;
});

exports.subEmotionCount = functions.https.onCall(async (data, context) => {
	const result = [];
	const userId = data.userId;
	const emotionId = data.emotionId;

	/* eslint-disable no-await-in-loop */
	for(const subEmotion of data.subEmotions) {
		const count = await elasticsearchHelper.getSubEmotionCount(userId, emotionId, subEmotion.id);
		result.push({
			...subEmotion,
			emotionId: emotionId,
			count: count
		});
	}
	/* eslint-enable no-await-in-loop */
	return result;
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
