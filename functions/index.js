const functions = require("firebase-functions");
const vision = require("@google-cloud/vision");
const express = require("express");
const cors = require("cors");

const app = express();

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
