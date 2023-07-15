const axios = require('axios');
const getLocationData = require('../utils/location_lookup');

module.exports.run = async (_source, query) => {
    if (query === '')
        return 'Try ".airquality some place (or zip code)"';

    const locationData = await getLocationData(query);
    if (!locationData)
        return 'There was a problem getting location data.';

    try {
        const url = `http://api.openweathermap.org/data/2.5/air_pollution?` +
                    `lat=${ locationData.latitude }&` +
                    `lon=${ locationData.longitude }&` +
                    `appid=${ process.env.OPEN_WEATHER_KEY }`;

        const response = await axios.get(url);

        const levels = [
            "Good",
            "Fair",
            "Moderate",
            "Poor",
            "Very Poor"
        ]

        const index = response.data.list[0].main.aqi;

        return `Air quality for ${locationData.formattedAddr}: ${levels[index-1]}`;
        
    }
    catch(error) {
        console.error(error);
        return 'There was a problem getting air quality';
    }
}

module.exports.cmd = {
    name: 'airquality'
};