const fs = require('fs');
import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {oneLine} from 'common-tags'

module.exports = class LoadCommandCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '로드',
            aliases: ['load-command', 'load'],
            group: 'dev',
            memberName: 'load',
            description: 'Loads a new command.',
            details: oneLine`
				The argument must be full name of the command in the format of \`group:memberName\`.
				Only the bot owner(s) may use this command.
			`,
            examples: ['load some-command'],
            ownerOnly: true,

            args: [
                {
                    key: 'command',
                    prompt: 'Which command would you like to load?',
                    validate: (val: string | undefined) => new Promise(resolve => {
                        if (!val) return resolve(false);
                        const split = val.split(':');
                        if (split.length !== 2) return resolve(false);
                        if (this.client.registry.findCommands(val).length > 0) {
                            return resolve('That command is already registered.');
                        }
                        const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
                        fs.access(cmdPath, fs.constants.R_OK, (err: any) => err ? resolve(false) : resolve(true));
                        return null;
                    }),
                    parse: (val: string) => {
                        const split = val.split(':');
                        const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
                        delete require.cache[cmdPath];
                        return require(cmdPath);
                    }
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args:any) {
        this.client.registry.registerCommand(args.command);
        const command = this.client.registry.commands.last();

        if (this.client.shard) {
            try {
                await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard!!.ids[0]}) {
						const cmdPath = this.registry.resolveCommandPath('${command!!.groupID}', '${command!!.name}');
						delete require.cache[cmdPath];
						this.registry.registerCommand(require(cmdPath));
					}
				`);
            } catch (err) {
                this.client.emit('warn', `Error when broadcasting command load to other shards`);
                this.client.emit('error', err);
                await msg.reply(`Loaded \`${command!!.name}\` command, but failed to load on other shards.`);
                return null;
            }
        }

        await msg.reply(`Loaded \`${command!!.name}\` command${this.client.shard ? ' on all shards' : ''}.`);
        return null;
    }
};