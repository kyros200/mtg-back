const knex = require('knex')

const K = knex({
    client: 'mysql2',
    connection: {
        host: "kutnpvrhom7lki7u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "l1jdfx975047recf",
        password: "luwhnb2rfujgpwc8",
        database: "tr7y4dwbvoy4hfzs"
    }
})

module.exports = K;
