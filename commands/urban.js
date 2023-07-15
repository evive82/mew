const axios = require('axios');

module.exports.run = async (_source, query) => {
    if (query === '')
        return 'Try ".urban some phrase"';

    try {
        /**
         * Will automatically grab first result, but another can
         * be specified by prepending an index to the query.
         */ 
        let index = 0;
        if (!isNaN(query[0])) {
            index = parseInt(query.split(' ')[0]) - 1;
            query = query.replace(query.split(' ')[0], '').trim();
        }
        
        const url = `https://api.urbandictionary.com/v0/define?term=${query}`;
        const response = await axios.get(url);
        if (!response.status ===200) {
            throw `Error: ${response.status} - ${response.statusText}`;
        }
        else if (response.status === 200 && response.data.list.length > index) {
            const word = response.data.list[index].word;
            const def = response.data.list[index].definition.replace(/\[/g, '')
                                                            .replace(/\]/g, '');
            return `${word}: ${def}`;
        }
        else {
            return `No results for ${query}`;
        }
    }
    catch(error) {
        console.error(error);
        return 'There was an error accessing Urban Dictionary';
    }
}

module.exports.cmd = {
    name: 'urban'
};