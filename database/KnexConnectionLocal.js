const knex = require('knex')

const K = knex({
    client: 'mysql2',
    connection: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "senha200",
        database: "najjarmtg"
    }
})

module.exports = K;
