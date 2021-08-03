import { CallbackError } from "mongoose";
import Company from "../model/company";

export const findCompanies = () => {
	return Company.find();
};

export const findOneCompany = (obj: any) => {
	return Company.findOne(obj);
};

export const updateOneCompany = (
	filterObj?: any,
	UpdateObj?: any,
	optionsObj?: any,
	callback?: (err: CallbackError, res: any) => void
) => {
	return Company.updateOne(filterObj, UpdateObj, optionsObj, callback);
};

export const deleteManyCompanies = (
	filterObj?: any,
	optionsObj?: any,
	callback?: (err: CallbackError) => void
) => {
	return Company.deleteMany(filterObj, optionsObj, callback);
};

export const deleteOneCompany = (
	filterObj?: any,
	optionsObj?: any,
	callback?: (err: CallbackError) => void
) => {
	return Company.deleteOne(filterObj, optionsObj, callback);
};
