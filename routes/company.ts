import express from "express";

const Router = express.Router();
import { logo } from "../multer/multer";

import {
	getCompanies,
	getSingleCompany,
	postCompany,
	updateCompany,
	deleteCompanies,
	deleteSingleCompany,
} from "../controller/company";

Router.get("/getCompanies", getCompanies);
Router.get("/getCompanies/:companyID", getSingleCompany);
Router.post(
	"/addCompany",
	logo.fields([{ name: "companyLogo", maxCount: 1 }]),
	postCompany
);
Router.put(
	"/update-company/:companyID",
	logo.fields([{ name: "companyLogo", maxCount: 1 }]),
	updateCompany
);
Router.delete("/deleteAllCompanies", deleteCompanies);
Router.delete("/deleteAllCompanies/:companyID", deleteSingleCompany);

export default Router;
