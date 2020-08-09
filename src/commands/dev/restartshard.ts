import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";

export default class Restartshard extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            group: 'dev',
            name: '샤드재시작',
            memberName: 'restartshard',
            description: '샤드 재시작',
            args: [
                {
                    type: 'integer',
                    prompt: '샤드 id를 입력해주세요',
                    key: 'shard'
                }
            ],
            ownerOnly: true
        });
    }

    async run(msg: CommandoMessage, args: {shard: number}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        await this.client.shard!!.broadcastEval(
            `if (this.shard.ids[0] === ${args.shard}) process.exit()`
        )
        return null
    }
}