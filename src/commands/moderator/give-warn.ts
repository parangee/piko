import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {GuildMember, Message} from "discord.js";
import knex from "../../utils/knex";

type Warn = {
    reason: string
}

export default class GiveWarn extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '경고지급',
            memberName: 'give-warn',
            group: 'moderator',
            description: '경고 지급',
            userPermissions: ['ADMINISTRATOR'],
            guildOnly: true,
            args: [
                {
                    type: 'member',
                    key: 'member',
                    prompt: '경고를 지급할 멤버를 입력하세요'
                },
                {
                    type: 'string',
                    key: 'reason',
                    prompt: '경고 사유를 입력해주세요'
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: {member: GuildMember, reason: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        let loaded = JSON.parse((await knex('guilds').where('id', msg.guild.id)
            .select('warns'))[0].warns)
        const warns: Map<String, Array<Warn>> = new Map()
        Object.keys(loaded).forEach(user => {
            warns.set(user, loaded[user])
        })
        if (!warns.get(args.member.id)) {
            warns.set(args.member.id, [])
        }
        const w = warns.get(args.member.id)!!
        w.push({
            reason: args.reason
        })
        warns.set(args.member.id, w)
        await knex('guilds')
            .update({warns: JSON.stringify(warns.toObject())})
            .where('id', msg.guild.id)
        const embed = msg.createEmbed()
        embed.setAuthor('경고 지급됨', 'https://cdn.discordapp.com/emojis/731437745582637066.gif?v=1')
        embed.addField('멤버', `<@${args.member.id}>`, true)
        embed.addField('사유', args.reason, true)
        await msg.say(embed)
        return null
    }
}
