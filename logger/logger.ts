import { createLogger, transports, format } from "winston";

const logConfiguration = {
	transports: [
		new transports.File({
			filename: "./logs/serverLogs.log",
			level: "debug",
			maxFiles: 7,
			format: format.combine(
				format(function (info) {
					return info;
				})(),
				format.timestamp(),
				format.json(),
				format.errors({ stack: true }),
				format.printf((info) => {
					return `[${info.timestamp}] [${info.level}] [${info.req}] [${info.filePath}] [${info.fileName}] [${info.methodName}] : ${info.message} `;
				})
			),
		}),
		new transports.File({
			filename: "./logs/serverErrorLogs.log",
			level: "error",
			maxFiles: 7,
			format: format.combine(
				format(function (info) {
					return info;
				})(),
				format.timestamp(),
				format.json(),
				format.errors({ stack: true }),
				format.printf((info) => {
					return `[${info.timestamp}] [${info.level}] [${info.req}] [${info.filePath}] [${info.fileName}] [${info.methodName}] : ${info.message} `;
				})
			),
		}),
		new transports.Console({
			level: "debug",
			format: format.combine(
				format(function (info) {
					return info;
				})(),
				format.timestamp(),
				format.json(),
				format.errors({ stack: true }),
				format.printf((info) => {
					return `[${info.timestamp}] [${info.level}] [${info.req}] [${info.filePath}] [${info.fileName}] [${info.methodName}] : ${info.message} `;
				})
			),
		}),
	],
};
export const logger = createLogger(logConfiguration);
