﻿const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "trash",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "trash @User",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "FUN")){
          const x = new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.disabled.title)
          .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          return message.reply({embeds: [x], epehemeral: true});
        }
      //send loading message
      var tempmsg = await message.reply({embeds: [new MessageEmbed()
        .setColor(ee.color)
        .setAuthor( 'Getting Image Data..', 'https://cdn.discordapp.com/emojis/925692920781234196.gif')
      ]});
      //find the USER
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        let tmp = await client.users.fetch(args[0]).catch(() => {})
        if(tmp) user = tmp;
        if(!tmp) return message.reply(eval(client.la[ls]["cmds"]["fun"]["trash"]["variable2"]))
      }
      else if(!user && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.username).toLowerCase())
        user = alluser.find(user => user.includes(args[0].toLowerCase()))
        user = message.guild.members.cache.find(me => (me.user.username).toLowerCase() == user).user
        if(!user || user == null || !user.id) return message.reply(eval(client.la[ls]["cmds"]["fun"]["trash"]["variable3"]))
      }
      else {
        user = message.mentions.users.first() || message.author;
      }
      //get avatar of the user
      var avatar = user.displayAvatarURL({ format: "png" });
      //get the memer image
      client.memer.trash(avatar).then(image => {
        //make an attachment
        var attachment = new MessageAttachment(image, "trash.png");
        //delete old message
        tempmsg.delete();
        //send new Message
        message.reply({embeds: [tempmsg.embeds[0]
          .setAuthor(`Meme for: ${user.tag}`, avatar)
          .setColor(es.color)
          .setImage("attachment://trash.png")
        ], files: [attachment]}).catch(() => {})
      })
      
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
