import path from "path";

import Company from "../model/company";
import { logger } from "../logs/logger";

export const getCompanies = async (req: any, res: any) => {
	try {
		const result = await Company.find();
		if (result.n > 0) {
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
	const companyID = req.params.companyID;
	try {
		const result = await Company.findOne({ _id: companyID });
		if (result.n > 0) {
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
	const Name = req.body.companyName;
	const Logo = req.files["companyLogo"][0].path;
	const Email = req.body.companyEmail;
	const Address = req.body.companyAddress;
	const ContactNumber = req.body.companyContactNumber;
	try {
		const newCompany = new Company({
			name: Name,
			logo: Logo,
			email: Email,
			address: Address,
			contactNumber: ContactNumber,
		});
		const result = await newCompany.save();
		if (result.n > 0) {
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
	const companyID = req.params.companyID;
	const Name = req.body.companyName;
	const Logo = req.files["companyLogo"][0].path;
	const Email = req.body.companyEmail;
	const Address = req.body.companyAddress;
	const ContactNumber = req.body.companyContactNumber;
	try {
		const result = await Company.updateOne(
			{ _id: companyID },
			{
				name: Name,
				logo: Logo,
				email: Email,
				address: Address,
				contactNumber: ContactNumber,
			},
			{ upsert: true }
		);
		if (result.n > 0) {
			res.status(201).json({
				message: "successfully updated company",
				data: result,
			});
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
		const result = await Company.deleteMany();
		if (result.n > 0) {
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
	const companyID = req.params.companyID;
	try {
		const result = await Company.deleteOne({ _id: companyID });
		if (result.n > 0) {
			res.status(201).send("successfully deleted all companies");
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
