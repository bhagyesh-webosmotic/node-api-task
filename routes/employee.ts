import express from "express";

const Router = express.Router();
import upload from "../multer/multer";

import {
	getEmployees,
	getSingleEmployee,
	postEmployee,
	updateEmployee,
	updateMultipleEmployees,
	deleteEmployees,
	deleteSingleEmployee,
} from "../controller/employee";

Router.get("/getEmployees", getEmployees);
Router.get("/getEmployees/:employeeID", getSingleEmployee);
Router.post(
	"/addEmployee",
	upload.fields([{ name: "employeePhoto", maxCount: 1 }]),
	postEmployee
);
Router.put(
	"/update-employees/:employeeID",
	upload.fields([{ name: "employeePhoto", maxCount: 1 }]),
	updateEmployee
);
Router.put(
	"/update-employees",
	upload.fields([{ name: "employeePhoto", maxCount: 1 }]),
	updateMultipleEmployees
);
Router.delete("/deleteAllEmployees", deleteEmployees);
Router.delete("/deleteAllEmployees/:employeeID", deleteSingleEmployee);
export default Router;
