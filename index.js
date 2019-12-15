const restify = require("restify");
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
const corsMiddleware = require("restify-cors-middleware");
const {login,refreshToken} = require("./router/login.js");
const {isAdmin} =require("./helper/isAdmin");

const employeesRouter = require("./router/employees").default;
//const recruitmentsRouter = require('./router/recruitments').default;
const worktimesRouter = require("./router/worktimes").default;
const transactionsEmployeeRouter = require("./router/transactions_employee")
  .default;
const transactionsDetailEmployeeRouter = require("./router/transactions_detail_employee")
  .default;
const productsRouter = require("./router/products").default;
const invoicesProductRouter = require("./router/invoices_product").default;
const invoicesDetailProductRouter = require("./router/invoices_detail_product")
  .default;
const customersRouter = require("./router/customers").default;
const roomsRouter = require("./router/rooms").default;
const servicesRouter = require("./router/services").default;
const invoicesRoomRouter = require("./router/invoices_room").default;
const invoicesDetailRoomRouter = require("./router/invoices_detail_room")
  .default;

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ["*"],
  allowHeaders: ["API-Token"],
  exposeHeaders: ["API-Token-Expiry"]
});

server.pre(cors.preflight);
server.use(cors.actual);

server.get("/", (req, res, next) => {
  res.send({
    Message: "Hello, you connect success, I am server !!!"
  });
});
//token
server.post("/login", login);
server.post("/refresh-token", refreshToken);

// xác thực tài khoản admin
server.use(isAdmin);

//api db
employeesRouter.applyRoutes(server, "/employees");
worktimesRouter.applyRoutes(server, "/worktimes");
productsRouter.applyRoutes(server, "/products");
invoicesProductRouter.applyRoutes(server, "/invoices-product");
invoicesDetailProductRouter.applyRoutes(server, "/invoices-detail-product");
transactionsEmployeeRouter.applyRoutes(server, "/transactions-employee");
transactionsDetailEmployeeRouter.applyRoutes(
  server,
  "/transactions-detail-employee"
);

customersRouter.applyRoutes(server, "/customers");
roomsRouter.applyRoutes(server, "/rooms");
servicesRouter.applyRoutes(server, "/services");
invoicesRoomRouter.applyRoutes(server, "/invoices-room");
invoicesDetailRoomRouter.applyRoutes(server, "/invoices-detail-room");


server.listen(process.env.PORT || 1299, () => {
  console.log(`${server.name} is listen at ${server.url}`);
});
