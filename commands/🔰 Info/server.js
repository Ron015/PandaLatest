const { MessageEmbed } = require("discord.js");
const discord = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
const util = require('minecraft-server-util');
const https = require('https');
module.exports = {
  name: "server",
  category: "🔰 Info",
  usage: "server",
  type: "Minecraft",
  description: "get information about a minecraft server",
  run: async (client, message, args, cmduser, text, prefix) => {

        const options = {
            hostname: 'api.mcsrvstat.us',
            port: 443,
            path: '/2/' + args[0],
            method: 'GET'
        }
        const request = https.request(options, response => {
            let str = '';
            response.on('data', data => {
                str += data;
            });
            response.on('end', () => {
                resp = JSON.parse(str);
                if(!resp.hostname) {
                    message.channel.send('Couldn\'t find any server with ip ' + args[0]);
                    return;
                }
                let offembed = new discord.MessageEmbed()
                .setAuthor('Minecraft Info', 'https://media.discordapp.net/attachments/873381531769528353/935473587605897256/SmartSelect_20220125-152754_Google_Play_Store.jpg')
                .setTitle(args[0])
                .setThumbnail('https://api.mcsrvstat.us/icon/' + args[0])
                .addField('Status', 'Offline ⚫', true)
                .setImage('https://api.mcsrvstat.us/icon/' + args[0])
                .setFooter('Bot_Music \nData is updated every 5 minutes')
                
                let onembed = new discord.MessageEmbed()
                .setAuthor('Minecraft Info', 'https://media.discordapp.net/attachments/873381531769528353/935473587605897256/SmartSelect_20220125-152754_Google_Play_Store.jpg')
                .setTitle(args[0])
                .setThumbnail('https://api.mcsrvstat.us/icon/' + args[0])
                .addFields(
		{ name: 'Status', value: 'Online :green_circle: ' },
		{ name: 'Motd', value: (resp.motd) ? resp.motd.clean.join('\n') : 'None' },
		{ name: 'Online Players', value: resp.players.online + '/' + resp.players.max },
		{ name: 'Version', value: (Array.isArray(resp.version)) ? resp.version[0] : resp.version },
		{ name: 'Plugins', value: (resp.plugins) ? resp.plugins.names.join(', ') : 'None' },
		{ name: 'Mods', value: (resp.mods) ? resp.mods.names.join(', ') : 'None' },
	)
                .setImage('https://api.mcsrvstat.us/icon/' + args[0])
                .setFooter('Bot_Music \nData is updated every 5 minutes')
                //create answer message with default offline data
                //fill with data if it's online
                if(resp.online) { message.channel.send({ embeds: [onembed] })}
                if(!resp.online) { message.channel.send({ embeds: [offembed] })}
                //send answer
                });
        });
        //error handling
        request.on('error', err => {
            console.log(err);
            message.channel.send('There was an error trying to get the server\'s information');
        })
        //close request
        request.end()
    }
}