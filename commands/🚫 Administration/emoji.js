const discord = require('discord.js')
const fetch = require("node-fetch")
const { MessageActionRow, MessageButton, MessageEmbed, Collection, Permissions } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "emoji",
  category: "🚫 Administration",
  aliases: ["search_emoji", "emoji_search", "emojisearch"],
  cooldown: 2,
  usage: "search_emoji",
  description: "Search emoji and Upload",
  type: "server",
	memberpermissions: ["MANAGE_EMOJIS"],
  run: async (client, message, args, cmduser, text, prefix) => {

		
    let mTag = message.author.tag;
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.emoji")
      var cmdrole = [];
      let emojis = await fetch("https://emoji.gg/api/").then(res => res.json());
     const q = args.join(" ").toLowerCase().trim().split(" ").join("_");
     let matches = emojis.filter(s => s.title == q || s.title.includes(q));
     
     let noResult = new discord.MessageEmbed()
        .setDescription(`:x: |No Results found for ${args.join(" ")}!`)
        .setColor("FF2052")
     
     if (!matches.length) return message.reply({embeds:[noResult]})
     let page = 0;
     let embed = new discord.MessageEmbed()
     .setTitle(matches[page].title)
     .setURL("https://discordemoji.com/emoji/" + matches[page].slug)
     .setColor("00FFFF")
     .setImage(matches[page].image)
     .setFooter(`Emoji ${page + 1}/${matches.length}`);
     let row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('previous')
					.setLabel('Previous')
					.setEmoji('◀️')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('next')
					.setLabel('Next')
					.setEmoji('▶️')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('add')
					.setLabel('Add')
					.setEmoji('✅')
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('cancel')
					.setLabel('Cancel')
					.setEmoji('❌')
					.setStyle('DANGER'),
			);
     const msg = await message.reply({embeds:[embed],components: [row]});
     //emojis = ["◀️", "▶️", "✅", "❌"]
     const filter = (button) => button.user.id === message.author.id && button.message.id === msg.id && button.isButton();
 
     let collector = msg.createMessageComponentCollector({time: 120000,filter: filter})
     collector.on('collect', async (b) => {
		switch(b.customId) {
			case "previous":
			page--;
		if(!matches[page]) {
          page++;
        } else {
        	let newembed = new discord.MessageEmbed()
     .setTitle(matches[page].title)
     .setURL("https://discordemoji.com/emoji/" + matches[page].slug)
     .setColor("00FFFF")
     .setImage(matches[page].image)
     .setFooter(`Emoji ${page + 1}/${matches.length}`);
     msg.edit({embeds:[newembed],components: [row]});
           }
           break;
         case "next":
           page++;
     if(!matches[page]) page--;
     else msg.edit({embeds:[new discord.MessageEmbed()
     .setTitle(matches[page].title)
     .setURL("https://discordemoji.com/emoji/" + matches[page].slug)
     .setColor("00FFFF")
     .setImage(matches[page].image)
     .setFooter(`Emoji ${page + 1}/${matches.length}`)],components:[row]})
           break;
         case "add":
           collector.stop()
           const res = matches[page];
        let created;
        message.channel.sendTyping()
        try { 
        created = await message.guild.emojis.create(res.image, res.title);
        //message.channel.stopTyping();
        message.channel.send(`Successfully added ${created}!`);
       } catch(error) {
      console.log(error) //message.channel.stopTyping();
      message.channel.send(`Unable to add ${res.title}.`);
       }
           break;
         case "cancel":
           collector.stop()
           b.reply("Cancelled Command.")
           break;
     }
     });
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
