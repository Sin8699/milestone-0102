const restify = require("restify");

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

var knex = require("knex")({
  client: "pg",
  connection: {
    host: "ec2-54-83-9-169.compute-1.amazonaws.com",
    user: "vkrpsybninavbh",
    password:
      "bf07a712499c29f09cf7d411b8c60c3d694a7a2f03119849f98184a27d599ac3",
    database: "dd1tqg3tu3ugco",
    ssl: true
  }
});

server.get("/", (req, res, next) => {
  res.send({
    Message: "Hello, you connect success, I am server !!!"
  });
});

server.get("/employees", (req, res, next) => {
  knex("employees")
    .select("*")
    .then(employees => {
      res.send({
        employeesMessage: "List of all employees",
        debugMessage: "Successful return ",
        data: { employees }
      });
    });
});

server.get("/employees/:id", (req, res, next) => {
  let id = parseInt(req.params.id);

  knex("employees")
    .where({ id: id })
    .select("*")
    .then(employees => {
      if (employees.length === 0) {
        res.send({
          code: 0,
          employeesMessage: `No employee with id ${id}`,
          debugMessage: "Found no employee",
          data: { employees }
        });
      } else
        res.send({
          code: 1,
          employeesMessage: "Found one employee",
          debugMessage: "Successful return ",
          data: { employees }
        });
    });
});

server.post("/employees", (req, res, next) => {
  let name = req.body.name;
  let tel = req.body.tel;

  knex
    .insert({
      name,
      tel
    })
    .into("employees")
    .returning("id")
    .then(id => {
      res.send({
        code: 1,
        employeesMessage: "A new employee has been created",
        debugMessage: `New employee with id ${id} has been created`,
        data: id
      });
    });
});

server.del("/employees/:id", (req, res, next) => {
  let id = parseInt(req.params.id);
  let len = employees.length;

  employees = employees.filter(x => x.id !== id);

  if (len === employees.length) {
    res.send({
      code: 0,
      employeesMessage: `No employee with id ${id}`,
      debugMessage: `Found no employee with id ${id}`,
      data: {}
    });
  } else
    res.send({
      code: 1,
      employeesMessage: `Found one employee with id ${id}`,
      debugMessage: `Found one employee with id ${id}`,
      data: { id }
    });
});

server.listen(process.env.PORT||1299, () => {
  console.log(`${server.name} is listen at ${server.url}`);
});
