const config = {
    prefixes: ['>'] as string[],
}

const regex = {
    url: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
    youtubeVideo: /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    youtubePlaylist: /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/
}

export default { config, regex }