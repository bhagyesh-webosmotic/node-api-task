import path from "path";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { Request, Response } from "express";

import Employee from "../model/employee";
import { logger } from "../logger/logger";
import { sendMail } from "../email/nodemailer";
import {
	findEmployees,
	findOneEmployee,
	updateOneEmployeeById,
	deleteManyEmployees,
	deleteOneEmployee,
} from "../DAO/employee";
import { PostEmployeeValidation } from "../middleware/req-body-validation";

export const getEmployees = async (req: Request | any, res: Response) => {
	try {
		const checkIfManager = await findOneEmployee({
			_id: req.id,
		});
		if (checkIfManager.designation === "manager") {
			const result = await findEmployees({});
			return res.status(201).send(result);
		} else if (checkIfManager.designation === "leader") {
			const result = await findEmployees({ teamLeaderID: req.id });
			if (!result) {
				return res.status(404).send("no data found");
			}
			return res.status(201).send(result);
		} else {
			const result = await findOneEmployee({ _id: req.id });
			return res.status(201).send(result);
		}
	} catch (error) {
		logger.error(`${error}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `getEmployees`,
		});
		return res.status(500).send(error.message);
	}
};

export const getSingleEmployee = async (req: Request | any, res: Response) => {
	const employeeId = req.params.employeeId;
	try {
		const checkIfManager = await findOneEmployee({
			_id: req.id,
		});

		if (checkIfManager.designation === "manager") {
			const result = await findOneEmployee({ _id: employeeId });
			return res.status(201).send(result);
		} else if (checkIfManager.designation === "leader") {
			const result = await findOneEmployee({
				_id: employeeId,
				teamLeaderID: req.id,
			});
			if (!result) {
				return res.status(404).send("no data found");
			}
			return res.status(201).send(result);
		} else {
			if (req.id != employeeId) {
				return res.status(403).send("you are not allowed to access this data");
			}
			const result = await findOneEmployee({ _id: req.id });
			return res.status(201).send(result);
		}
	} catch (error) {
		logger.error(`${error}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `getSingleEmployee`,
		});
		return res.status(500).send(error.message);
	}
};

export const postEmployee = async (req: Request | any, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			message: "validation failed entered data is incorrect",
			errors: errors.array(),
		});
	}

	let managerExists = false;

	try {
		const result = await findOneEmployee({ designation: "manager" });
		if (result && req.body.designation == "manager") {
			managerExists = true;
			return res.status(405).send("cannot create multiple managers");
		}

		const random = Math.round(Math.random() * 100000);
		const hash = await bcrypt.hash(random.toString(), 12);
		console.log(`password:${random},hash:${hash}`);

		const reqBody = new PostEmployeeValidation();
		reqBody.firstName = req.body.firstName;
		reqBody.lastName = req.body.lastName;
		reqBody.password = hash;
		reqBody.contactNumber = req.body.contactNumber;
		reqBody.email = req.body.email;
		reqBody.designation = req.body.designation;
		reqBody.salary = req.body.salary;
		reqBody.DOB = req.body.dob;
		reqBody.photo = req.files["employeePhoto"][0].path;
		reqBody.verified = false;
		reqBody.teamLeaderID = req.body.teamLeaderID;
		reqBody.companyId = req.body.companyId;
		const newEmployee = new Employee(reqBody);

		if (
			(managerExists && reqBody.designation != "manager") ||
			reqBody.designation != "manager" ||
			(!managerExists && reqBody.designation == "manager")
		) {
			const isMailSent = await sendMail(
				reqBody.email,
				"verify account",
				`${random}`
			);

			if (isMailSent.accepted.length === 0 && isMailSent.rejected.length > 0) {
				return res.status(500).send("cannot create employee, please try again");
			}
			const result = await newEmployee.save();
			if (!result) {
				return res.status(500).send("cannot create employee, please try again");
			}
			return res.status(201).json({
				message: "successfully created employee",
				data: result,
			});
		}
	} catch (error) {
		logger.error(`${error}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `postEmployee`,
		});
		return res.status(500).send(error.message);
	}
};

export const updateMultipleEmployees = async (req: Request, res: Response) => {
	try {
		const rBodyArr = req.body;
		let exit: number = 0;
		for (const iterator of rBodyArr) {
			const result = await updateOneEmployeeById(
				{ _id: iterator._id },
				{
					$set: iterator,
				}
			);
			if (result === null) {
				exit += 1;
			}
		}
		if (exit == 0) {
			return res
				.status(202)
				.send(`successfully updated ${rBodyArr.length} records`);
		} else {
			return res
				.status(406)
				.send(
					`something went wrong, updated only ${rBodyArr.length - exit} records`
				);
		}
	} catch (error) {
		logger.error(`${error.message}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `updateMultipleEmployees`,
		});
		return res.status(500).send(error.message);
	}
};

export const updateEmployee = async (req: Request, res: Response) => {
	const employeeId = req.params.employeeId;
	const password = req.body.password;
	if (password) {
		const hash = await bcrypt.hash(password, 12);
		req.body.password = hash;
	}
	const reqBody = req.body;
	try {
		const result = await updateOneEmployeeById(
			{ _id: employeeId },
			{ $set: reqBody }
		);
		console.log(result);
		if (!result) {
			return res.status(404).send("no such data found to update");
		}
		res.status(201).send("successfully updated employee");
	} catch (error) {
		logger.error(`${error.message}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `updateEmployee`,
		});
		return res.status(500).send(error.message);
	}
};

export const deleteEmployees = async (req: Request, res: Response) => {
	const query = Object.keys(req.query).length;
	if (query > 0) {
		try {
			const result = await deleteManyEmployees({ _id: req.query._id });
			if (result.deletedCount === 0) {
				return res.status(404).send("no data found for deletion");
			}
			res
				.status(201)
				.send(`successfully deleted ${result.deletedCount}employees`);
		} catch (error) {
			logger.error(`${error.message}`, {
				filePath: __filename.slice(__dirname.length + 1),
				fileName: path.dirname(__filename),
				req: req.method,
				methodName: `deleteEmployees`,
			});
			return res.status(500).send(error.message);
		}
	} else {
		try {
			const result = await deleteManyEmployees();
			if (result.deletedCount === 0) {
				return res.status(404).send("no data found for deletion");
			}
			res.status(201).send("successfully deleted all employees");
		} catch (error) {
			logger.error(`${error.message}`, {
				filePath: __filename.slice(__dirname.length + 1),
				fileName: path.dirname(__filename),
				req: req.method,
				methodName: `deleteEmployees`,
			});
			return res.status(500).send(error.message);
		}
	}
};

export const deleteSingleEmployee = async (req: Request, res: Response) => {
	const employeeId = req.params.employeeId;
	try {
		const result = await deleteOneEmployee({ _id: employeeId });
		if (result.deletedCount === 0) {
			return res.status(404).send("no data found for deletion");
		}
		res.status(201).send("successfully deleted the employee");
	} catch (error) {
		logger.error(`${error.message}`, {
			filePath: __filename.slice(__dirname.length + 1),
			fileName: path.dirname(__filename),
			req: req.method,
			methodName: `deleteSingleEmployee`,
		});
		return res.status(500).send(error.message);
	}
};
