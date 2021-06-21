class DeviceHelper {
    
    constructor(userId, db) {
        this.db = db;
        this.userId = userId;
        this.docTempDataPath = `user/${userId}/device/temp`;
        this.docStatusPath = `user/${userId}/device/listener`;
    }

    async saveDream(data) {
        
        let temperature = null;
        let cardiac = null;
        //temperature
        if(data.temperature)
            temperature = data.temperature.map(Number);

        //cardiac
        if(data.cardiac)
            cardiac = data.cardiac.map(Number)
        
        await this.db.collection('user').doc(this.userId).collection('deviceData').add({
        	start: data.start,
            end: data.end,
            cardiacAvg: cardiac ?  this.getAverage(cardiac) : null,
            temperatureAvg: temperature ?  this.getAverage(temperature) : null
        });
    }

    getAverage(arr) {
        var total = 0;
        for(let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        const avg = total / arr.length;
        return avg.toFixed(2)
    }

    setDate(date) {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: '2-digit', 
            minute: '2-digit' 
        };

        return date.toLocaleDateString("fr-US", options)
    }

    async setEndDate() {
        await this.db.doc(this.docTempDataPath).set({
            end: this.setDate(new Date())
        }, { merge: true });
    }

    async setStartDate() {
        await this.db.doc(this.docTempDataPath).set({
            start: this.setDate(new Date())
        }, { merge: true });
    }

    async setNewStatus() {
        await this.db.doc(this.docStatusPath).set({
            status: 'nothing'
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