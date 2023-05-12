const got = require('got')
const axios = require('axios');
const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

const fetch = require("node-fetch");
var CronJob = require('cron').CronJob;
const subreddits = [
  "memes",
	"funny",
	"dankmemes",
  "meme"
];
const path = require("path");
//starting the module
module.exports = client => {
    //Loop through every setupped guild every single minute (30 second delay) and call the automeme command
    client.Jobautomeme = new CronJob('30 * * * * *', function() {
        //get all guilds which are setupped
        var guilds = client.settings.filter(v => v.automeme && v.automeme != "no").keyArray();
        //Loop through all guilds and send a random auto-generated-nsfw setup
        for(const guildid of guilds){
            automeme(guildid)
        }
    }, null, true, 'America/Los_Angeles');
    
    client.Jobautomeme.start();

    //function for sending automatic nsfw
    async function automeme(guildid){
        try{
            //get the Guild
            var guild = client.guilds.cache.get(guildid)
            //if no guild, return
            if(!guild) return;
            //define a variable for the channel
            var channel;
            //define the embed settings
            let es = client.settings.get(guild.id, "embed");
            //get the settings 
            let set = client.settings.get(guild.id, "automeme");
            //If no settings found, or defined on "no" return
            if(!set || set == "no") return
            //try to fetch the channel if no channel found throw error and return
            try{
                channel = await client.channels.fetch(set).catch(() => {})
                if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) throw "Channel not found"
            }catch (e){
                return;
            }
      const embed = new MessageEmbed()
    got(`https://www.reddit.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/random/.json`).then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;
        embed.setTitle(`${memeTitle}`)
        embed.setURL(`${memeUrl}`)
        embed.setImage(`${memeImage}`)
        embed.setColor('RANDOM')
        embed.setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`)
        channel.send({embeds: [embed]});
      }) 
        }catch{

        }
    }


}