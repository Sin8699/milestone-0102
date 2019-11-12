
require('dotenv').config();

var knex = require("knex")({
    client: "pg",
    connection: {
      host: process.env.Host,
      user: process.env.User,
      password: process.env.Password,
      database: process.env.Database,
      ssl: true
    }
  });

exports.default=knex