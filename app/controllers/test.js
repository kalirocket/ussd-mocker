const newline = "\r\n";

export default async function test(req, res) {
  const response = {
    Type: "Response",
    Message:
      "Welcome to the Test Service, User." +
      newline +
      "Watch the request's Message and Sequence parameters." +
      newline +
      "1. Men" +
      newline +
      "2. Women" +
      newline +
      "3. Children",
  };

  const release = {
    Type: "Release",
    Message: "Thank you for testing me.",
  };

  const { Type } = req.body;

  switch (Type) {
    case "Initiation":
    case "Response":
      return res.json(response);
    case "Timeout":
    case "Release":
      return res.json(release);
    default:
      return res.status(400).json({});
  }
}
