const express = require('express');
const HTTP_SERVER = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

HTTP_SERVER.use(express.static('./public'));
HTTP_SERVER.use(cors());
HTTP_SERVER.use(bodyParser.json());
HTTP_SERVER.use(bodyParser.urlencoded({extended:false}));

require('./Database/dbConfig');

const port = 5000;
HTTP_SERVER.listen(port,'0.0.0.0',(req,res) => {
    console.log("Server Run in This Port : ",port);
})

HTTP_SERVER.use('/',require('./App'));