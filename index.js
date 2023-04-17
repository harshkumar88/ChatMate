const express=require('express');
const app=express();
const registerRouter=require('./src/router.js')
const port=process.env.PORT||5000;
const path=require("path")
const multer = require("multer");
require("./src/router.js")
app.use(registerRouter)


app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})



let imageName = "";  
const storage = multer.diskStorage({
  destination: path.join("./image"), 
  filename: function (req, file, cb) {
    imageName = Date.now() + path.extname(file.originalname);
    cb(null, imageName);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
}).single("myImage");

app.post("/upload-image", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      return res.status(201)
      .json({ url: `http://localhost:${port}/image/` + imageName }); 34
    }
  });
});


app.listen(port,(res,req)=>{
    console.log("I am running on port "+port)
})