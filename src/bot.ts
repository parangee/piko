import {CommandoClient} from 'discord.js-commando'
import config from './config'
import path from 'path'
import {Message} from 'discord.js'
import {MessageEmbed} from 'discord.js'
import LavaLink from "./utils/lavaLink";
import knex from "./utils/knex";

const client = new CommandoClient({
    commandPrefix: config.prefix,
    owner: config.owners,
    presence: {
        status: 'dnd',
        afk: false,
        activity: {
            name: '피코야 도움',
            type: 'LISTENING'
        }
    }
})
client.registry
    .registerTypesIn(path.join(__dirname, 'commandTypes/autoload'))
    .registerGroups([
        ['general', '기본'],
        ['util', '유틸리티'],
        ['moderator', '관리'],
        ['coding', '코딩'],
        ['antispam', '안티스팸'],
        ['music', '음악'],
        ['dev', '개발자용']
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))

client.on('ready', async () => {
    if (!client.shard) {
        console.log('Shard only')
        process.exit(0)
    }
    console.log(`Logged in as ${client.user!!.tag}`)
    new LavaLink(client)
    global.lavaLink = LavaLink.getInstance()
    const guilds = (await knex('guilds')).map(r => r.id)
    for (let [_,guild] of client.guilds.cache) {
        if (!guilds.includes(guild.id)) {
            console.log(`NEW GUILD: ${guild.id}`)
            await knex('guilds').insert({id: guild.id})
        }
    }
    try {
        if (client.shard.ids[0] === client.shard.count-1) {
            const allGuilds = (await client.shard.fetchClientValues('guilds.cache')).reduce((i,o) => [...i,...o]).map((r: {id: string}) => r.id)
            (await knex('guilds')).map((r: {id: string}) => r.id).filter((r: any) => !allGuilds.includes(r)).forEach(async (r: string) => {
                await knex('guilds').delete().where('id', r)
            })
        }
    } catch (e) {
    }
})

client.on('guildCreate', async guild => {
    const guilds = (await knex('guilds')).map(r => r.id)

    if (!guilds.includes(guild.id)) {
        console.log(`NEW GUILD: ${guild.id}`)
        await knex('guilds').insert({id: guild.id})
    }
})

client.on('guildDelete', async guild => {
    const guilds = (await knex('guilds')).map(r => r.id)

    if (guilds.includes(guild.id)) {
        console.log(`DELETE GUILD: ${guild.id}`)
        await knex('guilds').delete().where('id', guild.id)
    }
})

Message.prototype.createEmbed = function (): MessageEmbed {
    const embed = new MessageEmbed()
    embed.setFooter(this.author.tag, this.author.avatarURL() || undefined)
    embed.setTimestamp(new Date())
    embed.setColor('BLUE')
    return embed
}

Array.prototype.chunk = function (size: number): Array<any> {
    const chunked_arr = [];
    for (let i = 0; i < this.length; i++) {
        const last = chunked_arr[chunked_arr.length - 1];
        if (!last || last.length === size) {
            chunked_arr.push([this[i]]);
        } else {
            last.push(this[i]);
        }
    }
    return chunked_arr;
}

Map.prototype.toObject = function() {
    const obj = {}
    for (let [k,v] of this)
        { // @ts-ignore
            obj[k] = v
        }
    return obj
}

declare module 'discord.js' {
    interface Message {
        createEmbed(): MessageEmbed
    }
}

declare global {
    interface Array<T> {
        chunk(size: number) : Array<T>
    }

    interface Map<K,V> {
        toObject(): object
    }

    namespace NodeJS {
        interface Global {
            lavaLink: LavaLink
        }
    }
}

declare module 'discord.js-commando' {
    interface CommandoMessage {
        createEmbed(): MessageEmbed
    }
}


client.login(config.token)
