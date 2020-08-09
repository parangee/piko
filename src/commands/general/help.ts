import {Command, CommandoClient, CommandoMessage, ArgumentCollectorResult} from "discord.js-commando";
import {Message} from "discord.js";

export default class Help extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '도움말',
            aliases: ['도움'],
            description: '도움말입니다.',
            group: 'general',
            memberName: 'help',
            args: [
                {
                    key: 'command',
                    prompt: '',
                    type: 'string',
                    default: ''
                }
            ],
        })
    }

    run(msg: CommandoMessage, args: any, fromPattern: boolean, result?: ArgumentCollectorResult<object> | undefined): Promise<Message | Message[] | null> | null {
        const embed = msg.createEmbed()
        if (args.command === '') {
            embed.setTitle('도움말')
            msg.client.registry.groups.forEach(group => {
                embed.addField(
                    group.name,
                    '`' + group.commands
                        .filter(r => !r.hidden)
                        .map(r => r.name).join('` `') + '`'
                )
            })
        } else {
            const cmd = msg.client.registry.commands.find(r => r.name === args.command || r.aliases.includes(args.command))
            if (cmd) {
                embed.setTitle(`도움말 - ${cmd.name}`)
                embed.setDescription('```ini\n' +
                cmd.description + '```' +
                (cmd.details ? '```fix\n' + cmd.details + '```' : ''))
            } else {
                embed.setTitle('명령어 없음')
                embed.setDescription(`명령어 \`${args.command}\`이(가) 없어요!`)
            }
        }
        embed.addField('피코야 <아무말>', '아무말 하면 아무말로 대답하는 명령어')
        return msg.say(embed)
    }
}