import express from "express";
import { body } from "express-validator";

const Router = express.Router();
import { logo } from "../multer/multer";
import { findOneCompany } from "../DAO/company";

import {
	getCompanies,
	getSingleCompany,
	postCompany,
	updateCompany,
	deleteCompanies,
	deleteSingleCompany,
} from "../controller/company";

Router.get("/companies", getCompanies);
Router.get("/companies/:companyId", getSingleCompany);
Router.post(
	"/addCompany",
	logo.fields([{ name: "companyLogo", maxCount: 1 }]),
	[
		body("companyName")
			.trim()
			.isLength({ min: 1, max: 10 })
			.not()
			.isEmpty()
			.withMessage("Please enter a valid company name"),
		body("email")
			.isEmail()
			.withMessage("Please enter a valid email")
			.custom((value, { req }) => {
				return findOneCompany({ email: value }).then((companyDoc: any) => {
					if (companyDoc) {
						return Promise.reject("E-mail address already exists!");
					}
				});
			})
			.normalizeEmail()
			.not()
			.isEmpty(),
		body("companyAddress")
			.trim()
			.isLength({ min: 1, max: 100 })
			.not()
			.isEmpty()
			.withMessage("Please enter address"),
		body("contactNumber")
			.trim()
			.isLength({ min: 10 })
			.not()
			.isEmpty()
			.withMessage("Please enter a valid contactNuber"),
	],
	postCompany
);
Router.put(
	"/update-company/:companyId",
	logo.fields([{ name: "companyLogo", maxCount: 1 }]),
	updateCompany
);
Router.delete("/deleteAllCompanies", deleteCompanies);
Router.delete("/deleteAllCompanies/:companyId", deleteSingleCompany);

export default Router;
