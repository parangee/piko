import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message, TextChannel} from "discord.js";

export default class SlowMode extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '슬로우모드',
            aliases: [
                'slowmode'
            ],
            group: 'moderator',
            memberName: 'slowmode',
            description: '슬로우모드',
            args: [
                {
                    prompt: '슬로우모드 시간을 입력해주세요',
                    type: 'integer',
                    key: 'interval'
                }
            ],
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['MANAGE_CHANNELS'],
            guildOnly: true
        });
    }

    async run(msg: CommandoMessage, args: {interval: number}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        await (<TextChannel>msg.channel).setRateLimitPerUser(args['interval'])
        await msg.react('731437745582637066')
        return null
    }
}