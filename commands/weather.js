const axios = require('axios');
const emoji = require('node-emoji');
const getLocationData = require('../utils/location_lookup');

module.exports.run = async (source, query) => {
    if (query === '')
        return 'Try ".weather some place (or zip code)"';

    const locationData = await getLocationData(query);
    if (!locationData)
        return 'There was a problem getting location data.';

    try {
        const url = `https://api.pirateweather.net/forecast/` +
                    `${ process.env.PIRATE_WEATHER_KEY }/` +
                    `${ locationData.latitude },` +
                    `${ locationData.longitude }` +
                    `?exclude=minutely,hourly,daily` +
                    `&units=us`;

        const response = await axios.get(url);

        const weather = {
            location: locationData.formattedAddr,
            temperature: response.data.currently.temperature,
            feelsLike: response.data.currently.apparentTemperature,
            humidity: response.data.currently.humidity,
            summary: response.data.currently.summary,
            windSpeed: response.data.currently.windSpeed,
            windGusts: response.data.currently.windGust,
            precipType: response.data.currently.precipType,
            precipProb: response.data.currently.precipProbability,
            precipIntens: response.data.currently.precipIntensity,
            cloudCover: response.data.currently.cloudCover,
            visibility: response.data.currently.visibility,
            uvIndex: response.data.currently.uvIndex,
            icon: response.data.currently.icon
        }

        // Check for weather alerts because they're not always included
        if (response.data.alerts && response.data.alerts.length > 0) {
            weather.alert = response.data.alerts[0].title;
            weather.alertDescription = response.data.alerts[0].description;
            weather.alertUri = response.data.alerts[0].uri;
        }

        // Precipitation type isn't capitalized and it bothers me.
        weather.precipType = weather.precipType.charAt(0).toUpperCase() + 
                             weather.precipType.slice(1);

        if (weather.summary == "Windy")
            weather.summary = "Wimdy";
    
        return getWeatherResponse(source, weather);
    }
    catch(error) {
        console.error(error);
        return 'There was a problem getting the weather';
    }
}

function getWeatherResponse(source, weather) {
    switch(source) {
        case 'discord':
            return formatWeatherforDiscord(weather);
        case 'irc':
            return formatWeatherforIrc(weather);
        case 'forum':
            return formatWeatherforForum(weather);
        default:
            return "Couldn't format weather response.";
    }
}

function formatWeatherforDiscord(weather) {
    const icons = {
        ["clear-day"]: emoji.get('sunny'),
        ["clear-night"]: emoji.get('crescent_moon'),
        ["rain"]: emoji.get('cloud_with_rain'),
        ["snow"]: emoji.get('cloud_with_snow'),
        ["sleet"]: emoji.get('cloud_with_rain'),
        ["wind"]: emoji.get('wind_blowing_face'),
        ["fog"]: emoji.get('fog'),
        ["cloudy"]: emoji.get('white_sun_cloud'),
        ["partly-cloudy-day"]: emoji.get('partly_sunny'),
        ["partly-cloudy-night"]: emoji.get('cloud')
    }

    let wind = `**Wind speed**: ${Math.round(weather.windSpeed)} MPH`;
    if (weather.windGusts > 0) {
        wind += ` (Gusts: ${Math.round(weather.windGusts)} MPH)`;
    }

    let precipitation = `**Precipitation chance**: ${weather.precipProb * 100}%`;
    if (weather.precipIntens > 0) {
        precipitation = `**Precipitation**: ${weather.precipType} ` +
                        `(${weather.precipIntens} inches per hour)`;
    }

    let alerts = '';
    if (weather.alert) {
        alerts += `\n**Alerts**: ${weather.alert}\n${weather.alertUri}`;
    }

    return `${weather.location} - ${weather.summary} ${icons[weather.icon]}\n` +
           `**Current temp**: ${Math.round(weather.temperature)}°F ` +
           `(Feels like: ${Math.round(weather.feelsLike)}°F)\n` +
           `**Humidity**: ${Math.round(weather.humidity * 100)}%\n` +
           `${wind}\n` +
           `${precipitation}\n` +
           `**Cloud cover**: ${Math.round(weather.cloudCover * 100)}%\n` +
           `**Visibility**: ${weather.visibility} miles\n` +
           `**UV index**: ${weather.uvIndex}` +
           `${alerts}`;
}

function formatWeatherforIrc(weather) {}

function formatWeatherforForum(weather) {}

module.exports.cmd = {
    name: 'weather'
};
