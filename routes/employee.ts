import express from "express";
import { body } from "express-validator";

const Router = express.Router();
import photo from "../multer/multer";
import isAuth from "../middleware/is-auth";

import { findOneEmployee } from "../DAO/employee";

import {
	getEmployees,
	getSingleEmployee,
	postEmployee,
	updateEmployee,
	updateMultipleEmployees,
	deleteEmployees,
	deleteSingleEmployee,
} from "../controller/employee";

Router.get("/employees", isAuth, getEmployees);
Router.get("/employees/:employeeId", isAuth, getSingleEmployee);
Router.post(
	"/addEmployee",
	photo.fields([{ name: "employeePhoto", maxCount: 1 }]),
	[
		body("firstName")
			.trim()
			.isLength({ min: 1, max: 10 })
			.not()
			.isEmpty()
			.withMessage("Please enter a valid firstname"),
		body("lastName")
			.trim()
			.isLength({ min: 1, max: 20 })
			.not()
			.isEmpty()
			.withMessage("Please enter a valid lastname"),
		body("contactNumber")
			.trim()
			.isLength({ min: 10 })
			.not()
			.isEmpty()
			.withMessage("Please enter a valid contactNuber"),
		body("email")
			.isEmail()
			.withMessage("Please enter a valid email")
			.custom((value, { req }) => {
				return findOneEmployee({ email: value }).then((userDoc: any) => {
					if (userDoc) {
						return Promise.reject("E-mail address already exists!");
					}
				});
			})
			.normalizeEmail()
			.not()
			.isEmpty(),
		body("designation")
			.trim()
			.not()
			.isEmpty()
			.withMessage("Please enter a designation"),
		body("salary").trim().not().isEmpty().withMessage("Please enter salary"),
		body("dob").not().isEmpty().withMessage("Please enter DOB"),
	],
	postEmployee
);
Router.put(
	"/update-employees/:employeeId",
	photo.fields([{ name: "employeePhoto", maxCount: 1 }]),
	isAuth,
	updateEmployee
);
Router.put("/update-employees", isAuth, updateMultipleEmployees);
Router.delete("/deleteAllEmployees", isAuth, deleteEmployees);
Router.delete("/deleteAllEmployees/:employeeId", isAuth, deleteSingleEmployee);
export default Router;
