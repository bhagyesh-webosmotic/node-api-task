import path from "path";

import Company from "../model/company";
import { logger } from "../logs/logger";

const getCompanies = (req: any, res: any) => {
	Company.find(function (err: any, foundCompanies: any) {
		try {
			if (!err) {
				return res.status(200).send(foundCompanies);
			} else {
				return res.status(404).send("no data found");
			}
		} catch (error) {
			logger.error(`${error.message}`, {
				filePath: __filename.slice(__dirname.length + 1),
				fileName: path.dirname(__filename),
				req: req.method,
				methodName: `getCompanies`,
			});
			return res.status(500).send(error.message);
		}
	});
};

const getSingleCompany = (req: any, res: any) => {
	const companyID = req.params.companyID;
	Company.findOne({ _id: companyID }, (err: any, foundCompany: any) => {
		try {
			if (!err && foundCompany) {
				return res.status(200).send(foundCompany);
			} else {
				return res.status(404).send("no matching data found");
			}
		} catch (error) {
			logger.error(`${error.message}`, {
				filePath: __filename.slice(__dirname.length + 1),
				fileName: path.dirname(__filename),
				req: req.method,
				methodName: `getSingleCompany`,
			});
			return res.status(500).send(error.message);
		}
	});
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
				res.status(201).send("success");
			})
			.catch((err: any) => {
				console.log(err);
				res.status(500).send(err);
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
	Company.updateOne(
		{ _id: companyID },
		{
			name: Name,
			logo: Logo,
			email: Email,
			address: Address,
			contactNumber: ContactNumber,
		},
		{ upsert: true },
		(err: any): any => {
			try {
				if (!err) {
					return res.status(202).send("successfully updated the record");
				} else {
					return res.status(204).send("something went wrong");
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
		}
	);
};

const deleteCompanies = (req: any, res: any) => {
	Company.deleteMany((err: any) => {
		try {
			if (!err) {
				return res.status(200).send("succesfully deleted all the records");
			} else {
				return res.status(204).send("no data found or something went wrong");
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
	});
};

const deleteSingleCompany = (req: any, res: any) => {
	const companyID = req.params.companyID;
	Company.deleteOne({ _id: companyID }, (err: any) => {
		try {
			if (!err) {
				return res.status(200).send("succesfully deleted the data");
			} else {
				return res
					.status(204)
					.send("no matched data found or something went wrong");
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
	});
};

export {
	getCompanies,
	getSingleCompany,
	postCompany,
	updateCompany,
	deleteCompanies,
	deleteSingleCompany,
};
