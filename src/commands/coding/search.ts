import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message, MessageEmbed} from "discord.js";

const fetch = require('node-fetch')

export default class SearchDocument extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            group: 'coding',
            description: '문서 검색 명령어입니다.',
            name: '문서검색',
            memberName: 'search',
            args: [
                {
                    type: 'string',
                    prompt: '검색할 클래스/프로퍼티를 입력해주세요',
                    key: 'search'
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: { search: string }, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        await msg.say(
            new MessageEmbed(
                await (await fetch('https://djsdocs.sorta.moe/v2/embed?src=https://raw.githubusercontent.com/discordjs/discord.js/docs/stable.json&q=' + encodeURI(args.search))).json()
            )
        )
        return null
    }
}