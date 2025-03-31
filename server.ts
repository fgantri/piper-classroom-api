import express from "express";
import classes from "./routes/classes";

const { PORT = 5000 } = process.env;

const app = express();

app.use(express.json());
app.use("/api/classroom", classes);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
