var express = require('express');
var app = express();

// --------- Blockchain api use START ---------------



// get private of ethereum account 
var keythereum = require("keythereum");
var datadir = "/AlejaThesis/Blockchain/node1/data/";
var address= "0xF0c0Ba7BCBF04a504b3744bc57E725D6240cB9C5"; 
const password = "123456";

var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);
console.log('private key of account ' + address + ' is ' + privateKey.toString('hex'));

// setting connection to blockchain
const ethers = require('ethers');
require("dotenv").config();
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const {abi} = require("/AlejaThesis/Node.js Api/api/blockchain-api/bin/contracts/iotlogs.json");
const contractInstance = new ethers.Contract(contractAddress, abi, signer);

// --------- Blockchain api use END ---------------


var iotlogs = require('./IotLogs');
const dboperations = require('./dboperations');


/* import dependencies and create api */

var bodyParser = require('body-parser');
var cors = require('cors');
const { NText } = require('mssql');
// var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(cors());
 app.use('/api', router);
/* import dependencies and create api */

/* open port to run the api */
var port = process.env.port || 8085;
app.listen(port);
console.log('Iot API is running at ' + port);

/* middleware for authentication, login operations */ 
router.use((request, response, next) =>{
    console.log('middleware');
    next();
})
/* middleware for authentication, login operations */ 

router.route('/etherIotlogs/all').get((request, response) => {
        contractInstance.getAllIotlogs().then(result => {
            response.json(result[0])
        })
 } )


router.route('/IotLogs').get((request, response)=>{

    dboperations.getIotLogs().then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/IotLogs_Current').get((request, response)=>{

    dboperations.getIotLogs_current().then(result => {
        response.json(result[0]);
    
     })
}) 

// single parameter 
router.route('/IotLogs/:rfid').get((request, response)=>{

    dboperations.getIotLogs_rfid(request.params.rfid).then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/instructor/:email/:password').get((request, response)=>{

    dboperations.getInstructor(request.params.email, request.params.password ).then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/Instructor_nextclass/:instructorcode/:datestamp').get((request, response)=>{

    dboperations.getInstructor_nextclass(request.params.instructorcode, request.params.datestamp).then(result => {
        response.json(result[0]);
    
    })
}) 


// multiple parameter 
router.route('/IotLogs/:rfid/:classcode').get((request, response)=>{

    dboperations.getIotLogs_rfid_classcode(request.params.rfid, request.params.classcode)
            .then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/IotLogs').post((request, response)=>{

    let iotlog = {...request.body}
    dboperations.AddIotLogs(iotlog).then(result => {
        response.status(201).json(result);
    
    })
}) 


router.route('/StudentSubjects').post((request, response)=>{

    let rec = {...request.body}
    dboperations.AddStudSubject(rec).then(result => {
        response.status(201).json(result);
    
    })
}) 


router.route('/Students').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Addstudentrec(rec).then(result => {
        response.status(201).json(result);
    
    })
}) 


router.route('/Instructor').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Addinstructorrec(rec).then(result => {
        response.status(201).json(result);
    
    })
}) 



router.route('/SubjectsSched').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Addsubject_sched(rec).then(result => {
        response.status(201).json(result);
    
    })
}) 

router.route('/Courses').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Addcourses(rec).then(result => {
        response.status(201).json(result);
    
    })
}) 

router.route('/Subjects').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Addsubjects(rec).then(result => {
        response.status(201).json(result);
    
    })
}) 

