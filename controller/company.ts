import path from "path";
import { validationResult } from "express-validator";

import Company from "../model/company";
import { logger } from "../logger/logger";
import {
	findCompanies,
	findOneCompany,
	updateOneCompany,
	deleteManyCompanies,
	deleteOneCompany,
} from "../DAO/company";
import { PostCompanyValidation } from "../middleware/req-body-validation";

export const getCompanies = async (req: any, res: any) => {
	try {
		const result = await findCompanies();
		if (result) {
			res.status(201).send(result);
		} else {
			throw new Error("something went wrong, can not get employees");
		}
	} catch (error) {
		logger.error(`${error}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `getCompanies`,
		});
		return res.status(500).send(error.message);
	}
};

export const getSingleCompany = async (req: any, res: any) => {
	const companyId = req.params.companyId;
	try {
		const result = await findOneCompany({ _id: companyId });
		if (result) {
			res.status(201).send(result);
		} else {
			throw new Error("something went wrong, can not get employees");
		}
	} catch (error) {
		logger.error(`${error}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `getSingleCompany`,
		});
		return res.status(500).send(error.message);
	}
};

export const postCompany = async (req: any, res: any) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			message: "validation failed entered data is incorrect",
			errors: errors.array(),
		});
	}

	try {
		const reqBody = new PostCompanyValidation();
		reqBody.name = req.body.companyName;
		reqBody.logo = req.files["companyLogo"][0].path;
		reqBody.email = req.body.companyEmail;
		reqBody.address = req.body.companyAddress;
		reqBody.contactNumber = req.body.companyContactNumber;
		const newCompany = new Company(reqBody);

		const result = await newCompany.save();
		if (result) {
			res.status(201).json({
				message: "successfully created company",
				data: result,
			});
		} else {
			throw new Error("something went wrong, could not create company");
		}
	} catch (error) {
		logger.error(`${error.message}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `postCompany`,
		});
		return res.status(500).send(error.message);
	}
};

export const updateCompany = async (req: any, res: any) => {
	const companyId = req.params.companyId;
	const reqBody = req.body;
	try {
		const result = await updateOneCompany(
			{ _id: companyId },
			{
				$set: reqBody,
			},
			{ upsert: true }
		);
		if (result) {
			res.status(201).send("successfully updated company");
		} else {
			throw new Error("something went wrong, could not update the company");
		}
	} catch (error) {
		logger.error(`${error.message}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `updateCompany`,
		});
		return res.status(500).send(error.message);
	}
};

export const deleteCompanies = async (req: any, res: any) => {
	try {
		const result = await deleteManyCompanies();
		if (result) {
			res.status(201).send("successfully deleted all companies");
		} else {
			throw new Error("could not delete the company");
		}
	} catch (error) {
		logger.error(`${error.message}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `deleteCompanies`,
		});
		return res.status(500).send(error.message);
	}
};

export const deleteSingleCompany = async (req: any, res: any) => {
	const companyId = req.params.companyId;
	try {
		const result = await deleteOneCompany({ _id: companyId });
		if (result) {
			res.status(201).send("successfully deleted company");
		} else {
			throw new Error("could not delete the company");
		}
	} catch (error) {
		logger.error(`${error.message}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `deleteSingleCompany`,
		});
		return res.status(500).send(error.message);
	}
};
