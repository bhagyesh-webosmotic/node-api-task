import { Request, Response } from "express";

const noRoute = (req: Request, res: Response) => {
	res.status(404).send("no such page exists");
};

export default noRoute;
