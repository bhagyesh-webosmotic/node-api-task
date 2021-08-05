import {
	PostCompanyValidation,
	MongoQueryUpdate,
	MongoQueryDelete,
} from "../middleware/req-body-validation";
import Company from "../model/company";

export const findCompanies = (
	obj: Record<string, any>
): Promise<Array<PostCompanyValidation>> => {
	return Company.find(obj);
};

export const findOneCompany = (
	obj: Record<string, any>
): Promise<PostCompanyValidation> => {
	return Company.findOne(obj);
};

export const updateOneCompany = (
	filterObj?: Record<string, any>,
	UpdateObj?: Record<string, any>
): Promise<MongoQueryUpdate> => {
	return Company.updateOne(filterObj, UpdateObj, { upsert: true });
};

export const deleteManyCompanies = (
	filterObj?: Record<string, any>
): Promise<MongoQueryDelete> => {
	return Company.deleteMany(filterObj);
};

export const deleteOneCompany = (
	filterObj?: Record<string, any>
): Promise<MongoQueryDelete> => {
	return Company.deleteOne(filterObj);
};
