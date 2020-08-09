import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import LavaLink from "../../utils/lavaLink";
import play from "./play";

export default class Join extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '정지',
            aliases: ['stop'],
            description: '음악을 정지합니다',
            group: 'music',
            memberName: 'stop',
            guildOnly: true
        });
    }
    async run(msg: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        const player = LavaLink.getErela().players.get(msg.guild.id)
        if (!player) return msg.reply('이 서버에서 재생중인 음악이 없어요!')
        if (player.voiceChannel.id !== msg.member.voice.channelID) return msg.reply('음악을 정지하려면 해당 채널에 들어가있어야 합니다.')
        player.queue.clear()
        player.stop()
        LavaLink.getErela().players.destroy(msg.guild.id)
        await msg.react('⏹️')
        return null
    }
}