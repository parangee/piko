export default {
    token: '',
    prefix: '피코야 ',
    owners: ['628595345798201355'],
    lavaLink: {
        nodes: [{
            host: 'localhost',
            port: 2333,
            password: 'youshallnotpass'
        }]
    },
    database: {
        client: 'mysql',
        connection: {
            database: 'test',
            host: 'localhost',
            port: 3306,
            user: 'test',
            password: 'test'
        }
    },
    totalShards: 1,
    pingpong: {
        url: '',
        auth: ''
    }
}