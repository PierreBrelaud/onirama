const { Client } = require("@elastic/elasticsearch");
const functions = require("firebase-functions");

class ElasticsearchHelper {
	constructor() {
		this.client = this.initClient();
	}

	/**
	 * Init elastic search client
	 * @returns Client
	 */
	initClient() {

		const env = functions.config();

		const node = env.elasticsearch.url;
		const auth = {
			username: env.elasticsearch.username,
			password: env.elasticsearch.password,
		};

		return new Client({
			node: node,
			auth: auth,
		});
	}

	/**
	 * Search in dream text & title
	 * @param {String} userId 
	 * @param {String} search value
	 * @returns {Promise}
	 */
	async searchDream(userId, value) {
		const result = await this.client.search({
			index: "dream",
			body: {
				query: {
					bool: {
						must: [
							{
								query_string: {
									fields: ["text", "title"],
									query: `*${value}*`,
								},
							},
							{
								match: {
									userId: userId,
								},
							},
						],
					},
				},
			},
		});
		return result.body;
	}

	/**
	 * Get dream by date desc
	 * @param {String} userId  
	 * @returns {Promise}
	 */
	async getDreamsByDate(userId) {
		const result = await this.client.search({
			index: "dream",
			body: {
				query: {
					match: {
						userId: userId,
					},
				},
				sort: {
					date: "desc",
				},
			},
		});
		return result.body;
	}

	/**
	 * Get dream by type
	 * @param {String} userId 
	 * @param {Number} typeId 
	 * @returns {Promise}
	 */
	async getDreamsByType(userId, type) {
		const result = await this.client.search({
			index: "dream",
			body: {
				query: {
					bool: {
						must: [
							{ match: { type: type } },
							{ match: { userId: userId } },
						],
					},
				},
			},
		});
		return result.body;
	}

	/**
	 * Get emotion count
	 * @param {String} userId 
	 * @param {Number} emotionId 
	 * @returns {Promise}
	 */
	async getEmotionCount(userId, emotionId) {
		const result = await this.client.count({
			index: "dream",
			body: {
				query: {
					bool: {
						must: [
							{
								nested: {
									path: "emotions",
									query: {
										bool: {
											must: [
												{
													match: {
														"emotions.emotionId": emotionId,
													},
												},
											],
										},
									},
								},
							},
							{
								match: {
									userId: userId,
								},
							},
						],
					},
				},
			},
		});
		return result.body.count;
	}

	/**
	 * Get dream by sub emotion
	 * @param {String} userId 
	 * @param {Number} emotionId 
	 * @param {Number} subEmotionId 
	 * @returns {Promise}
	 */
	async getEmotionByValue(userId, emotionId, subEmotionId) {
		const result = await this.client.search({
			index: "dream",
			body: {
				query: {
					bool: {
						must: [
							{
								nested: {
									path: "emotions",
									query: {
										bool: {
											must: [
												{
													match: {
														"emotions.emotionId": emotionId,
													},
												},
												{
													match: {
														"emotions.subEmotionId": subEmotionId,
													},
												},
											],
										},
									},
								},
							},
							{
								match: {
									userId: userId,
								},
							},
						],
					},
				},
			},
		});
		return result.body;
	}

	/**
	 * Get sub emotion count
	 * @param {String} userId 
	 * @param {Number} emotionId 
	 * @param {Number} subEmotionId 
	 * @returns {Promise}
	 */
	async getSubEmotionCount(userId, emotionId, subEmotionId) {
		const result = await this.client.count({
			index: "dream",
			body: {
				query: {
					bool: {
						must: [
							{
								nested: {
									path: "emotions",
									query: {
										bool: {
											must: [
												{
													match: {
														"emotions.emotionId": emotionId,
													},
												},
												{
													match: {
														"emotions.subEmotionId": subEmotionId,
													},
												},
											],
										},
									},
								},
							},
							{
								match: {
									userId: userId,
								},
							},
						],
					},
				},
			},
		});
		return result.body.count;
	}

	/**
	 * Create dream index
	 * @param {Object} snap 
	 * @param {Object} context 
	 */
	async createDreamIndex(snap, context) {
		await this.client.index({
			index: "dream",
			type: "_doc",
			id: context.params.dreamId,
			body: snap.data(),
		});
	}

	/**
	 * Update dream index
	 * @param {Object} snap 
	 * @param {Object} context 
	 */
	async updateDreamIndex(snap, context) {
		await this.client.update({
			index: "dream",
			id: context.params.dreamId,
			body: {
				doc: snap.after.data(),
			},
		});
	}

	/**
	 * Delete dream index
	 * @param {Object} snap 
	 * @param {Object} context 
	 */
	async deleteDreamIndex(snap, context) {
		await this.client.delete({
			index: "dream",
			type: "_doc",
			id: context.params.dreamId,
		});
	}
}

exports.ElasticsearchHelper = ElasticsearchHelper;
