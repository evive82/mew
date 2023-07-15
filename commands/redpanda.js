const axios = require('axios');

module.exports.run = async (source, _args) => {
    try {
        const panda = 'https://some-random-api.ml/img/red_panda';
        const response = await axios(panda);

        if (!response.data.link)
            throw "response.data.link doesn't exist";

        const pic = response.data.link;
        return (source === 'forum') ? `[IMG]${pic}[/IMG]` : pic;
    }
    catch(error) {
        console.error(error);
        return "Couldn't find any red pandas."
    }
}

module.exports.cmd = {
    name: 'redpanda'
};