const Sequelize = require('sequelize');

var sequelize = new Sequelize('gvvjbcoz', 'gvvjbcoz', 'C1JQMLl1ZVpGB1ovSW5bTtkeMHroi-0S', {
    host: 'ruby.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});
 
 
// Define a "Student" model (http://docs.sequelizejs.com/variable/index.html#static-variable-DataTypes)
 
var Student = sequelize.define('Student', {
    studentID: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "studentID" as a primary key
        autoIncrement: true // automatically increment the value
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    // gender: Sequelize.STRING,
    isInternationalStudent: Sequelize.BOOLEAN,
    expectedCredential: Sequelize.STRING,
    status: Sequelize.STRING,
    registrationDate: Sequelize.STRING
});
 

// Define a "Image" model

var Image = sequelize.define('Image', {
    imageID: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    imageUrl: Sequelize.STRING,
    version: Sequelize.INTEGER,
    width: Sequelize.INTEGER,
    height: Sequelize.INTEGER,
    format: Sequelize.STRING,
    resourceType: Sequelize.STRING,
    uploadedAt: Sequelize.DATE,
    originalFileName: Sequelize.STRING,
    mimeType: Sequelize.STRING
});


// Define a "Program" model

var Program = sequelize.define('Program', {
    programCode: {
        type: Sequelize.STRING,
        primaryKey: true // use "programCode" as a primary key
    },
    programName: Sequelize.STRING
});


// set up association between Student & Program
Program.hasMany(Student, {foreignKey: 'program'});


module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then( () => {
            resolve();
        }).catch(()=>{
            reject("unable to sync the database"); return;
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise(function (resolve, reject) {
        Student.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("no results returned"); return; 
        });
    });
}

module.exports.getStudentsByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                status: status
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("no results returned"); //return;
        });
    });

};

module.exports.getStudentsByProgramCode = function (program) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                program: program
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("no results returned"); //return;
        });
    });

};

module.exports.getStudentsByExpectedCredential = function (credential) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                expectedCredential: credential
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("no results returned"); //return;
        });
    });
};
 
module.exports.getStudentById = function (id) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                studentID: id
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned"); return;
        });
    });

};

module.exports.addStudent = function (studentData) { 
    return new Promise(function (resolve, reject) { 
 
        studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false; 
 
        for (var prop in studentData) {
            if(studentData[prop] == '')
                studentData[prop] = null;
        }

        Student.create(studentData).then(() => {
            resolve();
        }).catch((err)=>{
            reject("unable to create student"); return;
        });
    });
}; 
 
module.exports.updateStudent = function (studentData) { 
    return new Promise(function (resolve, reject) {
 
        studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;
 
        for (var prop in studentData) {
            if (studentData[prop] == '')
                studentData[prop] = null;
        } 
 
        Student.update(studentData, {
            where: { studentID: studentData.studentID } 
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to update student"); return;
        });
    }); 
}; 
 
module.exports.deleteStudentById = function(id){
    return new Promise(function (resolve, reject) { 
        Student.destroy({
            where: {
                studentID: id
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("unable to delete student"); return;
        });
    });
}

module.exports.getInternationalStudents = function () {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                isInternationalStudent: true
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("no results returned"); //return;
        });
    }); 
};  
 
  
module.exports.getPrograms = function(){
    return new Promise(function (resolve, reject) {
        Program.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("no results returned"); return;
        });
    });
}
 
module.exports.addProgram = function (programData) {
    return new Promise(function (resolve, reject) { 
 
        for (var prop in programData) {
            if(programData[prop] == '')
                programData[prop] = null;
        } 
 
        Program.create(programData).then(() => {
            resolve();
        }).catch((e)=>{
            reject("unable to create program"); return;
        });
    });
};

module.exports.updateProgram = function (programData) {
    return new Promise(function (resolve, reject) {

        for (var prop in programData) {
            if (programData[prop] == '')
                programData[prop] = null;
        }

        Program.update(programData, {
            where: { programCode: programData.programCode } 
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to update program"); return;
        });
    });

};

module.exports.getProgramByCode = function (pcode) {
    return new Promise(function (resolve, reject) {
        Program.findAll({
            where: {
                programCode: pcode
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned"); return;
        });
    });
};

module.exports.deleteProgramByCode = function(pc){
    return new Promise(function (resolve, reject) {
        Program.destroy({
            where: {
                programCode: pc
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("unable to delete program"); return;
        });
    });
}


module.exports.addImage = function (imageData) {
    return new Promise(function (resolve, reject) {
        Image.create(imageData).then(() => {
            resolve();
        }).catch((e)=>{
            reject("unable to create image"); return;
        });
    });
};

module.exports.getImages = function(){
    return new Promise((resolve,reject)=>{
        Image.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("no results returned"); return;
        });
    });
}
