const path = require("path");
const express = require("express");

const app = express();
const helmet = require("helmet");
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet())
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  next();
});
app.use("/api/:date", (req, res, next) => {
  const params = req.params.date;
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
    return res.json({ error: "Invalid Date" })
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
