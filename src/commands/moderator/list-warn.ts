import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {GuildMember, Message, MessageEmbed} from "discord.js";
import knex from "../../utils/knex";
import {Embeds} from 'discord-paginationembed'

export default class ListWarn extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            guildOnly: true,
            name: '경고목록',
            description: '유저의 경고 목록을 확인합니다.',
            memberName: 'list-warn',
            group: 'moderator',
            args:[
                {
                    prompt: '경고 목록을 확인할 유저를 입력하세요',
                    type:'member',
                    key: 'member'
                }
            ]
        });
    }

    async run(
        msg: CommandoMessage,
        args: {
            member: GuildMember
        },
        fromPattern: boolean,
        result?: ArgumentCollectorResult):
        Promise<Message | Message[] | null> {

        const warns = JSON.parse((await knex('guilds').where('id', msg.guild.id)
            .select('warns'))[0].warns)[args.member.id]

        if (!warns || Object.keys(warns).length === 0)
            return msg.reply('해당 유저에게 경고가 없습니다.')

        let total = 1

        const embeds = new Embeds()

        const embedList: Array<MessageEmbed> = []

        warns.chunk(10).map((chunk: any, index: number) => {
            const embed = msg.createEmbed()
            embed.setTitle(`경고 목록 - ${index + 1}/${warns.chunk(10).length}`)
            embed.setDescription(chunk.map((r: {reason: string}) => `${total++}: ${r.reason}`))
            embedList.push(embed)
        })

        embeds.setAuthorizedUsers([msg.author.id])

        embeds.setChannel(msg.channel)

        embeds.setArray(embedList)

        await embeds.build()

        return null
    }
}