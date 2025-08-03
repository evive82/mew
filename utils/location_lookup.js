const axios = require('axios');

module.exports = async (query) => {
    try {
        const key = process.env.AZURE_MAPS_KEY;
        const url = `https://atlas.microsoft.com/geocode?api-version=2023-06-01` +
                    `&query=${query}` +
                    `&subscription-key=${key}`;

        const response = await axios.get(url);
        const result = response.data.features[0].properties;
        if (response.status !== 200 || !result) return false;
    
        const adminDistricts = result.address.adminDistricts;
        const locationData = {
            formattedAddr: result.address.formattedAddress,
            city: result.address.locality,
            state: (adminDistricts) ? adminDistricts[0].shortName : null,
            county: (adminDistricts) ? adminDistricts[1].shortName : null,
            country: result.address.countryRegion.name,
            latitude: result.geocodePoints[0].geometry.coordinates[1],
            longitude: result.geocodePoints[0].geometry.coordinates[0]
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
