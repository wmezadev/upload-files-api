const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const uuid = require('uuid');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 3001;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

//Serves all the request which includes /uploads in the url from uploads folder
app.use('/uploads', express.static('./uploads'));

//upload files
app.post('/orders/uploadfile', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = [];
            //Upload single a single file
            if(req.files.files.length === undefined){
                let singleFile = req.files.files;
                let fileId = uuid.v4();
                //move file to uploads directory
                singleFile.mv(`./uploads/${singleFile.name}`);
                //push file details
                data.push({
                    id: fileId,
                    name: singleFile.name,
                    url: `http://localhost:${port}/uploads/${singleFile.name}`,
                    type: singleFile.mimetype,
                    size: singleFile.size
                });
            } 
            // Upload multiple files
            //loop all files
            else {
                _.forEach(_.keysIn(req.files.files), (key) => {
                    let file = req.files.files[key];
                    let fileId = uuid.v4();
                    //move file to uploads directory
                    file.mv(`./uploads/${file.name}`);
                    //push file details
                    data.push({
                        id: fileId,
                        name: file.name,
                        url: `http://localhost:${port}/uploads/${file.name}`,
                        type: file.mimetype,
                        size: file.size
                    });
                });
            }
            //return response
            res.send(data);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// delete files
app.post('/orders/deletefiles', async (req, res) => {
    try {
        if(!req.body) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = [];
            //loop all files
            _.forEach(_.keysIn(req.body.files), (key) => {
                let file = req.body.files[key];
                //push file id
                data.push(file.id);
            });
            //return response
            setTimeout(() => {
                res.send(data);
            }, 1000);
        }
    } catch (err) {
        res.status(500).send(err);
    }
}); 