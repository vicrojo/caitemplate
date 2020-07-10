
const Alexa = require('ask-sdk');

const skillsUtils = require('../util/SkillUtils')

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const { attributesManager, requestEnvelope } = handlerInput;
        await skillsUtils.CalProgressiveResponse(handlerInput);

        let attributes = await attributesManager.getPersistentAttributes();

        //Retrieve the amount of times the user has launched the skill
        let skillVisits = attributes.hasOwnProperty('skillVisits') ? attributes.skillVisits : 1;
        //Retrieve the last time the user launched the skill
        let lastVisit = attributes.hasOwnProperty('lastVisit') ? attributes.lastVisit : new Date();
        //Update skill launches and last launch date of the skill
        attributes.skillVisits = skillVisits + 1;
        attributes.lastVisit = new Date();
        //Save this values as persistent attributes        
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();

        //Validate if the user has linked his account to the skill
        //In this case, the skill validates account linking at launch of the skill
        /*let accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
        if (!accessToken){
            var speechText = handlerInput.t('ACCOUNT_LINKING_MISSING');
            return handlerInput.responseBuilder
                .speak(speechText)
                .withLinkAccountCard()
                .getResponse();
        }*/
        
        
        //If the skill has linked succesfully his account, show the welcome screen
        const aplDoc = require('../apldocs/welcome.json');
        const payload = require('../apldocs/welcomedata.json');

        const speakOutput = handlerInput.t('WELCOME_MSG');
        const speakOutputReprompt = handlerInput.t('WELCOME_MSG_REPROMPT');

        if (skillsUtils.supportsDisplay(handlerInput)) {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutputReprompt)
                 .addDirective({
                     type: 'Alexa.Presentation.APL.RenderDocument',
                     version: '1.1',
                     document: aplDoc,
                     datasources: payload
                 })
                .getResponse();
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutputReprompt)
            .getResponse();
    }
};

module.exports = LaunchRequestHandler;