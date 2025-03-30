import express from "express";

const { PORT = 5000 } = process.env;

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello Piper!</h1>");
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
