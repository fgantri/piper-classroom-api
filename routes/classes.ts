import { Router } from "express";
import { client as dbClient } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const classes = (await dbClient.query("SELECT * FROM public.classes")).rows;
  res.send(classes);
});

router.get("/:slug", (req, res) => {});

export default router;
