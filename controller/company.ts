import path from "path";

import Company from "../model/company";
import { logger } from "../logs/logger";

const getCompanies = (req: any, res: any) => {
	try {
		Company.find()
			.then((result: any) => {
				res.status(201).send(result);
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `getCompanies`,
				});
				res.status(500).json({
					message: "something went wrong",
					data: err,
				});
			});
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

const getSingleCompany = (req: any, res: any) => {
	const companyID = req.params.companyID;
	try {
		Company.findOne({ _id: companyID })
			.then((result: any) => {
				res.status(201).send(result);
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `getSingleCompany`,
				});
				res.status(500).json({
					message: "something went wrong",
					data: err,
				});
			});
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

const postCompany = (req: any, res: any) => {
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
		newCompany
			.save()
			.then((result: any) => {
				res.status(201).json({
					message: "successfully created company",
					data: result,
				});
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `postCompany`,
				});
				res.status(500).json({
					message: "something went wrong",
					data: err,
				});
			});
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

const updateCompany = (req: any, res: any) => {
	const companyID = req.params.companyID;
	const Name = req.body.companyName;
	const Logo = req.files["companyLogo"][0].path;
	const Email = req.body.companyEmail;
	const Address = req.body.companyAddress;
	const ContactNumber = req.body.companyContactNumber;
	try {
		Company.updateOne(
			{ _id: companyID },
			{
				name: Name,
				logo: Logo,
				email: Email,
				address: Address,
				contactNumber: ContactNumber,
			},
			{ upsert: true }
		)
			.then((result: any) => {
				res.status(201).json({
					message: "successfully updated company",
					data: result,
				});
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `updateCompany`,
				});
				res.status(500).json({
					message: "something went wrong",
					data: err,
				});
			});
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

const deleteCompanies = (req: any, res: any) => {
	try {
		Company.deleteMany()
			.then((result: any) => {
				res.status(201).send("successfully deleted all companies");
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `deleteCompanies`,
				});
				res.status(500).json({
					message: "something went wrong",
					data: err,
				});
			});
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

const deleteSingleCompany = (req: any, res: any) => {
	const companyID = req.params.companyID;
	try {
		Company.deleteOne({ _id: companyID })
			.then((result: any) => {
				res.status(201).send("successfully deleted the company");
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `deleteSingleCompany`,
				});
				res.status(500).json({
					message: "something went wrong",
					data: err,
				});
			});
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

export {
	getCompanies,
	getSingleCompany,
	postCompany,
	updateCompany,
	deleteCompanies,
	deleteSingleCompany,
};
