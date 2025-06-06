var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-autonsfw",
  category: "💪 Setup",
  aliases: ["setupautonsfw", "cmdlog", "autonsfw-setup", "autonsfwsetup"],
  cooldown: 5,
  usage: "setup-autonsfw  -->  Follow the Steps",
  description: "This Setup allows you to send logs into a specific Channel, when someone enters a the Command: report",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      

      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Enable Auto-Nsfw",
            description: `Define the Auto-Nsfw Channel`,
            emoji: "✅"
          },
          {
            value: "Disable Auto-Nsfw",
            description: `Disable the Admin Auto-Nsfw`,
            emoji: "❌"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Auto-Nsfw`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Auto-Nsfw-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Automated Nsfw System!') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
              value: option.value.substring(0, 50),
              description: option.description.substring(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor('Auto NSFW Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/no-one-under-eighteen_1f51e.png', 'https://dsc.gg/bot-support.invite')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            used1 = true;
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({content: `<a:no:921989165242003476> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes2:921988805442043925> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype){
          case "Enable Auto-Nsfw": { 
            let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable6"])).setFooter(client.getFooter(es))]
            })
            var thecmd;
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply( "NO MESSAGE SENT");
                let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if(channel){
                  if(!channel.nsfw || channel.nsfw == undefined){
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable7"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))]}
                    );
                  }
                  client.settings.set(message.guild.id, channel.id, `autonsfw`)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable8"]))
                    .setColor(es.color)
                    .setDescription(`Posting now, every Minute`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]}
                  );
                }
                else{
                  return message.reply( "NO CHANNEL PINGED");
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Disable Auto-Nsfw": { 
            client.settings.set(message.guild.id, "no", `autonsfw`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable10"]))
              .setColor(es.color)
              .setDescription(`I will not send automatic NSFW Images to a Channel anymore`.substring(0, 2048))
              .setFooter(client.getFooter(es))]}
            );
          }break;
          case "Show Settings": { 
            let thesettings = client.settings.get(message.guild.id, `autonsfw`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable11"]))
              .setColor(es.color)
              .setDescription(`**Channel:** ${thesettings == "no" ? "Not Setupped" : `<#${thesettings}> | \`${thesettings}\``}\n\n**Cooldown:** 1 Minute`.substring(0, 2048))
              .setFooter(client.getFooter(es))]}
            );
          }break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable13"]))]}
      );
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