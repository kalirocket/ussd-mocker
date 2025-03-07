import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import route from "./route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.set("view engine", "pug");
app.set("views", "app/views");
app.set("port", process.env.PORT || 8773);
app.set("domain", new URL(process.env.DOMAIN || "http://127.0.0.1/"));
app.set("env", process.env.NODE_ENV || "development");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

route(app);

app.use(express.static("public"));

const isProduction = app.get("env") === "production";

if (isProduction) {
  app.listen(app.get("port"), () => {
    console.log(`\nServer running in production mode. Listening on port ${app.get("port")}`);
  });
} else {
  app.listen(app.get("port"), app.get("domain").host, () => {
    console.log(
      `\nPoint your browser to ${app.get("domain").origin}:${app.get(
        "port"
      )} to start using SMSGH USSD Mocker.`
    );
  });
}
