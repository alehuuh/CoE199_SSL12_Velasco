var keythereum = require("keythereum");
var datadir = "/AlejaThesis/Blockchain/node2/data/";
var address= "0x0d58afbc8b4d9e1c42b095004d8e96ff5318e65a"; 
const password = "123456";

var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);
console.log('private key of account ' + address + ' is ' + privateKey.toString('hex'));


var iotlogs = require('./IotLogs');
const dboperations = require('./dboperations');

// execute blkchain_to_sqlserver
var myquery = dboperations.blkchain_to_sqlserver();
//var myquery1 = dboperations.sqlserver_to_blkchain();


/* import dependencies and create api */
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { NText } = require('mssql');
var app = express();
var router = express.Router();
const cron = require('node-cron');



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
// Run every day at 5:00 PM
cron.schedule('00 15 * * *', () => {
    console.log('Running attendance email job...');
    dboperations.sendAttendanceEmails();
});

/* schedule blockchain to sql syncronization - start */ 
function Timer_ScheduledBlckchain_sqlserver() {
    setInterval(() => {
      const myquery = dboperations.blkchain_to_sqlserver();
      //const currentTime = new Date();
      console.log("Updating Sql Server IotLogs ...");
    }, 60000); // ms = 1 Hour
  }
  Timer_ScheduledBlckchain_sqlserver();
/* schedule blockchain to sql syncronization - end */ 



router.route('/IotLogs').get((request, response)=>{

    dboperations.getIotLogs().then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/IotLogs_Current/:instructorcode').get((request, response)=>{

    dboperations.getIotLogs_current(request.params.instructorcode).then(result => {
        response.json(result[0]);
    
     })
}) 

//---

router.route('/Subjects/:instructorcode').get((request, response)=>{

    dboperations.getSubjects_Instructor(request.params.instructorcode).then(result => {
        response.json(result[0]);
    
     })
})

router.route('/Subjects_Admin').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getSubjects_Instructor_Admin(rec).then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/Attendance/:instructorcode').get((request, response)=>{

    dboperations.getAttendance_Instructor(request.params.instructorcode, request.query.subjectcode, request.query.studentname, request.query.datestamp).then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/Attendance_Admin').get((request, response)=>{

    dboperations.getAttendance_Admin(request.query.subjectcode, request.query.studentname, request.query.datestamp).then(result => {
        response.json(result[0]);
    
     })
}) 
//---

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

router.route('/Subjects_Admins').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Addsubjects(rec).then(result => {
        response.status(201).json(result);
    
    })
})

router.route('/Subjects_Instructor').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Addsubjectinstructor(rec).then(result => {
        response.status(201).json(result);
    
    })
})

//-----------

router.route('/Students_class/:instructorcode/:subjectcode').get((request, response)=>{

    dboperations.getStudents_class(request.params.instructorcode, request.params.subjectcode).then(result => {
        response.json(result[0]);
    
    })
}) 

router.route('/Subjects_students/:subjectcode').get((request, response)=>{

    dboperations.getStudents_class_Admin(request.params.subjectcode).then(result => {
        response.json(result[0]);
    
    })
}) 

router.route('/Subjects').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getSubjects_Admin(rec).then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/Instructors').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getInstructors_Admin(rec).then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/Instructors/:instructorcode').get((request, response)=>{

    dboperations.getInstructor_settings(request.params.instructorcode).then(result => {
        response.json(result[0]);
    
    })
})



router.route('/SubjectsDropdown').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getSubjectsDropdown_Admin(rec).then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/StudentsRecords').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getStudents_Admin(rec).then(result => {
        response.json(result[0]);
    
     })
}) 

router.route('/CoursesRecords').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getCourses_Admin(rec).then(result => {
        response.json(result[0]);
    
     })
})

router.route('/StudSubjects').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getStudsub_Admin(rec).then(result => {
        response.json(result[0]);
    
     })
})

router.route('/SubjectsInstructor').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getSubject_Instructor(rec).then(result => {
        response.json(result[0]);
    
     })
})

router.route('/ClassSchedules').get((request, response)=>{

    let rec = {...request.body}
    dboperations.getClass_Schedules(rec).then(result => {
        response.json(result[0]);
    
     })
})


//-----------

router.route('/UpdateStudents').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Updatestudentrec(rec).then(result => {
        response.status(201).json(result);
    
    })
}) 

router.route('/UpdateIntructors').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Updateinstructorec(rec).then(result => {
        response.status(201).json(result);
    
    })
}) 

router.route('/UpdateSubjects').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Updatesubjects(rec).then(result => {
        response.status(201).json(result);
    
    })
})

router.route('/UpdateStudentSubject').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Updatestudent_subject(rec).then(result => {
        response.status(201).json(result);
    
    })
})

router.route('/UpdateSubjectSched').post((request, response)=>{

    let rec = {...request.body}
    dboperations.Updatesubject_sched(rec).then(result => {
        response.status(201).json(result);
    
    })
})

//---

router.route('/DeleteRecords/:classcode').get((request, response)=>{

    dboperations.deleteMultiple_Records(request.params.classcode).then(result => {
        response.json(result);
    
    })
})

router.route('/DeleteSubjects/:classcode').get((request, response)=>{

    dboperations.deleteSubjects(request.params.classcode).then(result => {
        response.json(result);
    
    })
})

router.route('/DeleteStudents/:studnum').get((request, response)=>{

    dboperations.deleteStudents(request.params.studnum).then(result => {
        response.json(result);
    
    })
})

router.route('/DeleteInstructors/:instructorcode').get((request, response)=>{

    dboperations.deleteInstructor(request.params.instructorcode).then(result => {
        response.json(result);
    
    })
})

router.route('/DeleteSchedules/:schedcode').get((request, response)=>{

    dboperations.deleteSchedule(request.params.schedcode).then(result => {
        response.json(result);
    
    })
})

// capture rfid - papa 05052025
router.route('/rfid').get((request, response)=>{

    dboperations.getrfid().then(result => {
        response.json(result[0]);
    
     })
})
router.route('/rfid').post((request, response)=>{

    dboperations.clearrfid().then(result => {
        response.json(result);
    
     })
})
// capture rfid - papa 05052025


/*

router.route('/IotLogs_Current/:instructorcode').get((request, response)=>{

    dboperations.getIotLogs_current(request.params.instructorcode).then(result => {
        response.json(result[0]);
    
     })
}) 
*/