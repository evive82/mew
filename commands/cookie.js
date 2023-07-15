const responses = require('./cookie.json');

module.exports.run = (source, name) => {
    if (name === '')
        return 'Try ".cookie name"';

    const action = responses.actions[Math.floor(Math.random() * 4)];
    const descript = responses.descripts[Math.floor(Math.random() * 6)];
    const size = responses.sizes[Math.floor(Math.random() * 5)];
    const cookie = responses.cookies[Math.floor(Math.random() * 17)];
    const side = responses.sides[Math.floor(Math.random() * 3)];
    const cookieText = `${action}${name.trim()} a ${descript}${size}${cookie}` +
                        `and serves it with a ${side}`;

    return (source === 'irc') ? `/me ${cookieText}` : `*${cookieText}*`;
}

module.exports.cmd = {
    name: 'cookie'
};