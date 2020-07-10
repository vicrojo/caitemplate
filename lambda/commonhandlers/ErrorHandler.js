const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');

        console.log(`Error Message:${error.message}|Stack:${error.stack}`);
        console.log("Handler Input:" + JSON.stringify(handlerInput));
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

module.exports = ErrorHandler;