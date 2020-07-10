const AWS = require('aws-sdk');
const s3SigV4Client = new AWS.S3({
    signatureVersion: 'v4',
    region: process.env.S3_PERSISTENCE_REGION
});
const Alexa = require('ask-sdk');


module.exports = {
    
    getS3PreSignedUrl(s3ObjectKey) {

    const bucketName = process.env.S3_PERSISTENCE_BUCKET;
    const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: s3ObjectKey,
        Expires: 60*1 // the Expires is capped for 1 minute
    });
    console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
    return s3PreSignedUrl;

},

supportsDisplay(handlerInput) {
    const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
    const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
    return aplInterface !== null && aplInterface !== undefined;
},

    intentWasInvokedAsOneshot(handlerInput) {
        return (handlerInput.requestEnvelope.session && handlerInput.requestEnvelope.session.new);
    },

    keepScreen(seconds = 3) {
        let breakTime = seconds;
        if (seconds > 10) breakTime = 10;
        if (seconds < 0) breakTime = 0;
        return `<break time ="${breakTime}s"/>`
    },

    getDisplaySize(requestEnvelope) {
        const hasDisplayInfo =
            requestEnvelope &&
            requestEnvelope.context.Viewport &&
            requestEnvelope.context.Viewport.pixelWidth &&
            requestEnvelope.context.Viewport.pixelHeight;
        if (hasDisplayInfo) {
            return {
                width: requestEnvelope.context.Viewport.pixelWidth,
                height: requestEnvelope.context.Viewport.pixelHeight
            };
        }
        return null;
    },

    getSlotId(handlerInput, slotName) {
        const { requestEnvelope } = handlerInput;
        const filledSlots = requestEnvelope.request.intent.slots;
        let slotId;

        if (filledSlots[slotName] &&
            filledSlots[slotName].resolutions &&
            filledSlots[slotName].resolutions.resolutionsPerAuthority[0] &&
            filledSlots[slotName].resolutions.resolutionsPerAuthority[0].status &&
            filledSlots[slotName].resolutions.resolutionsPerAuthority[0].status.code) {

            if (filledSlots[slotName].resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH') {
                slotId = filledSlots[slotName].resolutions.resolutionsPerAuthority[0].values[0].value.id;
            }
        }
        return slotId;
    },

    getAudioItemMetadata(title, subtitle, artImageURL, bkgImageURL) {
        let audioItemMetadata = {
            "title": title,
            "subtitle": subtitle,
            "art": {
                "sources": [{
                    "url": artImageURL
                }]
            },
            "backgroundImage": {
                "sources": [{
                    "url": bkgImageURL
                }]
            }
        };
        return audioItemMetadata;
    },

    getToken() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },


    async CalProgressiveResponse(handlerInput) {
        // Call Alexa Directive Service.
        const requestEnvelope = handlerInput.requestEnvelope;
        const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient();
        const requestId = requestEnvelope.request.requestId;        
        
        // build the progressive response directive
        const directive = {
          header: {
            requestId,
          },
          directive: {
            type: "VoicePlayer.Speak",
            speech: handlerInput.t('WELCOME_MSG_WARMUP')
          },
        };
        
        // send directive
        return directiveServiceClient.enqueue(directive);
      }
}