var express = require('express');
var router = express.Router();
var mammoth = require("mammoth");
var fs = require('fs');
var conversion = require("phantom-html-to-pdf")();
var multer = require('multer');
var upload = multer({dest: 'public/upload/'});
var pdf = require('html-pdf');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/parse', upload.single('upload'), function(req, res, next) {
//var delimiter = req.body.delimiter;
// var body = req.body.body;
var fileName = req.file.filename;
convertToPDF(fileName,res);
/*  rest of the work  */
});

function convertToPDF(fileName,res){
  mammoth.convertToHtml({
    path: "./public/upload/"+fileName
  })
    .then(function(result) {
      var html = result.value;
      var messages = result.messages;
      fs.writeFile("./public/html/1.html", html, function(last) {
        console.log("last step over");
      });
      convertHTMLtoPDF(fileName,html);
    })
    .done();
}

function convertHTMLtoPDF(fileName,html) {
  var fileName = fileName + ".pdf";
  var html1 = `<!DOCTYPE html>
              <html>
                <head>
                  <style>
                    table {
                        font-family: arial, sans-serif;
                        border-collapse: collapse;
                        width: 100%;
                    }
                    td, th {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    tr:nth-child(even) {
                        background-color: #dddddd;
                    }
                  </style>
                </head>
                <body>
                  `+html+`
                </body>
              </html>`;
  var options = { format: 'Letter' };
  pdf.create(html1, options).toFile("pdf/"+fileName, function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});
}


module.exports = router;
