const functions = require("firebase-functions");
const admin = require("firebase-admin")
const vision = require("@google-cloud/vision");
const express = require("express");
const cors = require("cors");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();

const { DeviceHelper } = require('./helpers/device/DeviceHelper');


exports.deviceListener = functions.firestore
    .document('user/{userId}/device/listener')
    .onWrite(async (change, context) => {
        //récupération du userId
        const userId = context.params.userId;
        //vérification du status
        const data = change.after.data();
        const status = data.status;
        //si les données sont disponibles
        if(status === 'done') {
            //initialisation du helper
            const helper = new DeviceHelper(userId, db)

            //récupérer les data temporaires
            const data = await helper.getData();

            await helper.saveDream(data)

            await helper.deleteTempData();

            await helper.setNewStatus();

        }
    });


app.use(cors({origin: true}));

app.post("/imageToText", async (req, res) => {
    const client = new vision.ImageAnnotatorClient();

    const options = {
        image: {
            content: Buffer.from(req.body.base64Image, "base64"),
        },
    };

    const [result] = await client.documentTextDetection(options);

    res.send(result.fullTextAnnotation.text);
});

exports.api = functions.https.onRequest(app);
