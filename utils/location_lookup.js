const axios = require('axios');

module.exports = async (query) => {
    try {
        const key = process.env.BING_MAPS_KEY;
        const url = `http://dev.virtualearth.net/REST/v1/Locations?` +
                    `query=${query}` +
                    `&maxResults=1` +
                    `&key=${key}`;

        const response = await axios.get(url);
        const result = response.data.resourceSets[0].resources[0];
        if (response.status !== 200 || !result) return false;
    
        const locationData = {
            formattedAddr: result.address.formattedAddress,
            city: result.address.locality,
            state: result.address.adminDistrict,
            county: result.address.adminDistrict2,
            country: result.address.countryRegion,
            latitude: result.point.coordinates[0],
            longitude: result.point.coordinates[1]
        }
    
        // formattedAddr will show zip code instead of city if used as query
        if (/^\d+$/.test(locationData.formattedAddr.split(',')[0])) {
            let city = (locationData.city) ? locationData.city : locationData.county;
            let state = (locationData.state) ? locationData.state : locationData.country;
            locationData.formattedAddr = `${city}, ${state}`;
        }
        
        return locationData;
    }
    catch(error) {
        console.error(error);
        return false;
    }
}
