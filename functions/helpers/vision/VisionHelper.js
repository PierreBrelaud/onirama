const vision = require("@google-cloud/vision");

class VisionHelper {
    

    constructor(base64Image) {
        this.base64Image = base64Image;
        this.client = new vision.ImageAnnotatorClient()
    }

    async getTextFromImage() {

        const options = {
            image: {
                content: Buffer.from(this.base64Image, "base64"),
            },
        };

        const [result] = await this.client.documentTextDetection(options);
    
        return result.fullTextAnnotation.text;
    }
}

exports.VisionHelper = VisionHelper;