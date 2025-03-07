import express from "express";
import util from "util";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import route from "./route.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8773;
const DOMAIN = process.env.DOMAIN || "127.0.0.1";

app.set("view engine", "pug");
app.set("views", "app/views"); // Keep this if needed

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

route(app); // Ensure `route.js` uses ESM

app.use(express.static("public"));

app.listen(PORT, DOMAIN, () => {
  console.log(
    util.format(
      "\nPoint your browser to http://%s:%d to start using SMSGH USSD Mocker.\n" +
        "NOTE: Closing this window will stop the web application's server.",
      DOMAIN,
      PORT
    )
  );
});
