import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {GuildMember, Message} from "discord.js";
import knex from "../../utils/knex";

export default class RemoveWarn extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '경고제거',
            group: 'moderator',
            memberName: 'remove-warn',
            description: '멤버의 경고를 삭제합니다.',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'member',
                    type: 'member',
                    prompt: '경고를 삭제할 멤버를 입력하세요'
                },
                {
                    key: 'warn',
                    type: 'integer',
                    prompt: '삭제할 경고 id를 입력해주세요'
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
        const w = warns.get(args.member.id)!!
        const idx = w.map((_,idx) => idx).indexOf(args.warn-1)
        if (idx === -1)
            return msg.reply('해당 id의 경고가 없습니다. `피코야 경고목록 (유저)`로 경고 목록을 확인해주세요.')
        w.splice(idx, 1)
        warns.set(args.member.id, w)
        await knex('guilds')
            .update({warns: JSON.stringify(warns.toObject())})
            .where('id', msg.guild.id)
        const embed = msg.createEmbed()
        embed.setAuthor('경고 삭제됨', 'https://cdn.discordapp.com/emojis/731437745582637066.gif?v=1')
        embed.setDescription('경고가 성공적으로 제거되었습니다.')
        await msg.say(embed)
        return null
    }
}