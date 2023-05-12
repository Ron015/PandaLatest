var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, isValidURL, delay
} = require(`${process.cwd()}/handlers/functions`);
const fs = require("fs")
module.exports = {
  name: "reloadbot",
  category: "👑 Owner",
  aliases: ["botreload"],
  cooldown: 5,
  type: "info",
  usage: "reloadbot",
  description: "Reloads the Bot, All Commands Events, etc.",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if ("820280877048135680" !== message.author.id)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.user.username, es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL())
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["eval"]["variable1"]))
      ]});
    try {
      let clientapp = client.application ? await client.application.fetch().catch(e=>false) : false;
      let guild = client.guilds.cache.get("920944376983740446")
      return message.reply({content : `**<a:no:921989165242003476> THIS COMMAND IS DISABLED, go to discord.gg/milrato and <#840332764603351101> to get it restarted!**\n\n\n> **Path:**
\`\`\`yml
${process.cwd()}
\`\`\`
> **Server:**
\`\`\`yml
${String(Object.values(require(`os`).networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i?.family===`IPv4` && !i?.internal && i?.address || []), [])), [])).split(".")[3]}
\`\`\`
> **Command:**
\`\`\`yml
pm2 list | grep "${String(String(process.cwd()).split("/")[String(process.cwd()).split("/").length - 1]).toLowerCase()}" --ignore-case
\`\`\`
${clientapp ? `
> **Application Information:**
\`\`\`yml
Link: https://discord.com/developers/applications/${client.user.id}
Name: ${clientapp.name} 
${clientapp.owner.discriminator ? "Owner: " + clientapp.owner.tag : "Team: " + clientapp.owner.name + "\n |-> Members: " + clientapp.owner.members.map(uid=>`${uid.user.tag}`).join(", ")  + "\n |-> Team-Owner: " + `${guild.members.cache.get(clientapp.owner.ownerId) && guild.members.cache.get(clientapp.owner.ownerId).user ? guild.members.cache.get(clientapp.owner.ownerId).user.tag : clientapp.owner.ownerId }`} 
Icon: ${clientapp.iconURL()}
Bot-Public: ${clientapp.botPublic ? "✅": "❌"} (Invite able)
\`\`\`
> **About me:**
\`\`\`yml
${clientapp.description ? clientapp.description : "❌ NO DESCRIPTION YET!"}
\`\`\``
      : ""}
      `});
        const index = require("../../index")
        await client.destroy()
      let tempmsg = await message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.color).setFooter(client.getFooter(es))
        .setAuthor(`Reloading ...`, `https://cdn.discordapp.com/emojis/925692920781234196.gif`,  `https://dsc.gg/bot-support.invite`)
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable4"]))
      ]})
      //clear the commands collection
      await client.commands.clear();
      //Delete all files from the cache
      await fs.readdirSync("./commands/").forEach((dir) => {
        const commands = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
          try{
            console.log(`SUCCESS :: ../../commands/${dir}/${file}.js`)
            delete require.cache[require.resolve(`../../commands/${dir}/${file}.js`)]
          }catch{ 
          }  
        }
      })
      //WAIT 1 SEC
      await delay(1000);
      //clear all events
      await client.removeAllListeners()
      //wait 1 Sec
      await delay(1000);
      //REMOVE ALL BASICS HANDLERS
      await client.basicshandlers.forEach(handler => {
        try{ delete require.cache[require.resolve(`../../handlers/${handler}`)]; console.log(`SUCCESS :: ../../handlers/${handler}`); }catch (e){ console.log(e.stack ? String(e.stack).dim : String(e).dim) }
      });
      //REMOVE ALL SOCIAL HANDLERS
      await client.socialhandlers.forEach(handler=>{
        try{ delete require.cache[require.resolve(`../../social_log/${handler}`)]; console.log(`SUCCESS :: ../../social_log/${handler}`); }catch (e){ console.log(e.stack ? String(e.stack).dim : String(e).dim) }
      })
      //REMOVE ALL OTHER HANDLERS
      await client.allhandlers.forEach(handler => {
        try{ delete require.cache[require.resolve(`../../handlers/${handler}`)]; console.log(`SUCCESS :: ../../handlers/${handler}`); }catch (e){ console.log(e.stack ? String(e.stack).dim : String(e).dim) }
      });
      client.Joblivelog.stop()
      client.Joblivelog2.stop()
      client.Jobyoutube.stop()
      client.Jobtwitterfeed.stop()
      client.Jobtiktok.stop()
      client.Jobautonsfw.stop()
      client.Jobroster.stop()
      client.Jobroster2.stop()
      client.Jobroster3.stop()
      client.Jobmembercount.stop()
      client.JobJointocreate.stop()
      client.JobJointocreate2.stop()
      client.Jobdailyfact.stop()
      client.Jobmute.stop()
      //wait 1 Sec
      await delay(1000);
      //Load the basics, (commands, dbs, events, etc.)
      await index.requirehandlers();
      //LOAD THE SOCIAL LOGS
      await index.requiresociallogs();
      //LOAD ALL OTHER HANDLERS
      await index.requireallhandlers();
      //SEND SUCCESS
      await delay(3000);
      await tempmsg.edit({embeds: [new MessageEmbed()
        .setColor(es.color).setFooter(client.getFooter(es))
        .setAuthor(`Successfully Reloaded:`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?v=1`, `https://dsc.gg/bot-support.invite`)
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable6"]))
      ]})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable7"]))
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */