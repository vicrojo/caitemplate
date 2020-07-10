const Alexa = require('ask-sdk');
const skillsUtils = require('../util/SkillUtils')

const OptionIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
                && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'OptionIntent' || Alexa.getIntentName(handlerInput.requestEnvelope) === 'OptionOnlyIntent'))
                || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.arguments.length > 0
                && handlerInput.requestEnvelope.request.arguments[0] === 'TouchWelcomeScreen');

    },
    async handle(handlerInput) {
        const { attributesManager, requestEnvelope } = handlerInput;
        const {request} = requestEnvelope;
        let optionSelected;
        let attributes = await attributesManager.getPersistentAttributes();
        
        if (request.type === 'Alexa.Presentation.APL.UserEvent') {
            optionSelected = request.arguments[1];
        } else {
            optionSelected = skillsUtils.getSlotId(handlerInput, "OptionSlot");
        }
        //TODO: Execute your business logic, invoke an API, etc)

        //TODO: Save your persistent attributes
        
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();

        //TODO: Prepare your response
        const speakOutput = handlerInput.t('OPTION_SELECTED',optionSelected ); 
        
        let response = handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
            
        console.log ("Response:" + JSON.stringify(response));

        return response;
    }
};

module.exports = OptionIntentHandler;