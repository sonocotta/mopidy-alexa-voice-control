/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
'use strict';

const Alexa = require('ask-sdk-core');
const config = require('./config');
const intents = require('./intent-schema.json').interactionModel.languageModel.intents;

var Client = require('azure-iothub').Client;
var client = Client.fromConnectionString(config.connectionString);

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to the Alexa Mopidy Control Skill!';

        return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Mopidy Control', speechText)
        .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me!';

        return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Mopidy Control', speechText)
        .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Mopidy Control', speechText)
        .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
        .speak('Sorry, I can\'t understand the command. Please say again.')
        .reprompt('Sorry, I can\'t understand the command. Please say again.')
        .getResponse();
    },
};

var getMethodParams = function (methodName, payload) {
    return {
        methodName: methodName,
        payload: payload,
        responseTimeoutInSeconds: config.timeout
    };
};

function fireDeviceMethod(methodParams) {
    console.log('methodParams;', methodParams);
    return new Promise((resolve, reject) => {
        client.invokeDeviceMethod(config.targetDevice, methodParams, function (err, result) {
            if (err) {
                console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
                reject(err);
            } else {
                console.log(methodParams.methodName + ' on ' + config.targetDevice + ':');
                console.log(JSON.stringify(result, null, 2));
                resolve(result);
            }
        });
    });
};

function fireDeviceMethodAndReply(intent) {
    return {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === intent.name;
        },
        async handle(handlerInput) {

            var payload = {};
            if (intent.slots) {
                intent.slots.forEach(x => {
                    payload[x.name] = handlerInput.requestEnvelope.request.intent.slots[x.name].value;
                });
            }

            try {
                let result = await fireDeviceMethod(getMethodParams(intent.name, payload));
                var message = result.payload.message || 'OK';
                return handlerInput.responseBuilder
                .speak(message)
                .withSimpleCard('Mopidy Control', message)
                .getResponse();
            } catch (err) {
                return handlerInput.responseBuilder
                .withSimpleCard('Mopidy Control', 'Sorry, but we have an error')
                .getResponse();
            }
        }
    };
};

var handlers = [LaunchRequestHandler, HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler];
intents.forEach(intent => {
    console.log("* Adding handler for [", intent.name, "] method");
    if ( intent.name.indexOf('AMAZON') < 0 ) {
        handlers.push(fireDeviceMethodAndReply(intent));
    }
});

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
.addRequestHandlers(...handlers)
.addErrorHandlers(ErrorHandler)
.lambda();