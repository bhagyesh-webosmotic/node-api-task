import mongoose from "mongoose";

import { contactNumber, email, DOB } from "../const/regex";
import { designation } from "../const/enum";
const employeeSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 10,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 20,
		},
		password: {
			type: String,
			minlength: 8,
			required: [true, "Password required"],
		},
		contactNumber: {
			type: Number,
			required: true,
			trim: true,
			validate: {
				validator: function (v: any) {
					var re = contactNumber;
					return v == null || re.test(v);
				},
				message: "Provided phone number is invalid.",
			},
		},
		email: {
			type: String,
			unique: [true, "not unique email"],
			trim: true,
			lowercase: true,
			validate: {
				validator: function (v: any) {
					return email.test(v);
				},
				message: "Please enter a valid email",
			},
			required: [true, "Email required"],
		},
		designation: {
			type: String,
			required: true,
			enum: designation,
		},
		salary: {
			type: Number,
			trim: true,
			minlength: 1,
			maxlength: 100,
			validate: {
				validator: Number.isInteger,
				message: "{VALUE} is not an integer value",
			},
			required: true,
		},
		DOB: {
			type: String,
			trim: true,
			minlength: 1,
			maxlength: 100,
			validate: {
				validator: function (v: any) {
					return DOB.test(v);
				},
				message: `not a valid date`,
			},
			required: true,
		},
		photo: {
			type: String,
			trim: true,
			minlength: 1,
			maxlength: 500,
			required: true,
		},
		verified: {
			type: Boolean,
			required: true,
		},
		teamLeaderID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Employee",
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
		},
	},
	{ timestamps: true }
);
const Employee = mongoose.model("employee", employeeSchema);
export default Employee;
