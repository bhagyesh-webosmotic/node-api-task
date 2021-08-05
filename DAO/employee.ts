import {
	PostEmployeeValidation,
	MongoQueryUpdate,
	MongoQueryDelete,
} from "../middleware/req-body-validation";
import Employee from "../model/employee";

export const findEmployees = (
	filterObj: Record<string, any>
): Promise<Array<PostEmployeeValidation>> => {
	return Employee.find(filterObj);
};

export const findOneEmployee = (
	obj: Record<string, any>
): Promise<PostEmployeeValidation> => {
	return Employee.findOne(obj);
};

export const updateOneEmployee = (
	filterObj?: Record<string, any>,
	UpdateObj?: Record<string, any>
): Promise<MongoQueryUpdate> => {
	return Employee.updateOne(filterObj, UpdateObj, { upsert: true });
};

export const updateOneEmployeeById = (
	filterObj?: Record<string, any>,
	UpdateObj?: Record<string, any>
): Promise<PostEmployeeValidation> => {
	return Employee.findByIdAndUpdate(filterObj, UpdateObj, {
		useFindAndModify: false,
		new: true,
	});
};

export const deleteManyEmployees = (
	filterObj?: Record<string, any>
): Promise<MongoQueryDelete> => {
	return Employee.deleteMany(filterObj);
};

export const deleteOneEmployee = (
	filterObj?: Record<string, any>
): Promise<MongoQueryDelete> => {
	return Employee.deleteOne(filterObj);
};
