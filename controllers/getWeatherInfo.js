const request = require('request');
const host = 'https://api.worldweatheronline.com';
// const wwoApiKey = 'e638c9f3200245c39ed182120171911';
const WEATHER_API_KEY = '8aa49514c882b1885bde1a3d7d11362f';

module.exports = (req, res) => {
    if (req.body.result.action === 'weather') {
        let city = req.body.result.parameters['geo-city']; // city is a required param
        console.dir(req.body.result.parameters);
        // Get the date for the weather forecast (if present)
        // let date = '';
        // if (req.body.result.parameters['date']) {
        //     date = req.body.result.parameters['date'];
        //     console.log('Date: ' + date);
        // }

        console.log(city);
        // Call the weather API
        callWeatherApi(city).then((output) => {
            // Return the results of the weather API to Dialogflow
            return res.json({
                speech: output,
                displayText: output,
                source: 'weather'
            });
        }).catch((error) => {
            // If there is an error let the user know
            return res.json({
                speech: error,
                displayText: error,
                source: 'weather'
            });
        });
    }
}

function callWeatherApi(city) {
    return new Promise((resolve, reject) => {
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city + '&units=metric';
        console.dir(restUrl);
        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                console.dir(body);
                let json = JSON.parse(body);
                let msg = ' Here we go , the temperature for the city ' + json.name + ' is ' + json.main.temp + '°C';
                resolve(msg);
            } else {
                console.dir(err);
                let errorType = 'I failed to look up the city name. and the error is ' + err;
                resolve(errorType);
            }
        })
        // // Create the path for the HTTP request to get the weather
        // let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
        //     '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
        // console.log('API Request: ' + host + path);
        // // Make the HTTP request to get the weather

        // request({
        //     uri: host + path,
        //     methos: 'GET'
        // }, (err, response, body) => {
        //     if (err) {
        //         console.dir(err)
        //         reject(error);
        //     }
        //     let result = JSON.parse(body);
        //     console.dir(result);
        //     let forecast = result['data']['weather'][0];
        //     let location = result['data']['request'][0];
        //     let conditions = result['data']['current_condition'][0];
        //     let currentConditions = conditions['weatherDesc'][0]['value'];
        //     // Create response
        //     let output = `Current conditions in the ${location['type']} 
        // ${location['query']} are ${currentConditions} with a projected high of
        // ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        // ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        // ${forecast['date']}.`;
        //     // Resolve the promise with the output text
        //     console.log(output);
        //     resolve(output);
        // })
    });
}