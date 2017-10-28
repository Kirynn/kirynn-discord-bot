const ytdl = require('ytdl-core');

export const Music = {
    
    stream: null,
    dispatcher: null,
    connection: null,
    info: null,
    textChannel: null,
    current: null,
    playlist: [],

    playSong: function(song) {

        this.stream = ytdl(song, {filter: 'audioonly'});
        this.dispatcher = this.connection.playStream(this.stream);
        ytdl.getInfo(song, (err, info) => {
            
            if (err) throw err;
            this.info = info;
            this.textChannel.send(`Now playing: ${info.title}.`);
            this.current = info.title;
        });
    },

    'play': function (args) {

        console.log(args);
        this.textChannel = args[1].channel;

        //Args[0] = url

        if (args[0] === undefined) {

            return `Please use a valid URL`;
        }

        if (ytdl.validateURL(args[0])) {

            if (this.dispatcher != null && !this.dispatcher.paused) {

                ytdl.getInfo(args[0], (err, info) => {

                    if (err) throw err;
                    this.playlist.push({0: info.title, 1: args[0]});
                });
            }

            else {

                args[1].member.voiceChannel.join()
                .then((connection) => {

                    this.connection = connection;
                    this.playSong(args[0]);
                    this.dispatcher.on('end', (reason) => {
                        
                        if (reason === 'skip') {
                            
                            let next = this.playlist.shift()[1];
                            if (typeof(next) != 'undefined') this.playSong(next);
                            else this.dispatcher.end();
                        }
                        else {
                            
                            Client.voiceConnections.forEach((connection) => {
            
                                connection.disconnect();
                                this.stream = null;
                                this.dispatcher = null;
                                this,connection = null;
                                this.info = null;
                                this.textChannel = null;
                                this.current = null,
                                this.playlist = [];
                            });
                        }
                    });
                    return `Added ${args[0]} to the playlist`;
                })
                .catch(console.error);
            }
        }

        else {

            return `Could not find a video with ${args[0]}`;
        }
    },

    'skip': function() {

        this.dispatcher.end('skip');
    },

    'pause': function() {

        this.dispatcher.pause();
    },

    'resume': function() {

        this.dispatcher.resume();
    },

    'tracklist': function() {

        let list= '';
        this.playlist.forEach((song, index) => {
            console.log(index, song)
            if (index == undefined) index = 0;
            list += `${index + 1}: ${song[0]}\n`;
        });
        return `Playlist:\n ${list} \n\n Currently Playing: ${this.current}`;
    },

    'stop': function() {

        Client.voiceConnections.forEach((connection) => {
            
            console.log(connection);
            connection.disconnect();
        });
    }
}