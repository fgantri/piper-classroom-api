import { Router } from "express";
import { client as dbClient } from "../db";

const router = Router();

interface Class {
  id: number;
  title: string;
  slug: string;
  description: string;
}

router.get("/", async (req, res) => {
  const classes = (await dbClient.query("SELECT * FROM public.classes")).rows;
  res.send(classes);
});

router.get("/:param", async (req, res: any) => {
  const { param } = req.params;
  const classes: Class[] = (
    await dbClient.query("SELECT * FROM public.classes")
  ).rows;

  let result;
  if (!isNaN(Number(param))) {
    // Treat as an ID (number)
    result = classes.find((_class) => _class.id === Number(param));
  } else {
    // Treat as a slug (string)
    result = classes.find((_class) => _class.slug === param);
  }

  if (!result) {
    return res.status(404).send({ message: "Class not found" });
  }

  res.send(result);
});

router.post("/", async (req, res) => {
  const { title, slug, description } = req.body;
  try {
    const resp = await dbClient.query(
      `
        INSERT INTO public.classes (title, slug, description) 
        VALUES ($1, $2, $3)`,
      [title, slug, description]
    );

    console.log(resp);
    res.status(201).send({ msg: "row was successfully created" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ msg: `class with slug '${slug}' does already exist` });
  }
});

export default router;
