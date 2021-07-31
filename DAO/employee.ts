import mongoose from "mongoose";
import Employee from "../model/employee";

export const findEmployees = () => {
	return Employee.find();
};

export const findOneEmployee = (obj: any) => {
	return Employee.findOne(obj);
};
