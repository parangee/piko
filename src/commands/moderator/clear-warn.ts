import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {GuildMember, Message} from "discord.js";
import knex from "../../utils/knex";

export default class RemoveWarn extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '경고초기화',
            group: 'moderator',
            memberName: 'clear-warn',
            description: '멤버의 경고를 삭제합니다.',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'member',
                    type: 'member',
                    prompt: '경고를 삭제할 멤버를 입력하세요'
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: {member: GuildMember, warn: number}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        type Warn = {
            reason: string
        }

        let loaded = JSON.parse((await knex('guilds').where('id', msg.guild.id)
            .select('warns'))[0].warns)
        const warns: Map<String, Array<Warn>> = new Map()
        Object.keys(loaded).forEach(user => {
            warns.set(user, loaded[user])
        })
        if (!warns.get(args.member.id)) {
            warns.set(args.member.id, [])
        }
        warns.set(args.member.id, [])
        await knex('guilds')
            .update({warns: JSON.stringify(warns.toObject())})
            .where('id', msg.guild.id)
        const embed = msg.createEmbed()
        embed.setAuthor('경고 삭제됨', 'https://cdn.discordapp.com/emojis/731437745582637066.gif?v=1')
        embed.setDescription(`유저 <@${args.member.id}>님의 경고가 초기화 되었습니다.`)
        await msg.say(embed)
        return null
    }
}