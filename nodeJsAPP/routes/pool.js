const mysql = require("mysql")

let pool = mysql.createPool({
    host: "stagetnt.ddns.me",
    user: "test",
    password: "LLCfJB2D6BtBwsYw",
    database: "tntgts",
    connectionLimit: 100,
    multipleStatements: true
})
module.exports = pool;