import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message, Role} from "discord.js";
import knex from "../../utils/knex";

export default class SetRole extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '안티스팸역할설정',
            description: '안티스팸 기능에서 사용할 역할 을 설정합니다.',
            guildOnly: true,
            group: 'antispam',
            memberName: 'setrole',
            args: [
                {
                    type: 'role',
                    key: 'role',
                    prompt: '인증된 유저에게 지급할 역할을 입력해주세요.'
                }
            ],
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['MANAGE_ROLES']
        });
    }

    async run(msg: CommandoMessage, args: {role: Role}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        if (!args.role.editable)
            return msg.reply('이 역할은 피코봇보다 위에 있어요! 역할 설정에서 피코봇을 위로 올려주세요')
        await knex('guilds')
            .update({antispam_role: args.role.id})
            .where('id', msg.guild.id)

        await msg.react('731437745582637066')

        return null
    }
}