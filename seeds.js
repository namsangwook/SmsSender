var mongoose = require("mongoose");
var Job = require("./models/job");
var Sms   = require("./models/sms");
//var Promise = require('bluebird');
//var JobSchema = new mongoose.Schema({
//  jobname: String,
//  description: String,
//  created:  {type: Date, default: Date.now},
//  author: {
//    id: {
//      type: mongoose.Schema.Types.ObjectId,
//      ref: "User"
//    },
//    username: String
//  },
//  smslist: [
//    {
//      type: mongoose.Schema.Types.ObjectId,
//      ref: "Sms"
//    }
//  ]
//});

var data = [
  {
    name: "alarm sms 1",
    description: "alarm sms for test 1"
  }
  //{
  //  name: "alarm sms 2",
  //  description: "alarm sms for test 2"
  //}
  //{
  //  jobname: "alarm sms 3",
  //  description: "alarm sms for test 3"
  //},
  //{
  //  jobname: "alarm sms 4",
  //  description: "alarm sms for test 4"
  //}
];

//var SmsSchema = mongoose.Schema({
//  name: String,
//  phonenumber: Sring,
//  status:  {type: Number, default: 0}, // 0: undefined, 1: success, -1:failed
//  job: {
//    id: {
//      type: mongoose.Schema.Types.ObjectId,
//      ref: "Job"
//    },
//    jobname: String
//  }
//});

var index = 0;
function createSms(job) {
  index++;
  return new Promise(function(resolve, reject){
    //var name =  "name for sms (" + index + ")";
    //console.log(name);
    Sms.create(
      {
        name: "name for sms (" + index + ")",
        phonenumber: "01023456789"
      }, function (err, sms) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          job.smslist.push(sms);
          job.save(function (err, job, numAffected) {
            if (err) {
              reject(err);
            }
            else {
              //console.log("Created new sms");
              resolve(job);
            }
          })
        }
      });
  });
}

function createSmsList(job, count) {
  var sequence = Promise.resolve();
  for(var i = 0; i < count; i++) {
    sequence = sequence
      .then(function() {
        return createSms(job);
      });
  }
  return sequence;
}

function seedDB(){
  //Remove all campgrounds
  Job.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("removed jobs!");
    Sms.remove({}, function(err){
      if (err) {
        console.log(err);
      }
      console.log("removed sms!");

      //add a few jobs
      data.forEach(function(seed){
        Job.create(seed, function (err, job) {
          if (err) {
            console.log(err)
          } else {
            console.log("added a job");
            //create a sms
            createSmsList(job, 100)
              .then(function() {
                console.log("create sms ended");
                Sms.find({}, function(err, allSms) {
                  if(err) {
                    console.log(err);
                  }
                  else {
                    console.log("sms count: " + allSms.length);
                  }
                });
              });
          }
        });
      });
    });


  });
}

module.exports = seedDB;
