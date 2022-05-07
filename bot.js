const Discord = require('discord.js');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
var titleSpacer = "\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800";

const package = require("./package.json");
const testConfig = require('./config.json');
process.env.BOT_TOKEN = testConfig.testToken;

client.on("ready", () =>
{
  const guild = client.guilds.cache.get(testConfig.testguildID); //development server guildid
  let commands;

  if(guild)
    commands = guild.commands;
  else
    commands = client.application.commands;

  commands?.create({
  name: 'ping',
  description: 'Lists bots current ping',
  })

  console.log(`VLRGGBot launched, version ${package.version}`);
  client.user.setActivity(`/help`, { type: 'WATCHING' });
});

client.on("guildCreate", guild =>
{
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild =>
{
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id}). This guild had ${guild.memberCount} members!`);
});

client.on("interactionCreate", async (interaction) =>
{
  if (!interaction.isCommand())
    return;

  const {commandName, options} = interaction;


  if (commandName === 'help')
  {
    var embed = new Discord.MessageEmbed()
    .setTitle("Help")
    .setColor(0xff8d00)
    .setTimestamp()
    .setFooter({text: "Sent by VLRGG", iconURL: client.user.displayAvatarURL()})
    .addField('\u200b', `**Bot Commands**`)
    .addField("/help", "Lists all current commands", false)
    .addField("/ping", "Displays the current ping to the bot & the API", false)

    interaction.reply
    ({
      embeds: [embed],
      ephemeral: true
    })
  }

  if (commandName === 'ping')
  {
    try
    {
      const message = await interaction.reply({ content: "Pong!", fetchReply: true, ephemeral: true });

      await interaction.editReply(
      {
        content: `Bot Latency: \`${message.createdTimestamp - interaction.createdTimestamp}ms\`, Websocket Latency: \`${client.ws.ping}ms\``,
        ephemeral: true
      });
    }
    catch (err)
    {
      console.log("Exception caught at /ping => ", err);
    }
  }
});

client.login(process.env.BOT_TOKEN);