import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import LavaLink from "../../utils/lavaLink";
import {Utils} from "erela.js";
import {registerAndCreateEsmHooks} from "ts-node/dist/esm";
import {cachedDataVersionTag} from "v8";

export default class Play extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: '재생',
            memberName: 'play',
            group: 'music',
            guildOnly: true,
            aliases: ['play'],
            description: '음악 재생',
            args: [
                {
                    key: 'track',
                    prompt: '재생할 음악 제목을 입력해주세요',
                    type: 'string'
                }
            ],
            clientPermissions: ['CONNECT', 'SPEAK']
        });
    }

    async run(msg: CommandoMessage, args: {track: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> {
        const voiceChannel = msg.member.voice.channel
        const erela = LavaLink.getErela()
        if (!voiceChannel) return msg.reply('먼저 음성 채널에 들어가주세요!')
        const player = erela.players.spawn({
            guild: msg.guild.id,
            textChannel: msg.channel,
            voiceChannel: voiceChannel
        })
        let embed

        erela.search(args.track, msg.author).then(async search => {
            switch (search.loadType) {
                case 'TRACK_LOADED':
                    player.queue.add(search.tracks[0])
                    if (!player.playing) player.play()
                    break

                case 'SEARCH_RESULT':
                    let index = 1
                    const tracks = search.tracks.slice(0,5)

                    embed = msg.createEmbed()
                        .setTitle('곡 선택')
                        .setDescription(tracks.map(video => `**${index++}** - **${video.title}**`))
                        .setAuthor('30초 안에 번호를 입력해주세요. "취소"를 입력하거나 30초가 지나면 취소됩니다.')
                    await msg.say(embed)

                    const collector = msg.channel.createMessageCollector(m => {
                        return m.author.id === msg.author.id && /^([1-5|취소])$/i.test(m.content)
                    }, {max: 1, time: 30000})

                    collector.on('collect', m => {
                        if (/취소/i.test(m.content)) return collector.stop('취소되었습니다.')

                        const track = tracks[Number(m.content) - 1]
                        player.queue.add(track)

                        embed = msg.createEmbed()

                        embed.setTitle('대기열에 곡 추가됨')
                        embed.addField('제목', track.title, true)
                        embed.addField('재생 시간', Utils.formatTime(track.duration, true), true)
                        embed.addField('업로더', track.author, true)
                        embed.setColor('BLUE')
                        embed.setThumbnail(track.displayThumbnail())

                        msg.say(embed)

                        if (!player.playing) player.play()
                    })

                    collector.on('end', (_, reason) => {
                        if (['time', 'cancelled'].includes(reason)) return msg.reply('선택 취소되었습니다.')
                    })
                    break

                case 'PLAYLIST_LOADED':
                    search.playlist.tracks.forEach(track => player.queue.add(track))
                    // @ts-ignore
                    const duration = Utils.formatTime(search.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true)
                    embed = msg.createEmbed()
                    embed.setTitle('플레이리스트 추가됨')
                    embed.addField('추가된 곡 수', search.playlist.tracks.length)
                    embed.addField('전체 재생 시간', duration)
                    await msg.say(embed)
                    if (!player.playing) player.play()
                    break
            }
            await msg.react('▶')
        }).catch(err => msg.say(err.message))

        return null
    }
}