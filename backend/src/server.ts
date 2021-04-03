import "module-alias/register";
import config from "@config/config";
import path from "path";
import session from "express-session";
import initRedisStore from 'connect-redis';
import redis from 'redis';

export const wrap = (fn: any) => (...args: any[]) => fn(...args).catch(args[2]);

if (
  !process.env.NODE_ENV ||
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test"
) {
  const dotenv = require("dotenv");
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
}

const configureRedisStore = () => {
  if (!eval(process.env.USE_REDIS)) {
    return null;
  }

  const RedisStore = initRedisStore(session),
    client  = redis.createClient();

  const redisStore = new RedisStore({
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    db: +process.env.REDIS_DATABASE,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true,
    client
  });

  return redisStore;
};

// Globing model files
config
  .getGlobedFiles(`${__dirname}/models/**/*.js`)
  .forEach((modelPath) => {
    require(path.resolve(modelPath));
  });

const configureSession = (redisStore: any) => {
  const sessionConfig: any = {
    name: "ngcommerce.connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    proxy: true,
  };

  if (redisStore) {
    sessionConfig.store = redisStore;
  }

  return session(sessionConfig);
};

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import connectDB from "../config/database";

// Admin routes
import { userAdminRouter } from "@admin/routes/user.route";
import { customerAdminRouter } from "@admin/routes/customer.route";
import { accountAdminRouter, passport } from "@admin/routes/account.route";
import { companyAdminRouter } from "@admin/routes/company.route";
import { storeAdminRouter } from "@admin/routes/store.route";
import { storeTableAdminRouter } from "@admin/routes/store-table.route";
import { categoryAdminRouter } from "@admin/routes/category.route";
import { productAdminRouter } from "@admin/routes/product.route";
import { optionSetAdminRouter } from "@admin/routes/option-set.route";
import { cartAdminRouter } from "@admin/routes/cart.route";
import { checkoutAdminRouter } from "@admin/routes/checkout.route";
import { ordersAdminRouter } from "@admin/routes/order.route";
import { reportAdminRouter } from "@admin/routes/report.route";
import { commonAdminRouter } from "@admin/routes/common.route";

// Frontsite routes
import { accountRouter } from "@frontsite/routes/account.route";
import { orderRouter } from "@frontsite/routes/order.route";
import { categoryRouter } from "@frontsite/routes/category.route";
import { productRouter } from "@frontsite/routes/product.route";
import { cartRouter } from "@frontsite/routes/cart.route";
import { checkoutRouter } from "@frontsite/routes/checkout.route";

const app = express();

// options for cors middleware
const options: cors.CorsOptions = {
  allowedHeaders: ["Authorization", "Content-Type"],
  exposedHeaders: [],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: true,
  preflightContinue: false,
};

// //use cors middleware
app.use(cors(options));

// //enable pre-flight
app.options("*", cors(options));

// session and cookies
const store = configureRedisStore();

app.use(cookieParser());
app.use(configureSession(store));
app.use(flash());

// authentication
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
let dbConnected = false;
connectDB().then((connected) => {
  dbConnected = connected;
});

// Express configuration
app.set("port", process.env.PORT || 5000);

// request parsing
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "20mb",
  })
);
app.use(bodyParser.json());

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get(`/`, (_req, res) => {
  res.send(`
    DB Connection: ${dbConnected ? 'CONNECTED' : 'FAILED'}!
    API Running...
  `);
});

const adminVersion = "v1";
const frontsiteVersion = "v1";

// Admin
app.use(`/api/admin/${adminVersion}/users`, userAdminRouter);
app.use(`/api/admin/${adminVersion}/customers`, customerAdminRouter);
app.use(`/api/admin/${adminVersion}/account`, accountAdminRouter);
app.use(`/api/admin/${adminVersion}/companies`, companyAdminRouter);
app.use(`/api/admin/${adminVersion}/stores`, storeAdminRouter);
app.use(`/api/admin/${adminVersion}/store-tables`, storeTableAdminRouter);
app.use(`/api/admin/${adminVersion}/categories`, categoryAdminRouter);
app.use(`/api/admin/${adminVersion}/products`, productAdminRouter);
app.use(`/api/admin/${adminVersion}/option-set`, optionSetAdminRouter);
app.use(`/api/admin/${adminVersion}/cart-items`, cartAdminRouter);
app.use(`/api/admin/${adminVersion}/checkout`, checkoutAdminRouter);
app.use(`/api/admin/${adminVersion}/orders`, ordersAdminRouter);
app.use(`/api/admin/${adminVersion}/report`, reportAdminRouter);
app.use(`/api/admin/${adminVersion}`, commonAdminRouter);

// Frontsite
app.use(`/api/${frontsiteVersion}/account`, accountRouter);
app.use(`/api/${frontsiteVersion}/orders`, orderRouter);
app.use(`/api/${frontsiteVersion}/categories`, categoryRouter);
app.use(`/api/${frontsiteVersion}/products`, productRouter);
app.use(`/api/${frontsiteVersion}/cart-items`, cartRouter);
app.use(`/api/${frontsiteVersion}/checkout`, checkoutRouter);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
