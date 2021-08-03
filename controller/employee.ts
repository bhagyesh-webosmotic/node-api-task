import path from "path";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import Employee from "../model/employee";
import { logger } from "../logs/logger";
import { sendMail } from "../email/nodemailer";
import {
	findEmployees,
	findOneEmployee,
	updateOneEmployee,
	deleteManyEmployees,
	deleteOneEmployee,
} from "../DAO/employee";
import { PostEmployeeValidation } from "../middleware/req-body-validation";

export const getEmployees = async (req: any, res: any) => {
	try {
		const checkIfManager = await findOneEmployee({
			_id: req.id,
		});
		if (checkIfManager.designation === "manager") {
			const result = await findEmployees();
			return res.status(201).send(result);
		} else if (checkIfManager.designation === "leader") {
			const result = await findEmployees({ teamLeaderID: req.id });
			if (!result) {
				throw new Error("no data found");
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

export const getSingleEmployee = async (req: any, res: any) => {
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
				throw new Error("no data found");
			}
			return res.status(201).send(result);
		} else {
			if (req.id != employeeId) {
				throw new Error("you are not allowed to access this data");
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

export const postEmployee = async (req: any, res: any) => {
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
			throw new Error("cannot create multiple managers");
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
			const result = await newEmployee.save();
			if (result) {
				sendMail(
					reqBody.email,
					"verify account",
					random,
					(err: any, data: any) => {
						if (err) {
							console.log(err);
							throw new Error(err);
						}
					}
				);
				return res.status(201).json({
					message: "successfully created employee",
					data: result,
				});
			} else {
				throw new Error("cannot create employee, please try again");
			}
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

export const updateMultipleEmployees = async (req: any, res: any) => {
	const rBodyArr = req.body;
	let exit: any = 0;
	try {
		const dataLoop = await rBodyArr.forEach((data: any) => {
			updateOneEmployee(
				{ _id: data._id },
				{
					$set: data,
				},
				{},
				(err: any, res: any) => {
					if (!err) {
						return;
					} else {
						exit += 1;
						return;
					}
				}
			);
		});
		if (exit == 0) {
			return res
				.status(202)
				.send(`successfully updated ${rBodyArr.length} records`);
		} else {
			throw new Error(
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

export const updateEmployee = async (req: any, res: any) => {
	const employeeId = req.params.employeeId;

	const password = req.body.password;

	if (password) {
		const hash = await bcrypt.hash(password, 12);
		req.body.password = hash;
	}

	const reqBody = req.body;

	try {
		const result = await updateOneEmployee(
			{ _id: employeeId },
			{ $set: reqBody },
			{}
		);
		console.log(result);

		if (result.n > 0) {
			res.status(201).send("successfully updated employee");
		} else {
			throw new Error("no such data found");
		}
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

export const deleteEmployees = async (req: any, res: any) => {
	const query = Object.keys(req.query).length;
	if (query > 0) {
		try {
			const result = await deleteManyEmployees({ _id: req.query._id });
			if (result.n > 0) {
				res.status(201).send("successfully deleted all employees");
			} else {
				throw new Error("no data found");
			}
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
			if (result.n > 0) {
				res.status(201).send("successfully deleted all employees");
			} else {
				throw new Error("no data found");
			}
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

export const deleteSingleEmployee = async (req: any, res: any) => {
	const employeeId = req.params.employeeId;
	try {
		const result = await deleteOneEmployee({ _id: employeeId });
		console.log(result);

		if (result.n > 0) {
			res.status(201).send("successfully deleted the employee");
		} else {
			throw new Error("no data found");
		}
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
