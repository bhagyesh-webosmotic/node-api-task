require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export = (req: Request | any, res: Response, next: NextFunction) => {
	const token: string = req.get("Authorization");
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, `${process.env.JWTSECRET}`) as JwtPayload;
	} catch (error) {
		throw error;
	}
	if (!decodedToken) {
		const error = new Error("not authenticated");
		throw error;
	}
	req.id = decodedToken.id;
	req.email = decodedToken.email;
	next();
};
