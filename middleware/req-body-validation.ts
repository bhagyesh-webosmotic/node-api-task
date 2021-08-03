export class PostEmployeeValidation {
	firstName!: String;
	lastName!: String;
	password!: String;
	contactNumber!: Number;
	email!: String;
	designation!: String;
	salary!: Number;
	DOB!: String;
	photo!: String;
	verified!: boolean;
	teamLeaderID!: String;
	companyId!: String;
}

export class PostCompanyValidation {
	name!: String;
	logo!: String;
	email!: String;
	address!: String;
	contactNumber!: Number;
}
