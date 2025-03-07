import express from "express";
import util from "util";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import route from "./route.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8773;

app.set("view engine", "pug");
app.set("views", "app/views");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

route(app);

app.use(express.static("public"));

const isProduction = process.env.NODE_ENV === "production";

app.listen(PORT, () => {
  const url = isProduction ? `Running on port ${PORT}` : `http://localhost:${PORT}`;
  console.log(
    util.format(
      "\nPoint your browser to %s to start using SMSGH USSD Mocker.\n" +
        "NOTE: Closing this window will stop the web application's server.",
      url
    )
  );
});
