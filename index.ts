import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bp from "body-parser";
import {
  Oneclick,
  Options,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
  Environment,
} from "transbank-sdk";
import path from "path";

dotenv.config();

const app: Express = express();
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
const port = process.env.PORT;

const responseUrl = "http://127.0.0.1/appredirect";

interface Card {
  id: number;
  username: string;
  last4digits: number;
  created: Date;
  tbkUser: string;
}

interface User {
  id: number;
  email: string;
  payment_methods: {
    organization: string | undefined;
    cards: Card[];
  };
}

const users: User[] = [
  {
    id: 62,
    email: "jhernandez@enerlink.cl",
    payment_methods: {
      organization: "Enerlink",
      cards: [],
    },
  },
  {
    id: 1,
    email: "evx@enerlink.cl",
    payment_methods: {
      organization: undefined,
      cards: [],
    },
  },
];

app.post("/erek", (req, res, next) => {
  console.log(req.body);
  res.send("LOL");
});

app.get("/appredirect", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "..", "redirect.html"));
});

app.get("/user/:id/add_payment_method", async (req, res, next) => {
  const user: User | undefined = users.find(
    (user) => user.id === parseInt(req.params.id)
  );
  if (user) {
    const userName: string = !user.payment_methods.cards.length
      ? user.email
      : `${user.email}_${user.payment_methods.cards.length}`;
    const startResponse = await new Oneclick.MallInscription(
      new Options(
        IntegrationCommerceCodes.ONECLICK_MALL,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      )
    ).start(userName, user.email, responseUrl);

    return res.send(startResponse);
  }
  return res.status(404).send("Usuario no encontrado");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
