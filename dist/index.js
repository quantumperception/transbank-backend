"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const transbank_sdk_1 = require("transbank-sdk");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const port = process.env.PORT;
const responseUrl = "http://127.0.0.1/appredirect";
const users = [
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
    res.sendFile(path_1.default.resolve(__dirname, "..", "redirect.html"));
});
app.get("/user/:id/add_payment_method", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if (user) {
        const userName = !user.payment_methods.cards.length
            ? user.email
            : `${user.email}_${user.payment_methods.cards.length}`;
        const startResponse = yield new transbank_sdk_1.Oneclick.MallInscription(new transbank_sdk_1.Options(transbank_sdk_1.IntegrationCommerceCodes.ONECLICK_MALL, transbank_sdk_1.IntegrationApiKeys.WEBPAY, transbank_sdk_1.Environment.Integration)).start(userName, user.email, responseUrl);
        return res.send(startResponse);
    }
    return res.status(404).send("Usuario no encontrado");
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
