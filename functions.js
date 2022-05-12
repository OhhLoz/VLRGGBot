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

let getTime = (milli) => {
    let time = new Date(milli);
    let hours = time.getUTCHours();
    let minutes = time.getUTCMinutes();
    let seconds = time.getUTCSeconds();
    let milliseconds = time.getUTCMilliseconds();
    return hours + "H " + minutes + "M " + seconds + "S";
  }

module.exports = {checkStats, getTime}