class DeviceHelper {
    
    constructor(userId, db) {
        this.db = db;
        this.userId = userId;
        this.docTempDataPath = `user/${userId}/device/temp`;
        this.docStatusPath = `user/${userId}/device/listener`;
        this.dreamCollection = 'dream';
    }

    setDreamData(data) {
        return data;
    }

    async saveDream(data) {
        const result = this.setDreamData(data);
        result.userId = this.userId;
        this.db.collection(this.dreamCollection).add(result);
    }

    async setNewStatus() {
        await this.db.doc(this.docStatusPath).set({
            status: 'pending'
        });
    }
    async deleteTempData() {
        await this.db.doc(this.docTempDataPath).delete();
    }
    async getData() {
        const snapshot = await this.db.doc(this.docTempDataPath).get();
        const data = snapshot.data();
        return data;
    }
}

exports.DeviceHelper = DeviceHelper;