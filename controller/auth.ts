require("dotenv").config();
import { Request, Response } from "express";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import { logger } from "../logger/logger";
import { findOneEmployee } from "../DAO/employee";

export const login = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new Error("validation failed");
		}
		const email = req.body.email;
		const password = req.body.password;
		let loadedUser;
		const user = await findOneEmployee({ email: email });
		loadedUser = user;
		const validPassword = await bcrypt.compare(password, user.password);
		if (validPassword) {
			const token = jwt.sign(
				{
					email: loadedUser.email,
					id: loadedUser._id.toString(),
				},
				"abcdefg",
				{ expiresIn: "1h" }
			);
			res.status(202).json({
				token: token,
				message: "welcome",
				data: user,
			});
		} else {
			return res.status(500).send("try again");
		}
	} catch (error) {
		logger.error(`${error}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `getEmployees`,
		});
		return res.status(500).send(error.message);
	}
};
