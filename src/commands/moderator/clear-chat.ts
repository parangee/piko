import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";

export default class ClearChat extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '청소',
            args: [
                {
                    key: 'count',
                    type: 'integer',
                    max: 100,
                    min: 1,
                    prompt: '청소할 메시지 개수를 입력하세요'
                }
            ],
            memberName: 'clear-chat',
            description: '채팅청소',
            group: 'moderator',
            userPermissions: ['MANAGE_MESSAGES'],
            clientPermissions: ['MANAGE_MESSAGES']
        });
    }

    async run(msg: CommandoMessage, args: {count: number}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        await msg.delete()
        const count = (await msg.channel.bulkDelete(args.count)).size
        return msg.reply(`메시지 ${count}개가 삭제되었습니다.`)
    }
}
