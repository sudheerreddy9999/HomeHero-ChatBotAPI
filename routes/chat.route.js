"use strict";

import express from "express";
import ScrapingController from "../controllers/scrape.controller.js";
import UserJwtMiddleWare from "../middlewares/jwt..usermiddleware.js";
import customUtility from "../utility/custom.utility.js";
import ScrapingValidation from "../middlewares/validators/scrape.validation.js";
import ChatController from "../controllers/chat.controller.js";
import EmbedController from "../controllers/embed.controller.js";
import ChatValidation from "../middlewares/validators/chat.validation.js";

const Router = express.Router();

Router.use(customUtility.SetTimeZone);

Router.post("/scrape", ScrapingController.ScrapeController);
Router.post("/chat", ChatController.QueryServicesController);
Router.post("/embed", EmbedController.EmbedAndServiceController);

Router.use(UserJwtMiddleWare.VerifyToken);
Router.get("/session-chat",ChatValidation.ValidateSessionId, ChatController.GetChatMessagesBySessionController);

export default Router;
