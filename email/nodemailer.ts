require("dotenv").config();
import nodemailer from "nodemailer";

import { emailTemplate } from "./emailTemplate";
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD,
	},
});

export const sendMail = (email: any, subject: any, text: any, cb: any) => {
	const mailoptions = {
		from: "bhagyesh.webosmotic@gmail.com",
		to: email,
		subject: subject,
		html: emailTemplate(text),
	};
	transporter
		.sendMail(mailoptions)
		.then((response) => {
			cb(null, response);
		})
		.catch((error) => {
			cb(error, null);
			console.log("Error:", error);
		});
};
