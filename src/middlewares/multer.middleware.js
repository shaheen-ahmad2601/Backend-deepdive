import multer from "multer"; // we can use multer to handle file uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // specify the destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix); // specify the file name
  },
});
const upload = multer({ storage: storage });

export { upload };
