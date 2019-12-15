const db = require('dotenv').config();

const connectLocal={
  host: process.env.HOST,
  database: process.env.DB,
  user:process.env.USER,
  password:process.env.PASS,
  ssl:true
}

var knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL ? process.env.DATABASE_URL+`?ssl=true` : connectLocal
});

exports.default = knex;
