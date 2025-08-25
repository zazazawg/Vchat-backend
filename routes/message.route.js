import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();
router.route("/sendMessage/:id").post(isAuthenticated, sendMessage);
router.route("/getMessages/:id").get(isAuthenticated, getMessages);
export default router;