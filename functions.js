var vlrggURL = "https://www.vlr.gg";
const { MessageEmbed } = require('discord.js')

var checkStats = (guild, botData, isJoin) =>
{
  if (isJoin)
  {
    botData.servercount += 1;
    botData.channelcount += guild.channels.cache.filter(channel => channel.type != 'category').size;
    //usercount += guild.members.cache.filter(member => !member.user.bot).size;
    botData.usercount += guild.memberCount;
    botData.botcount += guild.members.cache.filter(member => member.user.bot).size;
  }
  else
  {
    botData.servercount -= 1;
    botData.channelcount -= guild.channels.cache.filter(channel => channel.type != 'category').size;
    //usercount += guild.members.cache.filter(member => !member.user.bot).size;
    botData.usercount -= guild.memberCount;
    botData.botcount -= guild.members.cache.filter(member => member.user.bot).size;
  }

  return botData;
}

let getTime = (milli) =>
{
  let time = new Date(milli);
  let hours = time.getUTCHours();
  let minutes = time.getUTCMinutes();
  let seconds = time.getUTCSeconds();
  let milliseconds = time.getUTCMilliseconds();
  return hours + "H " + minutes + "M " + seconds + "S";
}

/**
 * Aims to provide page functionality to the published Discord news embeds.
 *
 * startIndex is used to ensure a different startIndex can be provided to move along the pages.
 *
 * @param {Object}   newsArray     Object containing the news to be formatted into pages.
 * @param {int}      startIndex     Which index within the Object to start populating the pages with.
 *
 * @return {Discord.MessageEmbed}      Returns the formatted embed so it can be edited further or sent to the desired channel.
 */
 var handleNewsPages = (newsArray, startIndex) =>
 {
   var pageSize = 6;
   var embed = new MessageEmbed()
       .setColor(0x00AE86)
       .setTimestamp()
       .setTitle("News")
       .setColor(0x00AE86)
       .setTimestamp()
       .setURL(`${vlrggURL}/news`);

   for (var i = startIndex; i < startIndex+pageSize; i++)
     {
       var newsObj = newsArray[i];
       var pages = newsArray.length/pageSize;

       embed.setFooter({text: `Page ${startIndex/pageSize + 1} of ${Math.ceil(pages)}`, iconURL: "https://cdn.discordapp.com/avatars/972314485308158012/9e45a7bccde846187ebcaf341b3b6f93.png?size=4096"});

       if(newsObj == undefined)
         break;

       embed.addFields
       (
         {name:'\u200b', value: newsObj.title == undefined || newsObj.url_path == undefined ? "Not Available" : `[${newsObj.title}](${vlrggURL}${newsObj.url_path})`},
         {name:"Description", value: newsObj.description == undefined ? "Not Available" : `${newsObj.description}`},
         {name:"Date", value: newsObj.date == undefined ? "Not Available" : newsObj.date}
       )

       if(i != startIndex+(pageSize - 1))
         embed.addField('\u200b', '\u200b');
     }
     return embed;
 }

 /**
 * Aims to provide page functionality to the published Discord news embeds.
 *
 * startIndex is used to ensure a different startIndex can be provided to move along the pages.
 *
 * @param {Object}   ranksArray     Object containing the ranks to be formatted into pages.
 * @param {int}      startIndex     Which index within the Object to start populating the pages with.
 *
 * @return {Discord.MessageEmbed}      Returns the formatted embed so it can be edited further or sent to the desired channel.
 */
  var handleRankingsPages = (ranksArray, startIndex) =>
  {
    var pageSize = 10;
    var embed = new MessageEmbed()
        .setColor(0x00AE86)
        .setTimestamp()
        .setTitle("Rankings")
        .setColor(0x00AE86)
        .setTimestamp()
        .setURL(`${vlrggURL}/rankings`);

    for (var i = startIndex; i < startIndex+pageSize; i++)
      {
        var ranksObj = ranksArray[i];
        var pages = ranksArray.length/pageSize;

        embed.setFooter({text: `Page ${startIndex/pageSize + 1} of ${Math.ceil(pages)}`, iconURL: "https://cdn.discordapp.com/avatars/972314485308158012/9e45a7bccde846187ebcaf341b3b6f93.png?size=4096"});

        if(ranksObj == undefined)
          break;

        embed.addFields
        (
          {name:`${ranksObj.rank}. ${ranksObj.team}`, value: `Location: ${ranksObj.country}`}
        )
      }
      return embed;
  }

 var id = function(x) {return x;};

/**
 * Returns a reversed hashmap from an input hashmap.
 *
 * @param {HashMap}   map           input hashmap to be reversed.
 * @param {function}   [f]          optional function parameter.
 *
 * @return {HashMap}                Returns the reversed hashmap.
 */
var reverseMapFromMap = function(map, f) {
  return Object.keys(map).reduce(function(acc, k) {
    acc[map[k]] = (acc[map[k]] || []).concat((f || id)(k))
    return acc
  },{})
}

module.exports = {checkStats, getTime, handleNewsPages, handleRankingsPages, reverseMapFromMap}