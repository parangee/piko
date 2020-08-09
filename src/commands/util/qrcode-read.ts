import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import jsQR from 'jsqr'
import {PNG} from 'pngjs'
import fetch from "node-fetch";

const getCodeFromQrCodeImageUrl = (url: string) => {
    return fetch(url).then(res => res.buffer()).then(buff => {
        const image = PNG.sync.read(buff)
        const data = new Uint8ClampedArray(image.data)
        return jsQR(data, image.width, image.height)!!.data
    })
}

export default class QrCodeGenerate extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'qr코드읽기',
            group: 'util',
            memberName: 'qrcode-read',
            description: 'read qr code'
        });
    }

    async run(msg: CommandoMessage, args: { text: string }, fromPattern: boolean, result: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        if (msg.attachments.size === 0 || !msg.attachments.first()!!.name!!.endsWith('.png')) return msg.reply('첨부파일이 없거나 png파일이 아니에요!')
        const img = msg.attachments.first()!!

        const embed = msg.createEmbed()

        embed.setDescription(await getCodeFromQrCodeImageUrl(img.url))

        embed.setThumbnail(img.url)

        await msg.say(embed)

        return null
    }
}