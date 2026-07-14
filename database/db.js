const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "hntstore",
    password: "hanif1406",
    port: 5432
});

module.exports = pool;