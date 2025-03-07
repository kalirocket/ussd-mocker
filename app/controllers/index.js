import randomstring from "randomstring";
import Validr from "validr";
import request from "superagent";

export default {
  index,
  session,
  initiate,
  response,
  release,
  timeout,
};

async function index(req, res) {
  res.clearCookie("session");
  res.render("index", {
    ClientUrl: req.cookies.ClientUrl || "http://127.0.0.1:8773/test",
    ServiceCode: req.cookies.ServiceCode || "",
    Mobile: req.cookies.Mobile || "",
    Operator: req.cookies.Operator || "",
  });
}

async function session(req, res) {
  const session = req.cookies.session;
  if (!session) return res.redirect("/");
  session.response.Type = session.response.Type || session.response.type;
  session.response.ClientState =
    session.response.ClientState || session.response.clientState || session.response.client_state;
  session.response.Message =
    session.response.Message ||
    session.response.message.substr(0, 182).replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");
  res.render("session", { session });
}

async function initiate(req, res, next) {
  try {
    const body = req.body;
    const errors = validateInitiate(body);
    if (errors) return res.redirect("/");

    const serviceCode = body.ServiceCode || 714;
    let session = {
      ClientUrl: body.Url,
      request: {
        SessionId: randomstring.generate(32),
        Mobile: body.Mobile || "233244567890",
        ServiceCode: serviceCode,
        Type: "Initiation",
        Message: `*${serviceCode}#`,
        Operator: body.Operator?.toLowerCase() || "mtn",
        Sequence: 1,
      },
    };

    session = await messageClient(session);
    res.cookie("session", session);
    res.cookie("ClientUrl", session.ClientUrl);
    res.cookie("ServiceCode", session.request.ServiceCode);
    res.cookie("Mobile", session.request.Mobile);
    res.cookie("Operator", session.request.Operator);
    res.redirect("/session");
  } catch (error) {
    next(error);
  }
}

async function response(req, res, next) {
  try {
    let session = req.cookies.session;
    if (!session) return res.redirect("/");

    session.request.Type = "Response";
    session.request.Message = req.body.UserInput || "";
    session.request.ClientState = session.response.ClientState || "";
    session.request.Sequence += 1;

    session = await messageClient(session);
    res.cookie("session", session);
    res.redirect("/session");
  } catch (error) {
    next(error);
  }
}

async function release(req, res, next) {
  try {
    let session = req.cookies.session;
    if (!session) return res.redirect("/");

    session.request.Type = "Release";
    session.request.Message = "";
    session.request.ClientState = session.response.ClientState || "";
    session.request.Sequence += 1;

    session = await messageClient(session);
    res.cookie("session", session);
    res.redirect("/session");
  } catch (error) {
    next(error);
  }
}

async function timeout(req, res, next) {
  try {
    let session = req.cookies.session;
    if (!session) return res.redirect("/");

    session.request.Type = "Timeout";
    session.request.Message = "";
    session.request.ClientState = session.response.ClientState || "";
    session.request.Sequence += 1;

    session = await messageClient(session);
    res.cookie("session", session);
    res.redirect("/session");
  } catch (error) {
    next(error);
  }
}

/*
  🔹 Helper Functions
*/

function validateInitiate(body) {
  const validr = new Validr(body);
  validr.validate("Url", "URL must be valid.").isLength(1).isURL();
  return validr.validationErrors(true);
}

function validateResponse(body) {
  const validr = new Validr(body);
  validr.validate("UserInput", "User input must be valid number").isLength(1).isNumeric();
  return validr.validationErrors(true);
}

function validateUssdResponse(body) {
  const validr = new Validr(body);
  validr.validate("Type", "Type is required.").isLength(1);
  validr.validate("Message", "Message is required.").isLength(1);
  return validr.validationErrors(true);
}

async function messageClient(session) {
  try {
    const res = await request
      .post(session.ClientUrl)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(session.request);

    session.response = res.body;
    return session;
  } catch (error) {
    throw new Error(`Didn't get a successful response from client at ${session.ClientUrl}`);
  }
}
