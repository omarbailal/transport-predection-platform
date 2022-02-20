const mysql = require("mysql")

var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'pfa',
    port : '3306'
  });

module.exports = conn;