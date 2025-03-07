import { Router } from "express";
import controllers from "./app/controllers/index.js";
import test from "./app/controllers/test.js";

const router = Router();

export default function route(app) {
  router.get("/", (req, res) => controllers.index(req, res, app));
  router.get("/session", controllers.session);
  router.post("/session/initiate", controllers.initiate);
  router.post("/session/response", controllers.response);
  router.get("/session/release", controllers.release);
  router.get("/session/timeout", controllers.timeout);

  router.post("/test", test);

  app.use("/", router);
}
