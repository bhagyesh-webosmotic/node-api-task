import express from "express";

const Router = express.Router();
import photo from "../multer/multer";
import isAuth from "../middleware/is-auth";

import {
	getEmployees,
	getSingleEmployee,
	postEmployee,
	updateEmployee,
	updateMultipleEmployees,
	deleteEmployees,
	deleteSingleEmployee,
} from "../controller/employee";

Router.get("/getEmployees", isAuth, getEmployees);
Router.get("/getEmployees/:employeeID", getSingleEmployee);
Router.post(
	"/addEmployee",
	photo.fields([{ name: "employeePhoto", maxCount: 1 }]),
	postEmployee
);
Router.put(
	"/update-employees/:employeeID",
	photo.fields([{ name: "employeePhoto", maxCount: 1 }]),
	updateEmployee
);
Router.put("/update-employees", updateMultipleEmployees);
Router.delete("/deleteAllEmployees", deleteEmployees);
Router.delete("/deleteAllEmployees/:employeeID", deleteSingleEmployee);
export default Router;
