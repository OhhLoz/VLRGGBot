const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Lists all bot commands"),
	async execute(interaction, client, botData)
    {
        var embed = new MessageEmbed()
        .setTitle("Help")
        .setColor(0xff8d00)
        .setTimestamp()
        .setFooter({text: "Sent by VLRGG", iconURL: client.user.displayAvatarURL()})
        .addField('\u200b', `${botData.titleSpacer}**Bot Commands**`)
        .addField("/help", "Lists all current commands", false)
        .addField("/ping", "Displays the current ping to the bot & the API", false)
        .addField("/stats", "Displays bot statistics, invite link and contact information", false)

        interaction.editReply
        ({
            embeds: [embed],
            ephemeral: true
        })
	}
}