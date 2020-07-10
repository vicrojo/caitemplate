const Alexa = require('ask-sdk');

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    async handle(handlerInput) {
        const {attributesManager, responseBuilder} = handlerInput;
        return responseBuilder.getResponse(); 
    }
};

module.exports = SessionEndedRequestHandler;