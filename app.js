const path = require("path");
const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/:time", (req, res, next) => {
  const params = req.params.time;
  let timeUTC;
  let timeUnix;

  if (+params == params) {
    timeUTC = new Date(+params).toUTCString();
    timeUnix = new Date(+params).getTime();
  } else {
    timeUTC = new Date(params).toUTCString();
    timeUnix = new Date(params).getTime();
  }

  const result = {
    unix: timeUnix,
    utc: timeUTC,
  };

  if (timeUTC === "Invalid Date") {
    return res.render("api", {
      result: JSON.stringify({ error: "Invalid Date" }),
    });
  }
  return res.json(result);
});
app.use("/api", (req, res, next) => {
  return res.json({ unix: Date.now(), utc: new Date().toUTCString() });
});

app.use("/", (req, res, next) => {
  return res.render("index");
});

app.listen(process.env.PORT || 3000);
