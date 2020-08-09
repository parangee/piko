import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message, MessageAttachment} from "discord.js";
import { createCanvas } from "canvas";
import knex from "../../utils/knex";

export default class Authorize extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '인증',
            description: '안티스팸 인증',
            group: 'antispam',
            memberName: 'authorize',
            guildOnly: true
        });
    }

    async run(msg: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        const config = JSON.parse(
            (
                <{config: string}><unknown>(
                    await knex(
                        'guilds'
                    ).where(
                        'id', msg.guild.id
                    )
                )[0]
            ).config
        )
        if (!config.isAntispamEnabled) {
            return msg.reply('이 서버에서는 안티스팸을 사용할 수 없습니다.\n활성화 하려면 `피코야 안티스팸활성화`를 입력해주세요.')
        }

        const antiSpamRoleId = (await knex('guilds').select('antispam_role').where('id', msg.guild.id))[0].antispam_role

        if (!antiSpamRoleId || !msg.guild.roles.cache.get(antiSpamRoleId) || !msg.guild.roles.cache.get(antiSpamRoleId)!!.editable) {
            return msg.reply('설정한 역할이 존재하지 않거나 해당 역할을 관리할 권한이 없습니다. 피코봇의 역할 순서를 확인해주세요.')
        }

        if (!msg.member.manageable)
            return msg.reply('해당 유저의 역할을 관리할 권한이 없습니다 역할 순서를 확인해주세요.')

        if (msg.member.roles.cache.map(r => r.id).includes(antiSpamRoleId)) {
            return msg.reply('이미 인증 되어 있습니다.')
        }

        const alternateCapitals = (str: string) =>
            // @ts-ignore
            [...str].map((char, i) => char[`to${i % 2 ? "Upper" : "Lower"}Case`]()).join("")

        const randomText = () => alternateCapitals(Math.random().toString(36).substring(2, 8))

        const fontBase = 200
        const fontSize = 35

        const relativeFont = (width: number) => {
            const ratio = fontSize / fontBase
            const size = width * ratio
            return `${size}px serif`
        }

        const arbitraryRandom = (min: number, max: number) => Math.random() * (max - min) + min

        const randomRotation = (degrees = 15) => (arbitraryRandom(-degrees, degrees) * Math.PI) / 180

        const configureText = (ctx: any, width: number, height: number) => {
            ctx.font = relativeFont(width);
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            const text = randomText();
            ctx.fillStyle = "#000"
            ctx.fillText(text, width / 2, height / 2);
            return text;
        };

        const generate = (width: number, height: number) => {
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext("2d");
            ctx.rotate(randomRotation());

            const text = configureText(ctx, width, height);
            return {
                image: canvas.toBuffer(),
                text: text
            };
        };

        const captcha = generate(200,100)

        const attachment = new MessageAttachment(captcha.image)

        await msg.reply('아래 사진의 텍스트를 입력해주세요. 제한시간은 30초입니다.',attachment)

        const collector = msg.channel.createMessageCollector(m => m.author.id === msg.author.id, {
            time: 30000,
            max: 1
        })

        collector.on('collect',async m => {
            if (m.content !== captcha.text) {
                return collector.stop('wrong')
            } else {
                await msg.member.roles.add(msg.guild.roles.cache.get(antiSpamRoleId)!!)
                await msg.reply('인증이 완료되었습니다.')
            }
        })

        collector.on('end', (_, reason) => {
            if ('time' === reason) return msg.reply('시간 초과 되었습니다.')
            if ('wrong' === reason) return msg.reply('문자가 틀렸습니다. 다시 시도해주세요.')
        })

        return null
    }
}