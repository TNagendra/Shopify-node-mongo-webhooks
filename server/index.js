import "@shopify/shopify-api/adapters/node";
import "dotenv/config";
import Express from "express";
import mongoose from "mongoose";
import { resolve } from "path";
import shopify from "../utils/shopify.js";

import sessionHandler from "../utils/sessionHandler.js";
import csp from "./middleware/csp.js";
import setupCheck from "../utils/setupCheck.js";
import {
  customerDataRequest,
  customerRedact,
  shopRedact,
} from "./controllers/gdpr.js";
import applyAuthMiddleware from "./middleware/auth.js";
import isShopActive from "./middleware/isShopActive.js";
import verifyHmac from "./middleware/verifyHmac.js";
import verifyProxy from "./middleware/verifyProxy.js";
import verifyRequest from "./middleware/verifyRequest.js";
import proxyRouter from "./routes/app_proxy/index.js";
import userRoutes from "./routes/index.js";

setupCheck(); // Run a check to ensure everything is set up properly

const PORT = parseInt(process.env.PORT, 10) || 8081;
const isDev = process.env.NODE_ENV === "dev";

// MongoDB Connection
const mongoUrl =
  process.env.MONGO_URL 

mongoose.connect(mongoUrl)
.then(()=>console.log('Mongodb connected....'))
.catch((err)=>console.log(err))


const createServer = async (root = process.cwd()) => {
  const app = Express();
  app.disable("x-powered-by");

  applyAuthMiddleware(app);

  // Incoming webhook requests
  app.post(
    "/api/webhooks/:topic",
    Express.text({ type: "*/*" }),
    async (req, res) => {
      const { topic } = req.params || "";
      const shop = req.headers["x-shopify-shop-domain"] || "";

      try {
        await shopify.webhooks.process({
          rawBody: req.body,
          rawRequest: req,
          rawResponse: res,
        });
        console.log(`--> Processed ${topic} webhook for ${shop}`);
      } catch (e) {
        console.error(
          `---> Error while registering ${topic} webhook for ${shop}`,
          e
        );
        if (!res.headersSent) {
          res.status(500).send(error.message);
        }
      }
    }
  );
  app.use(Express.json());

  app.post("/api/graphql", verifyRequest, async (req, res) => {
    try {
      const sessionId = await shopify.session.getCurrentId({
        isOnline: true,
        rawRequest: req,
        rawResponse: res,
      });
      const session = await sessionHandler.loadSession(sessionId);
      const response = await shopify.clients.graphqlProxy({
        session,
        rawBody: req.body,
      });
      res.status(200).send(response.body);
    } catch (e) {
      console.error(`---> An error occurred at GraphQL Proxy`, e);
      res.status(403).send(e);
    }
  });

  app.use(csp);
  app.use(isShopActive);
  // If you're making changes to any of the routes, please make sure to add them in `./client/vite.config.cjs` or it'll not work.
  app.use("/api/apps", verifyRequest, userRoutes); //Verify user route requests
  app.use("/api/proxy_route", verifyProxy, proxyRouter); //MARK:- App Proxy routes

  app.post("/api/gdpr/:topic", verifyHmac, async (req, res) => {
    const { body } = req;
    const { topic } = req.params;
    const shop = req.body.shop_domain;

    console.warn(`--> GDPR request for ${shop} / ${topic} received.`);

    let response;
    switch (topic) {
      case "customers_data_request":
        response = await customerDataRequest(topic, shop, body);
        break;
      case "customers_redact":
        response = await customerRedact(topic, shop, body);
        break;
      case "shop_redact":
        response = await shopRedact(topic, shop, body);
        break;
      default:
        console.error(
          "--> Congratulations on breaking the GDPR route! Here's the topic that broke it: ",
          topic
        );
        response = "broken";
        break;
    }

    if (response.success) {
      res.status(200).send();
    } else {
      res.status(403).send("An error occurred");
    }
  });

  if (!isDev) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");

    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${root}/dist/client/index.html`));
    });
  }

  return { app };
};

createServer().then(({ app }) => {
  app.listen(PORT, () => {
    console.log(`--> Running on ${PORT}`);
  });
});
