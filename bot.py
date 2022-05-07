import discord
import json

client = discord.Client(intents = discord.Intents.default())

f = open ('config.json')
config = json.load(f)

BOT_TOKEN = config['token']
TEST_GUILD_ID = config['testguildID']
COMMAND_PREFIX = config['prefix']
TOPGG_TOKEN = config['topggAPItoken']

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))
    await client.change_presence(activity=discord.Activity(type=discord.ActivityType.listening, name=".hello"))

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith(COMMAND_PREFIX + 'hello'):
        await message.channel.send('Hello!')

client.run(BOT_TOKEN)