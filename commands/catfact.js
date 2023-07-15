const axios = require('axios');

module.exports.run = async (_source, _args) => {
    try {
        const cats = 'https://catfact.ninja/fact';
        const response = await axios(cats);

        if (!response.data.fact)
            throw "response.data.fact doesn't exist";

        return response.data.fact;
    }
    catch(error) {
        console.error(error);
        return "Couldn't retrieve a cat fact."
    }
}

module.exports.cmd = {
    name: 'catfact'
};