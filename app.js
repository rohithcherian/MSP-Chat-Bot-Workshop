var restify = require('restify');
var builder = require('botbuilder');
var datetime = new Date();
var https = require("https");
var forecast = require('./forecast.js')
var builder_cognitiveservices = require("botbuilder-cognitiveservices");



// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "",
    appPassword:""
   /* appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata     */
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the Microsoft Workshop at the University of Houston!");
        builder.Prompts.text(session, "Please enter your Name");
    },
    function (session, results) {
        session.dialogData.name = results.response;
        session.send(`Hello ${session.dialogData.name}!`);
builder.Prompts.text(session, "How are you doing today?");
},

function (session, results) {
    var resultsResponse = results.response.toUpperCase();

    var responsesTypes = {
        'GOOD': 1,
        'GOOD!': 1,
        'FINE': 1,
        'FINE!': 1,
        ':)': 1,
        'NOT WELL': 2,
        'NOT GOOD': 2,
        'NOT GOOD!': 2,
        'BAD': 2,
        'BAD!': 2,
        'SAD': 2,
        ':(': 2
    };

    var responsesMessage = "Great! I would like to get to know you, what is your classification? (Ex:Freshman, Sophomore, etc*)";

    var getResponseType = responsesTypes[resultsResponse];
    
    if (getResponseType === 1) {
        responsesMessage = "That's great! Glad you are doing well! I would like to get to know you, what is your classification? (Ex:Freshman, Sophomore, etc*)";
    } else if (getResponseType === 2) {
        responsesMessage = "Aww its okay! This workshop will make you feel better hopefully :)! I would like to get to know you, what is your classification? (Ex:Freshman, Sophomore, etc*)";
    }

    builder.Prompts.text(session, responsesMessage);
},

function (session, results) {
    session.dialogData.classification = results.response;
    var upperCaseResponse = results.response.toUpperCase();
    switch(upperCaseResponse){
        case 'FRESHMAN':
            builder.Prompts.text(session, "Welcome to your first year of college! Are you interested in coming to future workshops to learn about Microsoft Technologies?");
            break;
        case 'SOPHOMORE':
        case 'JUNIOR':
            builder.Prompts.text(session, "Welcome back! Are you interested in becoming a member and attending future workshops to learn about Microsoft Technologies?");
            break;
        case 'SENIOR':
            builder.Prompts.text(session, "Wow! Looks like you are almost done here! Are you interested in coming to future workshops to learn about Microsoft Technologies? ");
            break;
        default:
            builder.Prompts.text(session, "Great! Are you interested in coming to future workshops to learn about Microsoft Technologies?");
            break;
    }
},

function (session, results) {
    var sessionResponse = results.response.toUpperCase();
    session.dialogData.classification = results.response;
    
    switch(sessionResponse) {
        case 'YES':
            builder.Prompts.text(session, "Awesome! Please provide your email:");
            break;
        case 'NO':
            session.send(`Sorry to hear that! It was nice knowing you ${session.dialogData.name}! Goodbye!`);
            session.endDialog();
            break;
        default:
            builder.Prompts.text(session, "Please provide your email:");
            break;
    }   

},
function(session, results) {
    session.dialogData.email = results.response;
    // Process request and display reservation details
    builder.Prompts.text(session, "Lastly, could you provide me with your shirt size?");
},
function(session, results) {
    session.dialogData.shirtSize = results.response;
    // Process request and display reservation details
    session.send(`Awesome! These are your details we will keep for membership! Name: ${session.dialogData.name} <br/>Classification: ${session.dialogData.classification} <br/>Email: ${session.dialogData.email}<br/>Shirt Size: ${session.dialogData.shirtSize}<br/>Date of Registration: ${datetime}<br/>Thank you so much for your time and have a nice day!`);
    forecast.forecast(29.5546, -95.4125,session)  
        //forecast.forecast(44.9778, -93.2650,session)  
            session.endDialog();  

    }
]);
