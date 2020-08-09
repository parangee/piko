import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import LavaLink from "../../utils/lavaLink";
import play from "./play";

export default class Skip extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '스킵',
            aliases: ['skip'],
            description: '음악을 스킵합니다',
            group: 'music',
            memberName: 'skip',
            guildOnly: true
        });
    }

    async run(msg: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        const player = LavaLink.getErela().players.get(msg.guild.id)
        if (!player) return msg.reply('이 서버에서 플레이중인 음악이 없어요!')

        const vc = msg.member.voice.channel

        if (!vc || vc.id !== player.voiceChannel.id) return msg.reply('음악을 스킵하려면 음악을 재생중인 채널에 들어가세요')

        await msg.react('731437745582637066')

        player.stop()

        return null
    }
}