import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

export = (req: any, res: Response, next: NextFunction) => {
	const token: string = req.get("Authorization");
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, "abcdefg");
	} catch (error) {
		throw error;
	}
	if (!decodedToken) {
		const error = new Error("not authenticated");
		throw error;
	}
	req.token = decodedToken;
	next();
};
