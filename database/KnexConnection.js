const knex = require('knex')

const K = knex({
    client: 'mysql2',
    connection: {
        host: "rpi.najjar.dev",
        port: 3306,
        user: "najjar-mtg",
        password: "senha200",
        database: "najjar_mtg",
        requestTimeout: 60000,
    }
})

module.exports = K;
