import multer from "multer";

export default multer({
	storage: multer.diskStorage({}),
	limits: { fileSize: 1048576 },
	fileFilter: (req, file, cb: any) => {
		if (!file.mimetype.match(/jpe|jpeg|png$i/)) {
			cb(new Error("File is not supported"), false);
			return;
		}
		cb(null, true);
	},
});

export const logo = multer({
	storage: multer.diskStorage({}),
	limits: { fileSize: 1048576 },
	fileFilter: (req, file, cb: any) => {
		if (!file.mimetype.match(/png$i/)) {
			cb(new Error("File is not supported"), false);
			return;
		}
		cb(null, true);
	},
});
