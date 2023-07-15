const responses = require('./insult.json');

module.exports.run = (_source, name) => {
    if (name === '')
        return 'Try ".insult name"';

    name = name.trim();
    const adjective = responses.adj[Math.floor(Math.random() * 18)];
    const word1 = responses.word1[Math.floor(Math.random() * 13)];
    const word2 = responses.word2[Math.floor(Math.random() * 20)];

    return `${name}, you're a ${adjective}${word1}${word2}`;
}

module.exports.cmd = {
    name: 'insult'
};