import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {GuildMember, Message, User} from "discord.js";

export default class Kick extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            guildOnly: true,
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            memberName: 'kick',
            group: 'moderator',
            description: '추방 명령어',
            name: '추방',
            aliases: ['kick'],
            args: [
                {
                    key: 'user',
                    type: 'member',
                    prompt: '추방할 유저를 입력해주세요'
                },
                {
                    key: 'reason',
                    type: 'string',
                    prompt: '추방 사유를 입력해주세요.',
                    default: '사유 없음'
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: {user: GuildMember, reason: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        await args.user.kick(args.reason)
        await msg.react('731437745582637066')
        return null
    }
}