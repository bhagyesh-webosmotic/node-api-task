import { CallbackError } from "mongoose";
import Employee from "../model/employee";

export const findEmployees = (
	filterObj?: any,
	projectionObj?: any,
	optionsObj?: any,
	callback?: (err: CallbackError, res: any) => void
) => {
	return Employee.find(filterObj, projectionObj, optionsObj, callback);
};

export const findOneEmployee = (obj: any) => {
	return Employee.findOne(obj);
};

export const updateOneEmployee = (
	filterObj?: any,
	UpdateObj?: any,
	optionsObj?: any,
	callback?: (err: CallbackError, res: any) => void
) => {
	return Employee.updateOne(filterObj, UpdateObj, optionsObj, callback);
};

export const deleteManyEmployees = (
	filterObj?: any,
	optionsObj?: any,
	callback?: (err: CallbackError) => void
) => {
	return Employee.deleteMany(filterObj, optionsObj, callback);
};

export const deleteOneEmployee = (
	filterObj?: any,
	optionsObj?: any,
	callback?: (err: CallbackError) => void
) => {
	return Employee.deleteOne(filterObj, optionsObj, callback);
};
