// import multer from "multer"; // we can use multer to handle file uploads

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp"); // specify the destination directory
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix); // specify the file name
//   },
// });
// const upload = multer({ storage: storage });

// export { upload };

import multer from "multer";
import path from "path";
import fs from "fs";

const TEMP_DIR = path.join(process.cwd(), "public", "temp");

// ensure the temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, TEMP_DIR);
  },
  filename(req, file, cb) {
    // keep original extension — helps downstream tools
    const ext = path.extname(file.originalname) || "";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

export { upload };
