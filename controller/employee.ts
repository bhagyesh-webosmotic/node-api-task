import path from "path";

import Employee from "../model/employee";
import { logger } from "../logs/logger";

const getEmployees = (req: any, res: any) => {
	Employee.find((err, foundEmployees) => {
		try {
			if (!err) {
				return res.status(200).send(foundEmployees);
			} else {
				return res.status(404).send("no data found");
			}
		} catch (error) {
			logger.error(`${error.message}`, {
				filePath: __filename.slice(__dirname.length + 1),
				fileName: path.dirname(__filename),
				req: req.method,
				methodName: `getEmployees`,
			});
			return res.status(500).send(error.message);
		}
	});
};

const getSingleEmployee = (req: any, res: any) => {
	const employeeId = req.params.employeeID;
	Employee.findOne({ _id: employeeId }, (err: any, foundEmployee: any) => {
		try {
			if (!err && foundEmployee) {
				return res.status(200).send(foundEmployee);
			} else {
				return res.status(404).send("no matching data found");
			}
		} catch (error) {
			logger.error(`${error.message}`, {
				filePath: __filename.slice(__dirname.length + 1),
				fileName: path.dirname(__filename),
				req: req.method,
				methodName: `getSingleEmployee`,
			});
			return res.status(500).send(error.message);
		}
	});
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
			{},
			(err: any, result: any) => {
				if (result.n > 0) {
					return res.status(202).send("successfully updated the record");
				} else {
					return res.status(204).send("not matched");
				}
			}
		);
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
		Employee.deleteMany({ _id: req.query._id }, (err) => {
			console.log(req.query);
			try {
				if (!err) {
					return res
						.status(200)
						.send("succesfully deleted all the selected records");
				} else {
					return res.status(204).send(err);
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
		});
	} else {
		Employee.deleteMany((err) => {
			try {
				if (!err) {
					return res.status(200).send("succesfully deleted all the records");
				} else {
					return res.status(204).send(err);
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
		});
	}
};

const deleteSingleEmployee = (req: any, res: any) => {
	const employeeId = req.params.employeeID;
	Employee.deleteOne({ _id: employeeId }, (err) => {
		try {
			if (!err) {
				return res.status(200).send("succesfully deleted the data");
			} else {
				return res.status(204).send("no matched data");
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
	});
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
