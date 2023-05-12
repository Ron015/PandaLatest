const { getRandomNum } = require(`${process.cwd()}/handlers/functions`)
module.exports = client => {
	client.on("messageCreate", async message => {
		try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            client.settings.ensure(message.guild.id, {
                nqn: false,
            });
		let nqn = client.settings.get(message.guild.id, "nqn")
		if(!nqn) return;
try{
	let msg = message.content;

  let emojis = msg.match(/(?<=:)([^:\s]+)(?=:)/g)
  if (!emojis) return;
  emojis.forEach(m => {
    let emoji = message.guild.emojis.cache.find(x => x.name === m)
    if (!emoji) return;
    let temp = emoji.toString()
    if (new RegExp(temp, "g").test(msg)) msg = msg.replace(new RegExp(temp, "g"), emoji.toString())
    else msg = msg.replace(new RegExp(":" + m + ":", "g"), emoji.toString());
  })

  if (msg === message.content) return;

  let webhook = await message.channel.fetchWebhooks();
  let number = getRandomNum(1, 2);
  webhook = webhook.find(x => x.name === "PANDA" + number);

  if (!webhook) {
    webhook = await message.channel.createWebhook(`PANDA` + number, {
      avatar: client.user.displayAvatarURL({ dynamic: true })
    });
  }

  await webhook.edit({
    name: message.member.nickname ? message.member.nickname : message.author.username,
    avatar: message.author.displayAvatarURL({ dynamic: true })
  })

  message.delete().catch(err => { })
  webhook.send(msg).catch(err => { })

  await webhook.edit({
    name: `PANDA` + number,
    avatar: client.user.displayAvatarURL({ dynamic: true })
  })
	} catch (e) {
                console.log(String(e.stack).grey.bgRed)
            }
        }catch{}
    })

}