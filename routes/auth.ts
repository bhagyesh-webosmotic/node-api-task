import express from "express";
import { body } from "express-validator";

const Router = express.Router();

import { login } from "../controller/auth";

Router.post(
	"/login",
	[
		body("password").trim().isLength({ min: 4 }).not().isEmpty(),
		body("email") //TODO handle if email exists in DB on server route, so it simple trows error and does not get pass to auth controller
			.isEmail()
			.withMessage("Please enter a valid email")
			.normalizeEmail()
			.not()
			.isEmpty(),
	],
	login
);
export default Router;
