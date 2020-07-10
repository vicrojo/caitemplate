const Alexa = require('ask-sdk');

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
            || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
            );
    },
    async handle(handlerInput) {
        const {attributesManager, responseBuilder } = handlerInput;
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        return responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

module.exports = CancelAndStopIntentHandler;