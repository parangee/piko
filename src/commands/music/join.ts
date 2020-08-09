import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import LavaLink from "../../utils/lavaLink";

export default class Join extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '입장',
            aliases: ['join'],
            description: '유저의 통화방에 들어갑니다.',
            group: 'music',
            memberName: 'join',
            guildOnly: true,
            clientPermissions: ['CONNECT']
        });
    }
    async run(msg: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        const voiceChannel = msg.member.voice.channel
        if (!voiceChannel) return msg.reply('먼저 음성 채널에 들어가주세요!')
        LavaLink.getErela().players.spawn({
            guild: msg.guild.id,
            textChannel: msg.channel,
            voiceChannel: voiceChannel
        })
        await msg.react('731437745582637066')
        return null
    }
}