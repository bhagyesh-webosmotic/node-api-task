import path from "path";

import Employee from "../model/employee";
import { logger } from "../logs/logger";

const getEmployees = (req: any, res: any) => {
	try {
		Employee.find()
			.then((result: any) => {
				res.status(201).send(result);
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `getEmployees`,
				});
				res.status(500).send(err);
			});
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

const getSingleEmployee = (req: any, res: any) => {
	const employeeId = req.params.employeeID;
	try {
		Employee.findOne({ _id: employeeId })
			.then((result: any) => {
				res.status(201).send(result);
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `getSingleEmployee`,
				});
				res.status(500).send(err);
			});
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

const postEmployee = (req: any, res: any) => {
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
		const newEmployee = new Employee({
			firstName: fName,
			lastName: lName,
			contactNumber: contactNumber,
			email: email,
			designation: designation,
			salary: salary,
			DOB: dob,
			photo: photo,
			companyId: companyId,
		});
		newEmployee
			.save()
			.then((result: any) => {
				res.status(201).json({
					message: "successfully created employee",
					data: result,
				});
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `postEmployee`,
				});
				res.status(500).send(err);
			});
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

const updateMultipleEmployees = async (req: any, res: any) => {
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
		console.log("outside foreach" + exit + "");
		if (exit == 0) {
			return res
				.status(202)
				.send(`successfully updated ${rBody.length} records`);
		} else {
			res
				.status(204)
				.send(
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

const updateEmployee = (req: any, res: any) => {
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
		Employee.updateOne(
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
		)
			.then((result: any) => {
				res.status(201).json({
					message: "successfully updated employee",
					data: result,
				});
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `updateEmployee`,
				});
				res.status(500).send(err);
			});
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

const deleteEmployees = (req: any, res: any) => {
	const query = Object.keys(req.query).length;
	if (query > 0) {
		try {
			Employee.deleteMany({ _id: req.query._id })
				.then((result: any) => {
					res.status(201).send("successfully deleted all employees");
				})
				.catch((err: any) => {
					console.log(err);
					logger.error(`${err}`, {
						filePath: __filename.slice(__dirname.length + 1),
						fileName: path.dirname(__filename),
						req: req.method,
						methodName: `deleteEmployees`,
					});
					res.status(500).send(err);
				});
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
			Employee.deleteMany()
				.then((result: any) => {
					res.status(201).send("successfully deleted all employees");
				})
				.catch((err: any) => {
					console.log(err);
					logger.error(`${err}`, {
						filePath: __filename.slice(__dirname.length + 1),
						fileName: path.dirname(__filename),
						req: req.method,
						methodName: `deleteEmployees`,
					});
					res.status(500).send(err);
				});
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

const deleteSingleEmployee = (req: any, res: any) => {
	const employeeId = req.params.employeeID;
	try {
		Employee.deleteOne({ _id: employeeId })
			.then((result: any) => {
				res.status(201).send("successfully deleted the employee");
			})
			.catch((err: any) => {
				console.log(err);
				logger.error(`${err}`, {
					filePath: __filename.slice(__dirname.length + 1),
					fileName: path.dirname(__filename),
					req: req.method,
					methodName: `deleteSingleEmployee`,
				});
				res.status(500).send(err);
			});
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

export {
	getEmployees,
	getSingleEmployee,
	postEmployee,
	updateEmployee,
	updateMultipleEmployees,
	deleteEmployees,
	deleteSingleEmployee,
};
