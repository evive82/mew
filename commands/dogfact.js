const axios = require('axios');

module.exports.run = async (_source, _args) => {
    try {
        const dogs = 'https://some-random-api.ml/facts/dog';
        const response = await axios(dogs);

        if (!response.data.fact)
            throw "response.data.fact doesn't exist";

        return response.data.fact;
    }
    catch(error) {
        console.error(error);
        return "Couldn't retrieve a dog fact."
    }
}

module.exports.cmd = {
    name: 'dogfact'
};