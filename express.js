const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.use("/src/img", express.static(path.join(__dirname, "src/img")));
app.use("/src/js", express.static(path.join(__dirname, "src/js")));
app.use("/src/css", express.static(path.join(__dirname, "src/css")));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
