import express from "express";

const Router = express.Router();
import upload from "../multer/multer";

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
	upload.fields([{ name: "companyLogo", maxCount: 1 }]),
	postCompany
);
Router.put(
	"/update-company/:companyID",
	upload.fields([{ name: "companyLogo", maxCount: 1 }]),
	updateCompany
);
Router.delete("/deleteAllCompanies", deleteCompanies);
Router.delete("/deleteAllCompanies/:companyID", deleteSingleCompany);

export default Router;
