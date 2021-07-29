import mongoose from "mongoose";
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
		contactNumber: {
			type: Number,
			required: true,
			trim: true,
			validate: {
				validator: function (v: any) {
					var re = /^\d{10}$/;
					return v == null || re.test(v);
				},
				message: "Provided phone number is invalid.",
			},
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: function (v: any) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
				},
				message: "Please enter a valid email",
			},
			required: [true, "Email required"],
		},
		designation: {
			type: String,
			required: true,
			enum: ["developer", "leader", "manager"],
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
					return /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(v);
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
		companyId: {
			type: String,
			trim: true,
			minlength: 1,
			maxlength: 100,
			required: true,
		},
	},
	{ timestamps: true }
);
const Employee = mongoose.model("employee", employeeSchema);
export default Employee;
