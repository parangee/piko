import {ShardingManager} from "discord.js";
import path from "path";
import config from "./config";


const manager = new ShardingManager(
    path.join(__dirname, 'bot.js'),
    {
        respawn: true,
        token: config.token,
        totalShards: config.totalShards
    }
)

manager.on('shardCreate', shard => {
    console.log(`Launched shard #${shard.id}`)
})

manager.spawn()
