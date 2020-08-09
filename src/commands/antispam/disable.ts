import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message, Role} from "discord.js";
import knex from "../../utils/knex";

export default class SetRole extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '안티스팸비활성화',
            description: '안티스팸 기능을 비활성화 합니다.',
            guildOnly: true,
            group: 'antispam',
            memberName: 'disable',
            userPermissions: ['ADMINISTRATOR']
        });
    }

    async run(msg: CommandoMessage, args: {role: Role}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
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
        config.isAntispamEnabled = false
        await knex('guilds').update({config: JSON.stringify(config)}).where('id', msg.guild.id)

        await msg.react('731437745582637066')

        return null
    }
}