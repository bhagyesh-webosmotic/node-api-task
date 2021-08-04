export class PostEmployeeValidation {
	_id!: string;
	firstName!: string;
	lastName!: string;
	password!: string;
	contactNumber!: number;
	email!: string;
	designation!: string;
	salary!: number;
	DOB!: string;
	photo!: string;
	verified!: boolean;
	teamLeaderID!: string;
	companyId!: string;
}

export class PostCompanyValidation {
	_id!: string;
	name!: string;
	logo!: string;
	email!: string;
	address!: string;
	contactNumber!: number;
}
