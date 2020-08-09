import {Command} from 'discord.js-commando'
import util from 'util'
import { CommandoClient } from 'discord.js-commando'
import { ArgumentCollectorResult } from 'discord.js-commando'
import { Message } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'

export default class Eval extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '스크립트',
            aliases: ['eval'],
            description: 'eval임',
            group: 'dev',
            memberName: 'eval',
            args: [
                {
                    key: 'script',
                    type: 'string',
                    prompt: '스크립트를 입력해주세요'
                }
            ],
            ownerOnly: true
        })
    }
    async run(msg: CommandoMessage, args: {script: string}, fromPattern: boolean, result?: ArgumentCollectorResult<object> | undefined) : Promise<Message | Message[] | null> {
        const script = args.script.replace(/^```(js)?/, '').replace(/```$/, '')
        const embed = msg.createEmbed()
        embed.addField('INPUT', '```js\n' + (script.length > 900 ? script.slice(0,900) + '...' : script) + '```')
        embed.setTitle('EVALUATE')
        const m = await msg.channel.send('Evaluating....')
        new Promise(resolve => resolve(eval(script)))
            .then(res => {
                let output

                embed.setColor('GREEN')

                embed.setDescription(`상태: <a:yes:731437745582637066> 성공`)
                if (typeof res !== 'string') {
                    const out = util.inspect(res).replace(this.client.token!!, '(token)')
                    output = out.length > 900 ? out.slice(0,900) + '...' : out
                } else {
                    output = res.length > 900 ? res.replace(this.client.token!!, '(token)').slice(0,900) + '...' : res
                }

                embed.addField('OUTPUT', '```js\n' + output + '```')
            })
            .catch(err => {
                let output

                embed.setColor('RED')

                embed.setDescription(`상태: <a:false:732093517731725313> 실패`)
                if (typeof err !== 'string') {
                    const out = util.inspect(err)
                    output = out.length > 900 ? out.replace(this.client.token!!, '(token)').slice(0,900) + '...' : out
                } else {
                    output = err.length > 900 ? err.replace(this.client.token!!, '(token)').slice(0,900) + '...' : err
                }

                embed.addField('OUTPUT', '```js\n' + output + '```')
            }).finally(() => m.edit(embed))
        return null
    }
}