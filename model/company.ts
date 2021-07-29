import mongoose from "mongoose";
const companySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		logo: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		contactNumber: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);
const Company = mongoose.model("company", companySchema);
export default Company;
