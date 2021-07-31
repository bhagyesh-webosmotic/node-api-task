import path from "path";
import bcrypt from "bcrypt";

import Employee from "../model/employee";
import { logger } from "../logs/logger";
import { sendMail } from "../email/nodemailer";
import { findEmployees, findOneEmployee } from "../DAO/employee";

export const getEmployees = async (req: any, res: any) => {
	try {
		const result = await findEmployees();
		res.status(201).send(result);
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
	const employeeId = req.params.employeeID;
	try {
		const result = await findOneEmployee({ _id: employeeId });
		res.status(201).send(result);
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
	const fName = req.body.firstName;
	const lName = req.body.lastName;
	const contactNumber = req.body.contactNumber;
	const email = req.body.email;
	const designation = req.body.designation;
	const salary = req.body.salary;
	const dob = req.body.dob;
	const leader = req.body.teamLeaderID;
	const photo = req.files["employeePhoto"][0].path;
	const companyId = req.body.companyId;
	let managerExists = false;
	try {
		const result = await Employee.findOne({ designation: "manager" });
		if (result.n > 0) {
			managerExists = true;
			throw new Error("cannot create multiple managers");
		}

		const random = Math.round(Math.random() * 100000);
		const hash = await bcrypt.hash(random.toString(), 12);
		console.log(`password:${random},hash:${hash}`);
		const newEmployee = new Employee({
			firstName: fName,
			lastName: lName,
			password: hash,
			contactNumber: contactNumber,
			email: email,
			designation: designation,
			salary: salary,
			DOB: dob,
			photo: photo,
			verified: false,
			teamLeaderID: leader,
			companyId: companyId,
		});
		if (
			(managerExists && designation != "manager") ||
			designation != "manager" ||
			(!managerExists && designation == "manager")
		) {
			const result = await newEmployee.save();
			if (result) {
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
	const rBody = req.body;
	let exit: any = 0;
	try {
		const dataLoop = await rBody.forEach((data: any) => {
			const bid = data._id;
			const fName = data.firstName;
			const lName = data.lastName;
			const contactNumber = data.contactNumber;
			const email = data.email;
			const designation = data.designation;
			const salary = data.salary;
			const dob = data.dob;
			const companyId = data.companyId;
			Employee.updateOne(
				{ _id: bid },
				{
					$set: {
						firstName: fName,
						lastName: lName,
						contactNumber: contactNumber,
						email: email,
						designation: designation,
						salary: salary,
						DOB: dob,
						companyId: companyId,
					},
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
				.send(`successfully updated ${rBody.length} records`);
		} else {
			throw new Error(
				`something went wrong, updated only ${rBody.length - exit} records`
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
	const employeeID = req.params.employeeID;
	const fName = req.body.firstName;
	const lName = req.body.lastName;
	const contactNumber = req.body.contactNumber;
	const email = req.body.email;
	const designation = req.body.designation;
	const salary = req.body.salary;
	const dob = req.body.dob;
	const photo = req.files["employeePhoto"][0].path;
	const companyId = req.body.companyId;
	try {
		const result = await Employee.updateOne(
			{ _id: employeeID },
			{
				firstName: fName,
				lastName: lName,
				contactNumber: contactNumber,
				email: email,
				designation: designation,
				salary: salary,
				DOB: dob,
				photo: photo,
				companyId: companyId,
			},
			{}
		);
		if (result.n > 0) {
			res.status(201).json({
				message: "successfully updated employee",
				data: result,
			});
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
			const result = await Employee.deleteMany({ _id: req.query._id });
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
			const result = await Employee.deleteMany();
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
	const employeeId = req.params.employeeID;
	try {
		const result = await Employee.deleteOne({ _id: employeeId });
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
