const {
  MessageEmbed,
  Permissions,
	MessageActionRow,
	MessageButton
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "channelnuke",
  category: "🚫 Administration",
  aliases: ["chnuke", "nukechannel", "nukech"],
  cooldown: 2,
  usage: "channelnuke",
  description: "nuke a Text Channel",
  type: "channel",
	memberpermissions: ["ADMINISTRATOR"],
  run: async (client, message, args, cmduser, text, prefix) => {

		
    let mTag = message.author.tag;
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.channelnuke")
      var cmdrole = [];
      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
      if(channel.isThread())
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`<a:no:921989165242003476> **This Channel is a Thread u can't nuke it!**`)
        ]});
        const confirmation = new MessageEmbed()
.setTitle('Are You sure?')
.setDescription(`Are you sure that you want to nuke \`${channel.name}\`?`)
.setColor(es.color)

const safe = new MessageEmbed()
.setTitle('Channel is safe')
.setDescription(`Ok, so u chose no, now I will not nuke \`${channel.name}\` `)
.setColor('GREEN')
.setTimestamp()
	
const suc = new MessageEmbed()
.setTitle('Channel is Nuked')
.setDescription(`Ok, Successful Nuked \`${channel.name}\` `)
.setColor('GREEN')
.setTimestamp()
const del = new MessageEmbed()
.setTitle(`**__Channel Nuked by:__**  \`${mTag}\` `)
.setImage('https://cdn.discordapp.com/attachments/873381531769528353/993436489696419840/20220704_140912.gif')
.setColor('RED')
.setTimestamp()

//buttons

const row = new MessageActionRow()
.addComponents(
new MessageButton()
.setCustomId('yes')
.setEmoji('921988805442043925')
.setStyle('DANGER')
.setLabel('Yes')
)
.addComponents(
new MessageButton()
.setCustomId('no')
.setEmoji('921989165242003476')
.setStyle('SECONDARY')
.setLabel('No')
)

const disabledRow = new MessageActionRow()
.addComponents(
new MessageButton()
.setCustomId('yep')
.setEmoji('921988805442043925')
.setStyle('DANGER')
.setLabel('Yes')
.setDisabled(true)
)
.addComponents(
new MessageButton()
.setCustomId('nope')
.setEmoji('921989165242003476')
.setStyle('SECONDARY')
.setLabel('No')
.setDisabled(true)
)


const m = await message.reply({embeds: [confirmation], components: [row]})
//Making filter to ensure safety
const filter = i => i.user.id === message.author.id;

//Defining collector
const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 })

//Collecting buttons
collector.on('collect', async i => {
if(i.customId === 'yes') {
	await i.update({embeds: [suc], components: [disabledRow]})
channel.clone().then(channel => channel.send({ embeds: [del]}));
channel.delete();
	}

if(i.customId === 'no') {
await i.update({embeds: [safe], components: [disabledRow]})
}
});
if(client.settings.get(message.guild.id, `adminlog`) != "no"){
        try{
          var ch = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if(!ch) return client.settings.set(message.guild.id, "no", `adminlog`);
          ch.send({embeds :[new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["say"]["variable5"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        }catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
      }
} catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["say"]["variable8"]))
      ]});
    }
  }
}
