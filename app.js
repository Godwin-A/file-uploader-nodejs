const express = require('express')
const app = express()
const multer = require('multer')
const File = require('./models/file')
app.use(express.urlencoded({extended : true}));
app.use(express.json({extended : false }));
app.set("view engine", "ejs");
app.use('/public', express.static('public'));
//configure database configurations


//multer configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

//multer filter
//can only upload pdf files

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};


//now time to call the multer function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


app.post("/api/uploadFile", upload.single("myFile"), (req, res) => {
  // Stuff to be added later
  try {
    const newFile = await File.create({
      name: req.file.filename,
    });
    res.status(200).json({
      status: "success",
      message: "File created successfully!!",
    });
    console.log(req.file);
  } catch (error) {
    res.json({
      error,
    });
  }
  console.log(req.file);
});

//make axios call to get all files later
app.get("/api/getFiles", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error) {
    res.json({
      status: "Fail",
      error,
    });
  }
});

app.listen(3000,()=>{
  console.log('app started on port 5000')
})