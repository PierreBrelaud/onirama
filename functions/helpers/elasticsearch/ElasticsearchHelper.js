const { Client } = require("@elastic/elasticsearch");
const functions = require("firebase-functions");

class ElasticsearchHelper {

	constructor() {		
		this.client = this.initClient();
	}

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

	async request() {}

	async getDreamsByDate() {
		const result = await this.client.search({
			index: "dream",
			body: {
				sort: {
					date: "desc"
				}
			}
		})
		return result.body;
	}

	async getDreamsByType(userId, typeId) {
		const result = await this.client.search({
			index: "dream",
			body: {
				query: {
					bool: {
						must: [
							{ match: { "type": typeId } },
							{ match: { "userId": userId } }
						]
					}
				}
			}
		})
		return result.body;
	}

	async getEmotionTypeCount(userId, type) {
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
												{ match: { "emotions.type": type } }
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

	async getEmotionByValue(userId, type, value) {

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
												{ match: { "emotions.type": type } },
												{ match: { "emotions.value": value } }
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
		return result.body
	}

	async getEmotionValueCount(userId, type, value) {
		
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
												{ match: { "emotions.type": type } },
												{ match: { "emotions.value": value } }
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
		return result.body.count
	}

	async createDreamIndex(snap, context) {
		await this.client.index({
			index: "dream",
			type: "_doc",
			id: context.params.dreamId,
			body: snap.data(),
		})
	} 

	async updateDreamIndex(snap, context) {
		await this.client.update({
			index: "dream",
			id: context.params.dreamId,
			body: {
				doc: snap.after.data(),
			},
		});
	}

	async deleteDreamIndex(snap, context) {
		await this.client.delete({
			index: "dream",
			type: "_doc",
			id: context.params.dreamId,
		});
	}
}

exports.ElasticsearchHelper = ElasticsearchHelper;
