import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {exec} from "child_process";

export default class Rebuild extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '컴파일',
            ownerOnly: true,
            description: 'compile',
            memberName: 'rebuild',
            group: 'dev',
        });
    }

    // @ts-ignore
    async run(msg: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> | null {
        const embed = msg.createEmbed()
        const m = await msg.channel.send('running...')
        exec('tsc', (err, stdout, stderr) => {
            embed.setTitle('피코봇 컴파일')
            embed.setDescription(`상태: ${err ? '실패' : '성공'}`)
            if (stderr) {
                embed.addField('STDERR', stderr.length > 700 ? stderr.slice(0, 700) + '...' : stderr)
            }
            if (stdout) {
                embed.addField('STDOUT', stdout.length > 700 ? stdout.slice(0, 700) + '...' : stdout)
            }
            return m.edit(embed)
        })
        return null
    }
}