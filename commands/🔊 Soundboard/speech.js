const Discord = require('discord.js');
const {MessageEmbed} = require('discord.js');
const path = require('path');
const googleTTS = require('google-tts-api');
const discordTTS=require("discord-tts");
const fs = require("fs")
const {AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel} = require('@discordjs/voice');
module.exports = {
	name: `speech`,
	description: `Speech Your Text`,
	category: "🔊 Soundboard",
	aliases: ["tts", "voicesay"],
	cooldown: 5,
	usage: `speech <Your Text>`,
	run: async (client, message, args, cmduser, text, prefix) => {
		const es = client.settings.get(message.guild.id, "embed");
		let voiceConnection;
		let audioPlayer=new AudioPlayer();
		const ls = client.settings.get(message.guild.id, "language")
		if (!client.settings.get(message.guild.id, "SOUNDBOARD")) {return message.reply({embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(client.getFooter(es)).setTitle(client.la[ls].common.disabled.title).setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))]});}
		const { channel } = message.member.voice;
		const botchannel = message.guild.me.voice.channel;
		if (!channel) {return message.reply({embeds: [new MessageEmbed().setTitle('<a:no:921989165242003476> You need to join a voice channel').setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		if(!channel.permissionsFor(message.guild.me).has("CONNECT")){return message.reply({embeds: [new MessageEmbed().setTitle(":x: I'm missing the Permission to join your Voice Channel").setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		if(!channel.permissionsFor(message.guild.me).has("SPEAK")){return message.reply({embeds: [new MessageEmbed().setTitle(":x: I'm missing the Permission to speak in your Voice Channel").setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		if(channel.userLimit != 0 && channel.full){return message.reply({embeds: [new MessageEmbed().setTitle(":x: Your Voice Channel is full!").setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		if (botchannel) {return message.reply({embeds: [new MessageEmbed().setTitle(`<a:no:921989165242003476> I am already connected in: \`${botchannel.name}\``).setFooter(client.getFooter(es))]});}
		if (!args[0])
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["say"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["say"]["variable4"]))
        ]});
		const stext = args.slice(0).join(' ');
    const e = await message.react('🎙️').catch(e => console.log(String(e).grey))
		const stream = googleTTS.getAudioUrl(stext, {
  lang: 'en',
  slow: false,
  host: 'https://translate.google.com',
});
        const audioResource=createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});
		    audioResource.volume.setVolume(0.2);
        if(!voiceConnection || voiceConnection?.status===VoiceConnectionStatus.Disconnected){
            voiceConnection = joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.guildId,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            voiceConnection=await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 1_000);
        }
        
        if(voiceConnection.status===VoiceConnectionStatus.Connected){
            voiceConnection.subscribe(audioPlayer);
            audioPlayer.play(audioResource);
        }
        
		audioPlayer.on("idle", () => {
			try {audioPlayer.stop();} catch (e) {console.log(String(e).grey)}
			try {voiceConnection.destroy();} catch (e) {console.log(String(e).grey)}
			e.remove().catch(e => console.log(String(e).grey))
		});
	}
}