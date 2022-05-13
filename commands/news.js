const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const VLRGG = require("../vlrggAPIWrapper.js");

module.exports =
{
	data: new SlashCommandBuilder()
		.setName("news")
		.setDescription("Shows news"),
	async execute(interaction, client, botData)
    {
        var segments = await VLRGG.getNews();

        var embed = new MessageEmbed()
        .setTitle("News")
        .setColor(0xff8d00)
        .setTimestamp()
        .setURL(botData.vlrGGURL)
        .setFooter({text: "Sent by VLRGG", iconURL: client.user.displayAvatarURL()})
        .addFields
        (
            {name: "Title", value: `[${segments[0].title}](${botData.vlrGGURL + segments[0].url_path})`},
            {name: "Description", value: segments[0].description},
            {name: "Date", value: segments[0].date}
        )

        interaction.editReply
        ({
            embeds: [embed],
            ephemeral: false
        })
	}
}