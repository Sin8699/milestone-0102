var knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL + `?ssl=true`
});

exports.default = knex;
