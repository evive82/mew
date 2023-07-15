const responses = require('./8ball.json');

module.exports.run = (_source, question) => {
    if (question === '')
        return 'Are you trying to ask me something?';

    return responses.eightBall[Math.floor(Math.random() * 42)];
}

module.exports.cmd = {
    name: '8ball'
};