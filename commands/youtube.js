const YouTube = require('simple-youtube-api');

module.exports.run = async (source, query) => {
    if (query === '')
        return 'Try ".youtube something"';
    
    try {
        const youtube = new YouTube(process.env.YOUTUBE_KEY);
        const results = await youtube.searchVideos(query, 4);

        const channel = results[0].channel.title;
        const title = results[0].title;
        const link = 'https://youtu.be/' + results[0].id;
        const description = results[0].description;

        switch(source) {
            case 'irc':
                return `${link} ${title} / ${description} - ${channel}`;
            case 'discord':
                return link;
            case 'forum':
                return `[MEDIA=youtube]${results[0].id}[/MEDIA]`;           
        }
    }
    catch (error) {
        console.error(error);
        return 'There was a problem with finding a video';
    }

}

module.exports.cmd = {
    name: 'youtube'
};