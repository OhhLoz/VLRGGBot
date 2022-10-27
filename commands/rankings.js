const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const VLRGG = require("../vlrggAPIWrapper.js");
const func = require("../functions.js");
const regionDict = require("../regions.json");

module.exports =
{
	data: new SlashCommandBuilder()
		.setName("rankings")
		.setDescription("Lists rankings of a given region")
        .addStringOption(option => option.setName('region').setDescription('Region to display statistics for').setRequired(true)),
	async execute(interaction, client, botData)
    {
        var regionName = interaction.options.getString('region');
        var reverseRegionDict = func.reverseMapFromMap(regionDict);

        if(reverseRegionDict.hasOwnProperty(regionName) || regionDict.hasOwnProperty(regionName))
        {
            var rankingResults = await VLRGG.getRankings(regionName);
            var currIndex = 0;
            var embed = func.handleRankingsPages(rankingResults, currIndex);
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
                            if (currIndex - 10 >= 0)
                            currIndex-=10;
                            interaction.editReply({embeds: [func.handleRankingsPages(rankingResults, currIndex)]});
                            break;
                        }
                        case botData.reactionControls.NEXT_PAGE:
                        {
                            if (currIndex + 10 <= rankingResults.length - 1)
                            currIndex+=10;
                            interaction.editReply({embeds: [func.handleRankingsPages(rankingResults, currIndex)]});
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
        else
        {
            var embed = new MessageEmbed()
            .setTitle("Invalid Region")
            .setColor(0x00AE86)
            .setURL(`${botData.vlrggURL}`)
            .setTimestamp()
            .setFooter({text: "Sent by VLRGG", iconURL: client.user.displayAvatarURL()})
            .setDescription(`You entered an invalid region or an error occurred. Please try again or visit [vlr.gg](${botData.vlrggURL})`);
            interaction.editReply({ embeds: [embed] });
        }
        interaction.editReply
        ({
            embeds: [embed]
        })
    }
}