const Discord = require('discord.js');
const fs = require("fs");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
var titleSpacer = "\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800";
var vlrGGURL = "https://www.vlr.gg";

const TESTING = true;

const package = require("./package.json");
const testConfig = require('./config.json');

if(TESTING)
  process.env.BOT_TOKEN = testConfig.testToken;
else
  process.env.BOT_TOKEN = testConfig.token;

var botData =
{
  version: package.version,
  titleSpacer: titleSpacer,
  vlrGGURL: vlrGGURL
}

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const commandsArr = [];

client.commands = new Discord.Collection();

for (const file of commandFiles)
{
	const command = require(`./commands/${file}`);
	commandsArr.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

console.log(`Loaded ${commandsArr.length} commands`);

client.on("ready", () =>
{
  const guild = client.guilds.cache.get(testConfig.testguildID); //development server guildid

  if(TESTING)
    guild.commands.set(commandsArr);
  else
    client.application.commands.set(commandsArr);

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

  const command = client.commands.get(interaction.commandName);

  if (!command)
    return;

  try
  {
    await command.execute(interaction, client, botData);
  }
  catch(err)
  {
    if (err)
      console.log(err);

    var embed = new Discord.MessageEmbed()
    .setTitle("Error Occurred")
    .setColor(0x00AE86)
    .setTimestamp()
    .setFooter({text: "Sent by VLRGG", iconURL: client.user.displayAvatarURL()})
    .setDescription(`An error occurred whilst executing command. Please try again or visit [vlr.gg](${vlrGGURL})`);
    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.BOT_TOKEN);