import multer from "multer";

export default multer({
	storage: multer.diskStorage({}),
	fileFilter: (req, file, cb: any) => {
		if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
			cb(new Error("File is not supported"), false);
			return;
		}
		cb(null, true);
	},
});
