import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message, MessageAttachment} from "discord.js";
import QRCode from 'qrcode'

export default class QrCodeGenerate extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'qr코드생성',
            group: 'util',
            memberName: 'qrcode-generate',
            description: 'generate qr code',
            args: [
                {
                    key: 'text',
                    prompt: '텍스트를 입력해주세요.',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: {text: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        const embed = msg.createEmbed()
        const attach = new MessageAttachment(await QRCode.toBuffer(args.text, {width: 1000}), 'qrcode.png')

        embed.setTitle('QRCODE')
        embed.attachFiles(
            [
                attach
            ]
        )
        embed.setImage(`attachment://qrcode.png`)
        await msg.say(embed)
        return null
    }
}