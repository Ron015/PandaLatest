const Discord = require("discord.js");
const simplydjs = require("simply-djs");
const colors = require("colors");
const enmap = require("enmap"); 
const fs = require("fs");
const Nuggies = require('nuggies');
const OS = require('os');
const Events = require("events");
const ee = require("./botconfig/emojis.json")
const config = require("./botconfig/config.json")
const prefix = config.prefix;
const advertisement = require("./botconfig/advertisement.json")
const { delay } = require("./handlers/functions")

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Panda 2.O On now')
});

app.listen(3000, () => {
  console.log('24/7 web server started!');
});
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  failIfNotExists: false,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
  intents: [ Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activities: [{name: `${config.status.text}`.replace("{prefix}", config.prefix), type: config.status.type, url: config.status.url}],
    status: "online"
  }
});
const discordModals = require('discord-modals'); // Define the discord-modals package!
discordModals(client);



/**********************************************************
 * @param {4} Create_the_client.memer property from Tomato's Api 
 *********************************************************/
const Meme = require("memer-api");
client.memer = new Meme(process.env.memer_api || config.memer_api); // GET a TOKEN HERE: https://discord.gg/Mc2FudJkgP
Nuggies.handleInteractions(client)

/**********************************************************
 * @param {5} create_the_languages_objects to select via CODE
 *********************************************************/
client.la = { }
fs.readdir("./languages", (err, files) => {
  if (err) console.error(err);
  else {
    for(const lang of files.filter(file => file.endsWith(".json"))){
      client.la[`${lang.split(".json").join("")}`] = require(`./languages/${lang}`)
    }
    Object.freeze(client.la)
  }
})
//function "handlemsg(txt, options? = {})" is in /handlers/functions 



/**********************************************************
 * @param {6} Raise_the_Max_Listeners to 0 (default 10)
 *********************************************************/
client.setMaxListeners(0);
Events.defaultMaxListeners = 0;
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;


/**********************************************************
 * @param {7} Define_the_Client_Advertisments from the Config File
 *********************************************************/
client.ad = {
  enabled: advertisement.adenabled,
  statusad: advertisement.statusad,
  spacedot: advertisement.spacedot,
  textad: advertisement.textad
}



/**********************************************************
 * @param {8} LOAD_the_BOT_Functions 
 *********************************************************/
//those are must haves, they load the dbs, events and commands and important other stuff
function requirehandlers(){
  ["extraevents", "clientvariables", "command", "loaddb", "events", "erelahandler", "slashCommands"].forEach(handler => {
    try{ require(`./handlers/${handler}`)(client); }catch (e){ console.log(e.stack ? String(e.stack).grey : String(e).grey) }
  });
  ["twitterfeed", /*"twitterfeed2",*/ "livelog", "youtube", "tiktok"].forEach(handler=>{
    try{ require(`./social_log/${handler}`)(client); }catch (e){ console.log(e.stack ? String(e.stack).grey : String(e).grey) }
  });
  [ "logger", "anti_nuke", "antidiscord", "antilinks","anticaps", "antispam", "blacklist", "keyword", "antimention", "autobackup",
    
    "apply", "ticket", "ticketevent",
    "roster", "joinvc", "epicgamesverification", "boostlog",
    
    "welcome", "leave", "ghost_ping_detector", "antiselfbot",

    "jointocreate", "reactionrole", "ranking", "timedmessages",
    
    "membercount", "autoembed", "nqn", "suggest", "validcode", "dailyfact", "autonsfw",
    "aichat", "mute", "automeme", "counter"].forEach(handler => {
    try{ require(`./handlers/${handler}`)(client); }catch (e){ console.log(e.stack ? String(e.stack).grey : String(e).grey) }
  });
}requirehandlers();


/**********************************************************
 * @param {9} Login_to_the_Bot
 *********************************************************/
client.login(process.env.TOKEN);


client.on("ready", async () => {
  //if the bot is in the SHOPBOT
  if(client.guilds.cache.has("920944376983740446")){
    let guild = client.guilds.cache.get("920944376983740446");
    if(client.guilds.cache.size > 1 && client.guilds.cache.filter(g => g.id != "920944376983740446").filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0) > 25) return console.log("\n\n\nIN ENOUGH GUILDS!\n\n\n");
    
    if(client.guilds.cache.size > 1) {
      let stopchannel = guild.channels.cache.get("930170700625477703") || await guild.channels.fetch("930170700625477703").catch(()=>{}) || false;
      if(!stopchannel) return;
      stopchannel.send({
        content: `**I LEFT ALL GUILDS!** >> STOP ME!\n\n> **Path:**\n\`\`\`yml\n${process.cwd()}\n\`\`\`\n> **Server:**\n\`\`\`yml\n${String(Object.values(require(`os`).networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i?.family===`IPv4` && !i?.internal && i?.address || []), [])), [])).split(".")[3].split(",")[0]}\n\`\`\`\n> **Command:**\n\`\`\`yml\npm2 list | grep "${String(String(process.cwd()).split("/")[String(process.cwd()).split("/").length - 1]).toLowerCase()}" --ignore-case\n\`\`\``,
        embeds: [
          new Discord.MessageEmbed().setColor("ORANGE").setTitle("I'm in enough Guilds, but have LESS MEMBERS!")          
          .setDescription(client.guilds.cache.filter(g => g.id != "920944376983740446").map(g => `\`${g.name} (${g.id})\` : \`${g.memberCount} Members\``).join("\n").substring(0, 2048))
        ]
      }).catch(console.warn)
    } else {
      let stopchannel = guild.channels.cache.get("936086833987731477") || await guild.channels.fetch("936086833987731477").catch(()=>{}) || guild.channels.cache.get("936086833106944020") || await guild.channels.fetch("936086833106944020").catch(()=>{}) || false;
      if(!stopchannel) return;
      stopchannel.send({
        content: `**I LEFT ALL GUILDS!** >> STOP ME!\n\n> **Path:**\n\`\`\`yml\n${process.cwd()}\n\`\`\`\n> **Server:**\n\`\`\`yml\n${String(Object.values(require(`os`).networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i?.family===`IPv4` && !i?.internal && i?.address || []), [])), [])).split(".")[3].split(",")[0]}\n\`\`\`\n> **Command:**\n\`\`\`yml\npm2 list | grep "${String(String(process.cwd()).split("/")[String(process.cwd()).split("/").length - 1]).toLowerCase()}" --ignore-case\n\`\`\``
      }).catch(console.warn)
    }
  }
})
client.on("message", async message => {
 if(message.author.id != "820280877048135680") return;
		message.react("927747783652438026").catch(() => {})
})
client.on("message", async message => {
 if(message.author.id != "904161064072134686") return;
		message.react("990839073281302558").catch(() => {})
})
client.on("message", async message => {
  if (message.content.startsWith(prefix + "restartbot")) {
	if(message.author.id != "773516895826608139") {
		if(message.author.id != "683183458993832019") {
					if(message.author.id != "820280877048135680")
					return message.reply(`<a:no:921989165242003476> **You Are Not A Bot Owner**`)
	}}
    // send channel a message that you're resetting bot [optional]
    message.channel.send('<a:loding:925692920781234196> Resetting...')
    .then(msg => client.destroy())
    .then(() => client.login(process.env.TOKEN))
		.then(() => message.channel.send("Restarting Successful <a:yes2:921988805442043925>"));
				}
})