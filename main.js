const Discord = require('discord.js');
const Client = new Discord.Client();
const fs = require('fs');
const config = require('./config.json');

function readMessage(message) {

    let working = message.split(' ');
    let cmd = working[0].substr(1);
    let args = working.splice(1);

    console.log(`Command: !${cmd}, Args: ${args}`);

    return {
        'cmd': cmd,
        'args': args,
    };
}

const Global = {

    message: null,
    cmdStr: '!'
}

import {Music} from './music.js';

const Commands = {

    'ping': function() {
        
        return 'pong';
    },

    'music': function(args) {

        let msg = {
            'cmd': args[0],
            'args': args.splice(1)
        };
        msg.args.push(Global.message);
        console.log(msg.args);

        if (msg.cmd in Music && typeof(Music[msg.cmd]) === 'function') {

            let resp = Music[msg.cmd](msg.args);
            return resp;
        }

        else {

            return `\`!music ${msg.cmd}\` is not a command!`;
        }
    }
}

Client.on('ready', () => {

    console.log('ready');
    Global.cmdStr = config.cmd;
});

Client.on('message', (message) => {
    
    if (message.content.charAt(0) == Global.cmdStr) {

        let msg = readMessage(message.content);

        if (msg.cmd in Commands) {

            Global.message = message;
            let resp = Commands[msg.cmd](msg.args);
            if (resp) message.channel.send(resp);
            Global.message = null;
        }

        else {

            message.channel.send(`\`${msg.cmd}\` is not a command!`);
        }
    }
});

let token = pro

Client.login(process.env.TOKEN);