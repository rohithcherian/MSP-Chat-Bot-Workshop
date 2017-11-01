var restify = require('restify');
var builder = require('botbuilder');
var datetime = new Date();
var https = require("https");
var forecast = require('./forecast.js')



// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
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
    switch(results.response){
        case 'good':
        case 'Good':
        case 'Good!':
        case 'fine':
        case 'Fine':
        case 'Fine!':
        case ':)':
            builder.Prompts.text(session, "That's great! Glad you are doing well! I would like to get to know you, what is your classification? (Ex:Freshman, Sophomore, etc*)");
            break;
        case 'not well':
        case 'not good':
        case 'bad!':
        case 'bad':
        case 'sad':
        case 'not good!':
        case 'Not Good!':
        case ':(':
            builder.Prompts.text(session, "Aww its okay! This workshop will make you feel better hopefully :)! I would like to get to know you, what is your classification? (Ex:Freshman, Sophomore, etc*)");
            break;
        default:
            builder.Prompts.text(session, "Great! I would like to get to know you, what is your classification? (Ex:Freshman, Sophomore, etc*)");
            break;

    }
},
function (session, results) {
    session.dialogData.classification = results.response;
    switch(results.response){
        case 'Freshman':
        case 'freshman':
            builder.Prompts.text(session, "Welcome to your first year of college! Are you interested in coming to future workshops to learn about Microsoft Technologies?");
            break;
        case 'Sophomore':
        case 'sophomore':
        case 'Junior':
        case 'junior':
            builder.Prompts.text(session, "Welcome back! Are you interested in becoming a member and attending future workshops to learn about Microsoft Technologies?");
            break;
        case 'senior':
        case 'Senior':
            builder.Prompts.text(session, "Wow! Looks like you are almost done here! Are you interested in coming to future workshops to learn about Microsoft Technologies? ");
            break;
        default:
            builder.Prompts.text(session, "Great! Are you interested in coming to future workshops to learn about Microsoft Technologies?");
            break;
    }
},

/*


Insert Email Function here


*/



function(session, results) {
    session.dialogData.email = results.response;
    // Process request and display reservation details
    builder.Prompts.text(session, "Lastly, could you provide me with your shirt size?");
},
function(session, results) {
    session.dialogData.shirtSize = results.response;
    // Process request and display reservation details
    session.send(`Awesome! These are your details we will keep for membership! Name: ${session.dialogData.name} <br/>Classification: ${session.dialogData.classification} <br/>Email: ${session.dialogData.email}<br/>Shirt Size: ${session.dialogData.shirtSize}<br/>Date of Registration: ${datetime}<br/>Thank you so much for your time and have a nice day!`);
    builder.Prompts.text(session, "Want to know what to wear?");

    },
function(session, results) {
    session.dialogData.wear = results.response;
    // Process request and display reservation details
            
    switch(results.response){
        case 'No':
        case 'no':
            session.send(`Goodbye!`);
            session.endDialog();
            break;
        default:
            forecast.forecast(29.5546, -95.4125,session)  
            //forecast.forecast(44.9778, -93.2650,session)  
            session.endDialog();  
    
    
    }



}




]);
    

    