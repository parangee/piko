import {Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {oneLine} from "common-tags";

module.exports = class UnloadCommandCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: '언로드',
			aliases: ['unload-command', 'unload'],
			group: 'dev',
			memberName: 'unload',
			description: 'Unloads a command.',
			details: oneLine`
				The argument must be the name/ID (partial or whole) of a command.
				Only the bot owner(s) may use this command.
			`,
			examples: ['unload some-command'],
			ownerOnly: true,

			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to unload?',
					type: 'command'
				}
			]
		});
	}

	async run(msg : CommandoMessage, args: any) {
		args.command.unload();

		if(this.client.shard) {
			try {
				await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.ids[0]}) this.registry.commands.get('${args.command.name}').unload();
				`);
			} catch(err) {
				this.client.emit('warn', `Error when broadcasting command unload to other shards`);
				this.client.emit('error', err);
				await msg.reply(`Unloaded \`${args.command.name}\` command, but failed to unload on other shards.`);
				return null;
			}
		}

		await msg.reply(`Unloaded \`${args.command.name}\` command${this.client.shard ? ' on all shards' : ''}.`);
		return null;
	}
};
