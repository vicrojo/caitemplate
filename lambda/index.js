const Alexa = require('ask-sdk');

//Common and Built-In Intent Handlers
const LaunchRequestHandler = require('./commonhandlers/LaunchRequestHandler');
const HelpIntentHandler = require('./commonhandlers/HelpIntentHandler');
const CancelAndStopIntentHandler = require('./commonhandlers/CancelAndStopIntentHandler');
const FallbackIntentHandler = require('./commonhandlers/FallbackIntentHandler');
const SessionEndedRequestHandler = require('./commonhandlers/SessionEndedRequestHandler');
const ErrorHandler = require('./commonhandlers/ErrorHandler');

//CustomHandlers
const OptionIntentHandler = require('./customhandlers/OptionIntentHandler');

//Localisation Interceptor
const LocalisationRequestInterceptor = require('./i18n/LocalisationRequestInterceptor');

//Persistent Attributes Interceptor
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        OptionIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalisationRequestInterceptor)
    . withApiClient(new Alexa.DefaultApiClient())
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
    ).lambda();