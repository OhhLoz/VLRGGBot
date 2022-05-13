const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const VLRGG = require("../vlrggAPIWrapper.js");
const func = require("../functions.js");

module.exports =
{
	data: new SlashCommandBuilder()
		.setName("news")
		.setDescription("Shows news"),
	async execute(interaction, client, botData)
    {
        var segments = await VLRGG.getNews();

        var currIndex = 0;
        var embed = func.handleNewsPages(segments, currIndex);
        var originalMember = interaction.user;
        interaction.editReply({ embeds: [embed], ephemeral: false, components: [botData.interactionRow] });

        const filter = (user) =>
        {
            user.deferUpdate();
            return user.member.id === originalMember.id;
        }
        const collector = interaction.channel.createMessageComponentCollector({filter, componentType: 'BUTTON', time: 60000});

        collector.on('collect', (button) =>
        {
            try
            {
                switch (button.customId)
                {
                    case botData.reactionControls.PREV_PAGE:
                    {
                        if (currIndex - 6 >= 0)
                        currIndex-=6;
                        interaction.editReply({embeds: [func.handleNewsPages(segments, currIndex)]});
                        break;
                    }
                    case botData.reactionControls.NEXT_PAGE:
                    {
                        if (currIndex + 6 <= segments.length - 1)
                        currIndex+=6;
                        interaction.editReply({embeds: [func.handleNewsPages(segments, currIndex)]});
                        break;
                    }
                    case botData.reactionControls.STOP:
                    {
                        // stop listening for reactions
                        collector.stop();
                        break;
                    }
                }
            }
            catch(err)
            {
                if (err)
                    console.log(err);

                var embed = new MessageEmbed()
                .setTitle("Error Occurred")
                .setColor(0x00AE86)
                .setURL(`${botData.vlrggURL}`)
                .setTimestamp()
                .setFooter({text: "Sent by VLRGG", iconURL: client.user.displayAvatarURL()})
                .setDescription(`An error occurred during button interaction. Please try again or visit [vlr.gg](${botData.vlrggURL})`);
                interaction.editReply({ embeds: [embed] });
            }
        });

        collector.on('end', async () => {
            interaction.deleteReply();
        });
	}
}