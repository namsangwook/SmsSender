var XLSX = require('xlsx');
var Sms = require("../models/sms");
var fs = require('fs');

function validPhonenumber(phonenumber) {
  phonenumber = phonenumber.split('-').join('');
  //console.log(phonenumber);
  var regExp = /^0\d{2,3}\d{7,}/g;
  var isPhonenumber = regExp.test(phonenumber);
  //console.log(isPhonenumber);
  return isPhonenumber;
}

function createSms(job, user, name, phonenumber) {
  return new Promise(function (resolve, reject) {
    if (validPhonenumber(phonenumber)) {
      var status = 0;
    } else {
      var status = -2;
    }
    Sms.create(
      {
        name: name,
        phonenumber: phonenumber,
        status: status,
        author: {id: user.id, username: user.username},
        job: {id: job._id}
      }, function (err, sms) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          job.smslist.push(sms);
          resolve(job);
        }
      });
  });
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function (sheetName) {
    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result[sheetName] = roa;
    }
  });
  return result;
}

module.exports = {
  createSmsFromFile: function (job, user, filepath) {
    //console.log('filepath : ' + filepath);
    var workbook = XLSX.readFile(filepath);
    //console.log('workbook : ' + workbook.SheetNames);
    var first_sheet_name = workbook.SheetNames[0];
    var translate_data = to_json(workbook)[first_sheet_name];
    //console.log(translate_data);
    var sequence = Promise.resolve();
    translate_data.forEach(function (translate) {
      var name = translate['Name'];
      var phonenumber = translate['Phone'];
      sequence = sequence
        .then(function () {
          return createSms(job, user, name, phonenumber)
        });
    });

    return sequence
      .then(function () {
        return new Promise(function (resolve, reject) {
          job.save(function (err, job, numAffected) {
            if (err) {
              reject(err);
            }
            else {
              fs.unlinkSync(filepath);
              //console.log('delete file : ' + filepath);
              resolve(job);
            }
          });
        });
      });
  }
};
