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
		const user = await findOneEmployee({ email: email });
		const validPassword = await bcrypt.compare(password, `${user.password}`);
		if (!validPassword) {
			return res.status(401).send("try again");
		}
		const token = jwt.sign(
			{
				email: user.email,
				id: user._id.toString(),
			},
			`${process.env.JWTSECRET}`,
			{ expiresIn: "1h" }
		);
		res.status(202).json({
			token: token,
			message: "welcome",
			data: user,
		});
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
