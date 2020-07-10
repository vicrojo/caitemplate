const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor'); 
const languageStrings = require('./languageStrings');

const LocalisationRequestInterceptor = {
    process(handlerInput) {
        const localisationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en', 
            resources: languageStrings
        });

        localisationClient.localise = function () {
            const args = arguments;
            let values = [];

            for (var i = 1; i < args.length; i++) {
                values.push(args[i]);
            }
            const value = i18n.t(args[0], {
                returnObjects: true,
                postProcess: 'sprintf',
                sprintf: values
            });

            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            } else {
                return value;
            }
        }

        handlerInput.t = function (...args) { 
            return localisationClient.localise(...args);
        };
    },
};

module.exports = LocalisationRequestInterceptor