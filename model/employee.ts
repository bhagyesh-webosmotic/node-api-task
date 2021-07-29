import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		contactNumber: {
			type: Number,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		designation: {
			type: String,
			required: true,
		},
		salary: {
			type: Number,
			required: true,
		},
		DOB: {
			type: String,
			required: true,
		},
		photo: {
			type: String,
			required: true,
		},
		companyId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
const Employee = mongoose.model("employee", employeeSchema);
export default Employee;
