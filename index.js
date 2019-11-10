const restify = require('restify');

var server=restify.createServer();
server.use(restify.plugins.bodyParser());

var knex= require('knex')({
    client:'postgres',
    connection:{
        
    }
})