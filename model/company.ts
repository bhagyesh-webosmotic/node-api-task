import mongoose from "mongoose";
const companySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 10,
		},
		logo: {
			type: String,
			trim: true,
			minlength: 1,
			maxlength: 500,
			required: true,
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
		address: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 100,
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
	},
	{ timestamps: true }
);
const Company = mongoose.model("company", companySchema);
export default Company;
