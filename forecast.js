var https = require("https")
function forecast(longitude, latitude, session) {
    
    https.get("https://api.darksky.net/forecast/93931e5ac1c73af60169da854b312180/" + longitude + "," + latitude, function (response) {

        var info = "";
        response.on("data", function (chunk) {
            info += chunk;
        });

        response.on("end", function () {
            if (response.statusCode === 200) {
                try {
                    var data = JSON.parse(info);
                    session.send("Weather is " + data.currently.summary + " in " + data.timezone + ".");
                    switch (data.currently.summary) {
                        case 'Clear':
                            session.send("Don't worry about an umbrella or a coat!");
                            break;
                        case 'Overcast':
                            session.send("You might want to pack an umbrella just in case!");
                            break;
                        case 'Light Snow':
                            session.send("Wear a Coat and stay warm!");
                            break;
                        case 'Rainy':
                            session.send("Bring an umbrella!");
                            break;
                        default:
                            session.send("Be prepared for any type of weather!");
                            break;
                    }
                    session.endDialog();

                } catch (error) {
                    session.send("Sorry something went wrong");
                    session.endDialog();

                }
            } else {
                session.send("Sorry something went wrong");
                session.endDialog();

            }


        });
    });
}

module.exports.forecast = forecast;


