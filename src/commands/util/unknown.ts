import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import fetch from "node-fetch";
import config from "../../config";

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export default class UnknownCommandCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'unknown',
            group: 'util',
            memberName: 'unknown',
            description: 'Displays help information for when an unknown command is used.',
            unknown: true,
            hidden: true
        });
    }

    async run(msg: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        (await (
            await fetch(config.pingpong.url.replace('{sessionId}', msg.author.id), {
                method: 'POST',
                headers: {
                    Authorization: config.pingpong.auth
                },
                body: JSON.stringify({request: {query: msg.content.replace(new RegExp('^' + msg.guild.commandPrefix), '')}})
            })
        ).json()).response.replies.forEach((rep: any) => {
            if (rep.type === 'text') {
                msg.say(rep.text)
            } else if (rep.type === 'image') {
                msg.say(rep.image.url)
            }
        })
        return null
    }
};
