import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import LavaLink from "../../utils/lavaLink";
import {Embeds} from 'discord-paginationembed'
import {Track} from "erela.js";

export default class Queue extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '대기열',
            memberName: 'queue',
            group: 'music',
            description: '대기열 확인',
            guildOnly: true
        });
    }

    async run(msg: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        const player = LavaLink.getErela().players.get(msg.guild.id)
        if (!player) return msg.reply('이 서버에서 재생중인 곡이 없어요!')
        if (player.queue.length === 0) return msg.reply(msg.createEmbed()
            .setTitle('대기열이 없어요!'))
        const queue: Array<Array<Track>> = player.queue.chunk(10)
        let nowIdx = 0
        await new Embeds()
            .setArray(queue.map((i1, idx) => {
                const embed = msg.createEmbed()
                embed.setTitle(`대기열 - ${idx + 1}/${queue.length}`)
                embed.setDescription(i1.map((i2, idx) => `${
                    (nowIdx++) + 1
                }: ${i2.title}`))
                return embed
            }))
            .setChannel(msg.channel)
            .setAuthorizedUsers([msg.author.id])
            .build()
        return null
    }
}