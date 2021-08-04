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

export const sendMail = (email: string, subject: string, text: string) => {
	const mailoptions = {
		from: "bhagyesh.webosmotic@gmail.com",
		to: email,
		subject: subject,
		html: emailTemplate(text),
	};
	return transporter.sendMail(mailoptions);
};
