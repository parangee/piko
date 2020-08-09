import {ErelaClient, Utils} from 'erela.js'
import {CommandoClient} from "discord.js-commando";
import config from "../config";
import {MessageEmbed} from "discord.js";
import play from "../commands/music/play";


export default class LavaLink {
    private static instance: LavaLink | undefined

    private erelaClient: ErelaClient

    constructor(client: CommandoClient) {
        LavaLink.instance = this
        this.erelaClient = new ErelaClient(client, config.lavaLink.nodes)
        this.erelaClient.on('nodeError', console.error)
            .on('nodeConnect', () => console.log('connected to new node'))
            .on('queueEnd', player => {
                player.textChannel.send("모든 음악을 재생했어요!")
                this.erelaClient.players.destroy(player.guild.id)
            })
            .on('trackStart', async ({textChannel}, track) => {
                const embed = new MessageEmbed()
                embed.setTitle('곡 재생 시작')
                embed.addField('제목', track.title, true)
                embed.addField('길이', Utils.formatTime(track.duration, true), true)
                embed.addField('링크', `[클릭](${track.uri})`, true)
                embed.setColor('BLUE')
                embed.setThumbnail(track.displayThumbnail())

                textChannel.send(embed)
            })
            .on('trackEnd', (player, track) => {
                if (player.queue.length === 0) {
                    player.playing = false
                }
            })
    }

    static getErela() : ErelaClient {
        return LavaLink.instance!!.erelaClient
    }

    static getInstance() : LavaLink {
        return LavaLink.instance!!
    }
}
