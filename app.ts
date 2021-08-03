import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import path from "path";

import { logger } from "./logger/logger";
import routes from "./routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

mongoose.connect(
	"mongodb://localhost:27017/localApi",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
	(err) => {
		if (err) {
			logger.error(`${err}`, {
				filePath: __filename.slice(__dirname.length + 1),
				fileName: path.dirname(__filename),
				req: "DB Connect",
				methodName: `mongoose.connect`,
			});
		}
	}
);

app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, function () {
	logger.info(`server started on port :${port}`, {
		filePath: __filename.slice(__dirname.length + 1),
		fileName: path.dirname(__filename),
		req: "Server start",
		methodName: `app.listen`,
	});
});
