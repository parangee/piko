import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";

export default class Say extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    type: 'string',
                    key: 'tosay',
                    prompt: '말을 입력해주세요'
                }
            ],
            name: '말',
            description: '피코가 말하는 명령어',
            group: 'util',
            memberName: 'say'
        });
    }

    async run(msg: CommandoMessage, args: {tosay: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        await msg.say(args.tosay)
        return null
    }
}