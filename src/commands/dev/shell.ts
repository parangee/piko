import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {exec} from "child_process";

export default class Shell extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'sh',
            ownerOnly: true,
            description: 'shell script',
            memberName: 'shell',
            group: 'dev',
            args: [
                {
                    type: 'string',
                    key: 'script',
                    prompt: '스크립트를 입력해주세요'
                }
            ]

        });
    }

    // @ts-ignore
    async run(msg: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> | null {
        const embed = msg.createEmbed()
        embed.setTitle('SHELL')
        const m = await msg.channel.send('running...')
        // @ts-ignore
        exec(args.script, (err, stdout, stderr) => {
            // @ts-ignore
            embed.addField('INPUT', '```sh\n' + (args.script.length > 100 ? args.script.slice(0, 100) + '...' : args.script) + '```')
            if (err) {
                embed.addField('ERROR', '```js\n' + (err.message.length > 100 ? err.message.slice(0, 100) + '...' : err.message) + '```')
            }
            if (stderr) {
                embed.addField('STDERR', '```sh\n' + (stderr.length > 700 ? stderr.slice(0, 700) + '...' : stderr) + '```')
            }
            if (stdout) {
                embed.addField('STDOUT', '```sh\n' + (stdout.length > 700 ? stdout.slice(0, 700) + '...' : stdout) + '```')
            }
            return m.edit(embed)
        })
        return null
    }
}