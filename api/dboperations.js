//-------------
const ethers = require('ethers');
const BigNumber = require('bignumber.js');
require("dotenv").config();
const API_URL = process.env.API_URL; // get the URL of the node in the blockchain - Geth node initiated
const PRIVATE_KEY = process.env.PRIVATE_KEY; // get the private of the default account to be use to execute contract defined on .env settingd
const contractAddress = process.env.CONTRACT_ADDRESS; // get the iotlogs.sol contract defined on .env settingd

 const provider = new ethers.providers.JsonRpcProvider();
 const signer = new ethers.Wallet(PRIVATE_KEY, provider);
 const {abi} = require("/-/Node_js_Api/api/blockchain-api/bin/contracts/iotlogs.json"); // set the location of he iotlogs contract
                                                                                                  //    deployed using Remix
 const contractInstance = new ethers.Contract(contractAddress, abi, signer); // Instance in executing iotlogs.sol contract
//-------------


var config = require('./dbconfig');
 const sql = require('mssql');
 const crypto  = require('crypto');
const { type } = require('os');
const { parse } = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

  function sha256Hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async function sendAttendanceEmails() {
    try {
        const sqlconnection = await sql.connect(config);

        // Execute stored procedure and fetch attendance records
        const attendanceData = await sqlconnection.query('EXEC AVV_SP_Email_Attendance');

        // Check if recordset exists before proceeding
        if (!attendanceData.recordset || attendanceData.recordset.length === 0) {
            console.log("No attendance records found for today.");
            return;
        }

        // Group data by instructor email + course description + section
        const groupedEmails = {};
        attendanceData.recordset.forEach(record => {
            const key = `${record.email}-${record.description}-${record.section}`;
            if (!groupedEmails[key]) {
                groupedEmails[key] = {
                    email: record.email,
                    description: record.description,
                    section: record.section,
                    room: record.room,
                    sched_time_from: record.sched_time_from,
                    sched_time_to: record.sched_time_to,
                    records: []
                };
            }
            groupedEmails[key].records.push(record);
        });

        // Format today's date as YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Helper to convert time to 12-hour format
        function formatTime(timeValue) {
            if (!timeValue) return 'Invalid Time';

            let timeStr;
            if (typeof timeValue === 'object' && timeValue.toISOString) {
                timeStr = timeValue.toISOString().split('T')[1].slice(0, 5);
            } else {
                timeStr = timeValue.toString().split('.')[0];
            }

            let [hours, minutes] = timeStr.split(':').map(Number);
            let period = hours >= 12 ? 'PM' : 'AM';
            hours = (hours % 12) || 12;

            return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
        }

        // Send email to each instructor
        for (const key in groupedEmails) {
            const group = groupedEmails[key];
            const { email, description, section, room, sched_time_from, sched_time_to, records } = group;

            const formattedFrom = formatTime(sched_time_from);
            const formattedTo = formatTime(sched_time_to);

            // Create attendance table rows
            const studentList = records.map(r => `
                <tr>
                    <td style="text-transform: uppercase; padding: 8px;">${r.studname}</td>
                    <td style="padding: 8px; text-align: center;">${r.Remarks}</td>
                </tr>`).join('');

            const emailContent = `
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                    <strong>Attendance for ${description} ${section} in ${room}, ${formattedFrom} to ${formattedTo} on ${today}:</strong><br><br>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr>
                            <th style="padding: 8px; text-align: left;">NAME</th>
                            <th style="padding: 8px; text-align: center;">STATUS</th>
                        </tr>
                        ${studentList}
                    </table>
                    <br>
                    Thank you.
                </div>
            `;

            await transporter.sendMail({
                from: `"Attendance System" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `Attendance List for ${description} ${section} - ${today}`,
                html: emailContent
            });

            console.log(`Email sent to ${email} for course ${description} ${section}`);
        }

    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
}

 async function getIotLogs(){
    try{
        let sqlconnection = await sql.connect(config);
        let iotlogs = await sqlconnection.request()
            //.query("Select * from DeviceLogs");
            .execute("AVV_SP_DashboardIotLogs");
        return iotlogs.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }


 async function getIotLogs_current(instructorcode){
    try{
        let sqlconnection = await sql.connect(config);
        let iotlogs = await sqlconnection.request()
            .input('instructorcode', sql.VarChar, instructorcode)
            .execute("AVV_SP_DashboardIotLogs_Current");
        return iotlogs.recordsets; 
    }
    catch (error){
        //console.log(error)
        return(error)
    }
 }


 // single parameters
 async function getIotLogs_rfid(rfid){
    try{
        let sqlconnection = await sql.connect(config);
        let iotlogs = await sqlconnection.request()
            .input('rfid', sql.VarChar, rfid)
            .query("Select top 1 * from DeviceLogs where rfid = @rfid order by timestamp desc");
        return iotlogs.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function getInstructor(email, password){
    try{
        let sqlconnection = await sql.connect(config);
        let instructor = await sqlconnection.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, sha256Hash(password))
            .query("Select  * from instructorrec where email = @email and password = @password");

        return instructor.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 } 
 
 // --------- instructor: subjects details
 async function getSubjects_Instructor(instructorcode){
    try{
        let sqlconnection = await sql.connect(config);
        let subjects = await sqlconnection.request()
            .input('instructorcode', sql.VarChar, instructorcode)
            .execute("AVV_SP_Subjects_Instructors");

        return subjects.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 } 

 async function getInstructorCode(){
    try{
        let sqlconnection = await sql.connect(config);
        let instructorcode = await sqlconnection.request()
            .query("SELECT 'INS-' + RIGHT('00' + CAST(CAST(RIGHT(instructorcode, LEN(instructorcode) - 4) AS INT) + 1 AS VARCHAR), 3) AS NewInstructorCode FROM instructorrec ORDER BY instructorcode DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;");

        return instructorcode.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function getSubjects_Instructor_Admin(){
    try{
        let sqlconnection = await sql.connect(config);
        let subjectsadmin = await sqlconnection.request()
            .execute("AVV_SP_Subjects_Instructors_Admin");

        return subjectsadmin.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 } 

//-------------

 async function getInstructor_nextclass(instructorcode, datestamp){
    try{
        let sqlconnection = await sql.connect(config);
        let instructor_class = await sqlconnection.request()
            .input('instructorcode', sql.VarChar, instructorcode)
            .input('datestamp', sql.VarChar, datestamp)
            .execute("AVV_SP_GetUpcomingClass");

       return instructor_class.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 // multiple parameters
  async function getIotLogs_rfid_classcode(rfid, classcode){
    try{
        let sqlconnection = await sql.connect(config);
        let iotlogs = await sqlconnection.request()
            .input('rfid', sql.VarChar(50), rfid)
            .input('classcode', sql.VarChar(50), classcode)
            .query("Select * from DeviceLogs where rfid = @rfid and classcode = @classcode");
        return iotlogs.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

//instructor: attendance logs
async function getAttendance_Instructor(instructorcode, subjectcode = null, studentname = null, datestamp = null){
    try{
        let sqlconnection = await sql.connect(config);
        let attendancelogs = await sqlconnection.request()
            .input('instructorcode', sql.VarChar, instructorcode)
            .input('subjectcode', sql.VarChar, subjectcode || null)
            .input('studentname', sql.VarChar, studentname || null)
            .input('datestamp', sql.VarChar, datestamp || null)
            .execute("AVV_SP_Attendance");
        return attendancelogs.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function getAttendance_Admin(subjectcode = null, studentname = null, datestamp = null){
    try{
        let sqlconnection = await sql.connect(config);
        let attendanceadmin = await sqlconnection.request()
            .input('subjectcode', sql.VarChar, subjectcode || null)
            .input('studentname', sql.VarChar, studentname || null)
            .input('datestamp', sql.VarChar, datestamp || null)
            .execute("AVV_SP_Attendance_Admin");
        return attendanceadmin.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function AddIotLogs(iotlogs) {
    try {
        // Step 1: Add to SQL Server
        let sqlconnection = await sql.connect(config);
        let addLogs = await sqlconnection.request()
            .input('deviceId', sql.VarChar, iotlogs.deviceid)
            .input('devicename', sql.VarChar, iotlogs.devicename)
            .input('deviceloc', sql.VarChar, iotlogs.deviceloc)
            .input('rfid', sql.VarChar, iotlogs.rfid)
            .input('classcode', sql.VarChar, iotlogs.classcode)
            .input('timestamp', sql.VarChar, iotlogs.timestamp)
            .input('transvalue', sql.VarChar, iotlogs.transvalue)
            .execute('AVV_SP_AddIotLogs');

        // Step 2: Trigger blockchain send (but don't wait for it)
        if (addLogs.returnValue === 1) {
            (async () => {
                try {
                    const jsonResult = JSON.stringify(addLogs.recordset);
                    const parsedResult = JSON.parse(jsonResult);

                    const transid = Math.abs(parsedResult.map(item => item.transId));
                    const deviceid = JSON.stringify(parsedResult.map(item => item.deviceId));
                    const devicename = JSON.stringify(parsedResult.map(item => item.deviceName));
                    const deviceloc = JSON.stringify(parsedResult.map(item => item.deviceLoc));
                    const rfid = JSON.stringify(parsedResult.map(item => item.rfid));
                    const classcode = JSON.stringify(parsedResult.map(item => item.classCode));
                    const timestamp = JSON.stringify(parsedResult.map(item => item.timeStamp));
                    const transvalue = JSON.stringify(parsedResult.map(item => item.transValue));

                    const tranx = await contractInstance.AddIotlog(transid, deviceid, devicename, deviceloc, rfid, classcode, timestamp, transvalue);
              
                } catch (blockchainError) {
                    console.error("Blockchain error:", blockchainError);
                }
            })();
        }

        // Optional: call getIotLogs_blkchain in background too
        setTimeout(() => getIotLogs_blkchain(), 1000);

        // Step 3: Return immediately after SQL insert
        return addLogs.returnValue;

    } catch (err) {
        console.error("AddIotLogs error:", err);
        throw err;  // allow calling code to handle it
    }
}


 async function getIotLogs_blkchain(){ // display/list blockchain iotlogs recorded - for checking only
     

    try{

     blkchain_iotlogs = await contractInstance.getAllIotlogs() // from blockchain

     //console.log(blkchain_iotlogs);
     //console.log(blkchain_iotlogs.length);

     if (blkchain_iotlogs.length > 0) {
        for (let i = 0; i < blkchain_iotlogs.length ; i++) {
            const obj = blkchain_iotlogs[i];  // The object is the last item in the array
            const transidFromObj = JSON.parse(obj.transid);
            const deviceidFromObj = JSON.parse(obj.deviceid);
            const devicenameFromObj = JSON.parse(obj.devicename);
            const devicelocFromObj = JSON.parse(obj.deviceloc);
            const rfidFromObj = JSON.parse(obj.rfid);
            const classcodeFromObj = JSON.parse(obj.classcode);
            const timestampFromObj = JSON.parse(obj.timestamp);
            const transvalueFromObj = JSON.parse(obj.transvalue);

            console.log(transidFromObj + ' ' + deviceidFromObj + ' ' + devicenameFromObj + ' ' + devicelocFromObj + ' ' + rfidFromObj + ' ' + classcodeFromObj + ' ' + timestampFromObj + ' ' + transvalueFromObj);
        }
     }

     console.log(blkchain_iotlogs.length)

    }
    catch (error){
        console.log(error)
    }
     
 }

 async function blkchain_to_sqlserver(){ // sync from blockchain to sql server
    
    // console.log(blkchain_iotlogs)
    var obj;  // The object is the last item in the array
    var transidFromObj;
    var deviceidFromObj;
    var devicenameFromObj;
    var devicelocFromObj;
    var rfidFromObj;
    var classcodeFromObj;
    var timestampFromObj;
    var transvalueFromObj;
    try {
        const currentTime = new Date();
        console.log("--- Syncing in progress (" + currentTime + ") ... --- ")
        blkchain_iotlogs = await contractInstance.getAllIotlogs() // from blockchain

        if (blkchain_iotlogs.length > 0) {
          for (let i = 0; i < blkchain_iotlogs.length ; i++) {
            obj = blkchain_iotlogs[i];  // The object is the last item in the array
            transidFromObj = JSON.parse(obj.transid);
            deviceidFromObj = JSON.parse(obj.deviceid);
            devicenameFromObj = JSON.parse(obj.devicename);
            devicelocFromObj = JSON.parse(obj.deviceloc);
            rfidFromObj = JSON.parse(obj.rfid);
            classcodeFromObj = JSON.parse(obj.classcode);
            timestampFromObj = JSON.parse(obj.timestamp);
            transvalueFromObj = JSON.parse(obj.transvalue);
            //console.log(deviceidFromObj + ' ' +  devicenameFromObj + ' ' +devicelocFromObj + ' ' + rfidFromObj );
           
           // check first if exists on sql server table -S-
            let sqlconnection = await sql.connect(config);
            let existingrec = await sqlconnection.request()
                .input('deviceId', sql.VarChar, deviceidFromObj)
                .input('devicename', sql.VarChar, devicenameFromObj)
                .input('deviceloc', sql.VarChar, devicelocFromObj)
                .input('rfid', sql.VarChar, rfidFromObj)
                .input('classcode', sql.VarChar, classcodeFromObj)
                .input('timestamp', sql.VarChar, timestampFromObj)
                .input('transvalue', sql.VarChar, transvalueFromObj)
                .query("Select * from DeviceLogs where deviceId = @deviceId and deviceloc = @deviceloc and rfid = @rfid and timestamp = @timestamp and transvalue = @transvalue");
                //console.log(existingrec.recordset)

           // check first if exists on sql server table -E-
               if(existingrec.recordset.length === 0){ // if record not found then append
                   // Append to Sql Server -S-
                   let sqlconnection = await sql.connect(config);
                   let addLogsSql = await sqlconnection.request()
                       .input('deviceId', sql.VarChar, deviceidFromObj)
                       .input('devicename', sql.VarChar, devicenameFromObj)
                       .input('deviceloc', sql.VarChar, devicelocFromObj)
                       .input('rfid', sql.VarChar, rfidFromObj)
                       .input('classcode', sql.VarChar, classcodeFromObj)
                       .input('timestamp', sql.VarChar, timestampFromObj)
                       .input('transvalue', sql.VarChar, transvalueFromObj)
                       .execute('AVV_SP_blkchain_to_sqlserver')
                   // Append to Sql Server -E-
               }

            }
        } 
        const currentTime1 = new Date();
        console.log("--- Syncing completed (" + currentTime1 + ") ... --- ");

        } 
        catch (error){
            console.log(error)
        }
}

 async function AddStudSubject(studsubjects){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
           .input('studsubjectcode', sql.VarChar, studsubjects.studsubjectcode)
            .input('studcode', sql.VarChar, studsubjects.studcode)
            .input('subjectcode', sql.VarChar, studsubjects.subjectcode)
            .execute('AVV_SP_Addstudent_subject')
        return addrec.recordsets; 
        
    }
    catch (error){
        console.log(error)
    }
 }

 async function Addstudentrec(studentrec){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
          .input('studcode', sql.VarChar, studentrec.studcode)
          .input('studfname', sql.VarChar, studentrec.studfname)
          .input('studlname', sql.VarChar, studentrec.studlname)
          .input('studmi', sql.VarChar, studentrec.studmi)
          .input('coursecode', sql.VarChar, studentrec.coursecode)
          .input('studnum', sql.VarChar, studentrec.studnum)
          .input('studrfid', sql.VarChar, studentrec.studrfid)
            .execute('AVV_SP_Addstudentrec')
        return addrec.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function Addinstructorrec(instructorrec){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
          .input('instructorcode', sql.VarChar, instructorrec.instructorcode)
          .input('instructor_fn', sql.VarChar, instructorrec.instructor_fn)
          .input('instructor_ln', sql.VarChar, instructorrec.instructor_ln)
          .input('instructor_mi', sql.VarChar, instructorrec.instructor_mi)
          .input('email', sql.VarChar, instructorrec.email)
          .input('password', sql.VarChar, sha256Hash(instructorrec.password))
            .execute('AVV_SP_Addinstructorec')
        return addrec.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function Addsubject_sched(subject_sched){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
         .input('schedcode', sql.VarChar, subject_sched.schedcode)
         .input('subjectcode', sql.VarChar, subject_sched.subjectcode)
         .input('description', sql.VarChar, subject_sched.description)
         .input('sched_days', sql.VarChar, subject_sched.sched_days)
         .input('sched_time_from', sql.Time, subject_sched.sched_time_from)
         .input('sched_time_to', sql.Time, subject_sched.sched_time_to)
         .input('section', sql.VarChar, subject_sched.section)
            .execute('AVV_SP_Addsubject_sched')
        return addrec.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }


 async function Addcourses(courses){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
         .input('coursecode', sql.VarChar, courses.coursecode)
         .input('description', sql.VarChar, courses.description)
            .execute('AVV_SP_AddCourses')
        return addrec.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function Addsubjects(subjects){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
         .input('subjectcode', sql.VarChar, subjects.subjectcode)
         .input('description', sql.VarChar, subjects.description)
         .input('section', sql.VarChar, subjects.section)
         .input('classcode', sql.VarChar, subjects.classcode)
         .execute('AVV_SP_Addsubjects')
        return addrec.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function Addsubjectinstructor(subject_instructor){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
            .input('subjectinstructorcode', sql.VarChar, subject_instructor.subjectinstructorcode)
            .input('subjectcode', sql.VarChar, subject_instructor.subjectcode)
            .input('instructorname', sql.VarChar, subject_instructor.instructorname)
            .execute('AVV_SP_Addsubject_instructor')
        return addrec.recordsets;  
    }
    catch (error){
        console.log(error)
    }
 }


//-------------------------
async function getStudents_class(instructorcode, subjectcode){
    try{
        let sqlconnection = await sql.connect(config);
        let students_class = await sqlconnection.request()
            .input('instructorcode', sql.VarChar, instructorcode)
            .input('subjectcode', sql.VarChar, subjectcode)
            .execute("AVV_SP_GetStudentsByClass");
        return students_class.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function getStudents_class_Admin(subjectcode){
    try{
        let sqlconnection = await sql.connect(config);
        let students_class = await sqlconnection.request()
            .input('subjectcode', sql.VarChar, subjectcode)
            .execute("AVV_SP_GetStudentsByClass_Admin");
        return students_class.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

async function getSubjects_Admin(){
    try{
        let sqlconnection = await sql.connect(config);
        let subjects = await sqlconnection.request()
            .query("Select T0.schedcode, T0.subjectcode, T0.description, T0.sched_days, T0.sched_time_from, T0.sched_time_to, T0.section, T0.classcode, T0.room from subject_sched T0");

        return subjects.recordsets; 
    }
    catch (error){
        console.log(error)
    }
}

async function getInstructors_Admin(){
    try{
        let sqlconnection = await sql.connect(config);
        let instructor = await sqlconnection.request()
            .query("Select T0.instructorcode, T0.instructor_fn, T0.instructor_ln, T0.instructor_mi, T0.email from instructorrec T0");

        return instructor.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 } 

 async function getInstructor_settings(instructorcode){
    try{
        let sqlconnection = await sql.connect(config);
        let instructor = await sqlconnection.request()
            .input('instructorcode', sql.VarChar, instructorcode)
            .query("Select T0.instructorcode, T0.instructor_fn, T0.instructor_ln, T0.instructor_mi, T0.email from instructorrec T0 where instructorcode = @instructorcode");

        return instructor.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 } 

async function getSubjectsDropdown_Admin(){
    try{
        let sqlconnection = await sql.connect(config);
        let subjects = await sqlconnection.request()
            .query("Select T0.subjectcode, T0.description, T0.section, T0.classcode  from subjects T0");

        return subjects.recordsets; 
    }
    catch (error){
        console.log(error)
    }
} 

async function getStudents_Admin(){
    try{
        let sqlconnection = await sql.connect(config);
        let students = await sqlconnection.request()
            .query("Select distinct T0.studcode, T0.studnum, T0.studlname, T0.studfname, T0.studmi, T0.coursecode, T0.studrfid from studentrec T0");

        return students.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 } 

 async function getCourses_Admin(){
    try{
        let sqlconnection = await sql.connect(config);
        let courses = await sqlconnection.request()
            .query("Select T0.coursecode, T0.description from courses T0");

        return courses.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 } 

 async function getStudsub_Admin(){
    try{
        let sqlconnection = await sql.connect(config);
        let studentsub = await sqlconnection.request()
            .query("Select T0.studsubjectcode, T0.studcode, T0.subjectcode from student_subject T0");

        return studentsub.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }
 
 async function getSubject_Instructor(){
    try{
        let sqlconnection = await sql.connect(config);
        let subjectsinst = await sqlconnection.request()
            .query("Select T0.subjectinstructorcode, T0.subjectcode, T0.instructorcode from subject_instructor T0");

        return subjectsinst.recordsets; 
    }
    catch (error){
        console.log(error)
    }
}

async function getClass_Schedules(){ // 3/23/25
    try{
        let sqlconnection = await sql.connect(config);
        let classsched = await sqlconnection.request()
            .execute("AVV_SP_GetClassSchedules");

        return classsched.recordsets; 
    }
    catch (error){
        console.log(error)
    }
}

//-------------------------

async function Updatestudentrec(studentrec){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
          .input('studcode', sql.VarChar, studentrec.studcode || null)
          .input('studfname', sql.VarChar, studentrec.studfname || null)
          .input('studlname', sql.VarChar, studentrec.studlname || null)
          .input('coursecode', sql.VarChar, studentrec.coursecode || null)
          .input('studnum', sql.VarChar, studentrec.studnum || null)
          .input('studrfid', sql.VarChar, studentrec.studrfid || null)
          .execute('AVV_SP_Updatestudentrec')
        return addrec.returnValue; 
    }
    catch (error){
        console.log(error)
    }
 }

async function Updateinstructorec(instructorrec){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
          .input('instructorcode', sql.VarChar, instructorrec.instructorcode)
          .input('instructor_fn', sql.VarChar, instructorrec.instructor_fn || null)
          .input('instructor_ln', sql.VarChar, instructorrec.instructor_ln || null)
          .input('instructor_mi', sql.VarChar, instructorrec.instructor_mi || null)
          .input('email', sql.VarChar, instructorrec.email || null)
          .input('password', sql.VarChar, sha256Hash(instructorrec.password) || null)
            .execute('AVV_SP_Updateinstructorec')
        return addrec.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function Updatesubjects(subjects){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
          .input('subjectcode', sql.VarChar, subjects.subjectcode || null)
          .input('description', sql.VarChar, subjects.description || null)
          .input('section', sql.VarChar, subjects.section || null)
          .input('classcode', sql.VarChar, subjects.classcode || null)
            .execute('AVV_SP_Updatesubjects')
        return addrec.returnValue; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function Updatestudent_subject(student_subject){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
          .input('studsubjectcode', sql.VarChar, student_subject.studsubjectcode)
          .input('studcode', sql.VarChar, student_subject.studcode || null)
          .input('subjectcode', sql.VarChar, student_subject.subjectcode || null)
            .execute('AVV_SP_Updatestudent_subject')
        return addrec.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

 async function Updatesubject_sched(subject_sched){
    try{
        let sqlconnection = await sql.connect(config);
        let addrec = await sqlconnection.request()
          .input('schedcode', sql.VarChar, subject_sched.schedcode || null)
          .input('subjectcode', sql.VarChar, subject_sched.subjectcode || null)
          .input('description', sql.VarChar, subject_sched.description || null)
          .input('sched_days', sql.VarChar, subject_sched.sched_days || null)
          .input('sched_time_from', sql.VarChar, subject_sched.sched_time_from || null)
          .input('sched_time_to', sql.VarChar, subject_sched.sched_time_to || null)
          .input('section', sql.VarChar, subject_sched.section || null)
          .input('classcode', sql.VarChar, subject_sched.classcode || null)
          .input('room', sql.VarChar, subject_sched.room || null)
            .execute('AVV_SP_Updatesubject_sched')
        return addrec.recordsets; 
    }
    catch (error){
        console.log(error)
    }
 }

//-------------------------

async function deleteMultiple_Records(classcode){ // 3/23/25
    try{
        let sqlconnection = await sql.connect(config);
        let records = await sqlconnection.request()
            .input('classcode', sql.VarChar, classcode || null)
                .execute("AVV_SP_DeleteMultipleRecords");

        return records.recordsets; 
    }
    catch (error){
        console.log(error)
    }
}

async function deleteSubjects(classcode){ // 3/24/25
    try{
        let sqlconnection = await sql.connect(config);
        let deletesub = await sqlconnection.request()
            .input('classcode', sql.VarChar, classcode || null)
                .execute("AVV_SP_DeleteSubject");

        return deletesub.recordsets; 
    }
    catch (error){
        console.log(error)
    }
}

async function deleteStudents(studnum){ // 3/24/25
    try{
        let sqlconnection = await sql.connect(config);
        let deletestud = await sqlconnection.request()
            .input('studnum', sql.VarChar, studnum || null)
                .execute("AVV_SP_DeleteStudent");

        return deletestud.recordsets; 
    }
    catch (error){
        console.log(error)
    }
}

async function deleteInstructor(instructorcode){ // 3/24/25
    try{
        let sqlconnection = await sql.connect(config);
        let deleteinst = await sqlconnection.request()
            .input('instructorcode', sql.VarChar, instructorcode || null)
                .execute("AVV_SP_DeleteInstructor");

        return deleteinst.recordsets; 
    }
    catch (error){
        console.log(error)
    }
}

async function deleteSchedule(schedcode){ // 3/24/25
    try{
        let sqlconnection = await sql.connect(config);
        let deletesched = await sqlconnection.request()
            .input('schedcode', sql.VarChar, schedcode || null)
                .execute("AVV_SP_DeleteSchedule");

        return deletesched.recordsets; 
    }
    catch (error){
        console.log(error)
    }
}

// papa rfid capture 05052025
async function getrfid(){
    try{
        let sqlconnection = await sql.connect(config);
        let rfid = await sqlconnection.request()
            .query("Select rfid from rfid ");

        return rfid.recordset; 
    }
    catch (error){
        console.log(error)
    }
 } 
 async function clearrfid(){
    try{
        let sqlconnection = await sql.connect(config);
        let rfid = await sqlconnection.request()
            .query("Truncate table rfid ");

        return rfid.recordset; 
    }
    catch (error){
        console.log(error)
    }
 }

 module.exports = {
    getIotLogs : getIotLogs,
    getIotLogs_rfid : getIotLogs_rfid,
    getIotLogs_rfid_classcode : getIotLogs_rfid_classcode,
    AddIotLogs : AddIotLogs,
    AddStudSubject : AddStudSubject,
    Addstudentrec : Addstudentrec,
    Addsubject_sched : Addsubject_sched,
    Addcourses : Addcourses,
    Addsubjects : Addsubjects,
    Addinstructorrec : Addinstructorrec,
    Addsubjectinstructor : Addsubjectinstructor,
    getIotLogs_current : getIotLogs_current,
    getIotLogs_blkchain : getIotLogs_blkchain,
    getInstructor : getInstructor,
    getInstructor_settings : getInstructor_settings,
    getInstructor_nextclass : getInstructor_nextclass,
    blkchain_to_sqlserver : blkchain_to_sqlserver,
    //sqlserver_to_blkchain : sqlserver_to_blkchain,
    //---
    getAttendance_Instructor : getAttendance_Instructor,
    getAttendance_Admin : getAttendance_Admin,
    getSubjects_Instructor : getSubjects_Instructor,
    getInstructorCode : getInstructorCode,
    getSubjects_Instructor_Admin : getSubjects_Instructor_Admin,
    getStudents_class : getStudents_class,
    getStudents_class_Admin : getStudents_class_Admin,
    getSubjects_Admin :  getSubjects_Admin,
    getInstructors_Admin : getInstructors_Admin,
    getSubjectsDropdown_Admin : getSubjectsDropdown_Admin,
    getStudents_Admin : getStudents_Admin,
    getCourses_Admin : getCourses_Admin,
    getStudsub_Admin : getStudsub_Admin,
    getSubject_Instructor : getSubject_Instructor,
    getClass_Schedules : getClass_Schedules,
    //---
    Updatestudentrec : Updatestudentrec,
    Updateinstructorec : Updateinstructorec,
    Updatesubjects : Updatesubjects,
    Updatestudent_subject : Updatestudent_subject,
    Updatesubject_sched : Updatesubject_sched,
    //---
    deleteMultiple_Records : deleteMultiple_Records,
    deleteSubjects : deleteSubjects,
    deleteStudents : deleteStudents,
    deleteInstructor : deleteInstructor,
    deleteSchedule : deleteSchedule,
    sendAttendanceEmails : sendAttendanceEmails,
    getrfid : getrfid,
    clearrfid : clearrfid
  
 }
