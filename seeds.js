var mongoose = require("mongoose");
var Job = require("./models/job");
var Sms   = require("./models/sms");

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
  },
  {
    name: "alarm sms 2",
    description: "alarm sms for test 2"
  }
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

function seedDB(){
  //Remove all campgrounds
  Job.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("removed jobs!");
    //add a few campgrounds
    data.forEach(function(seed){
      Job.create(seed, function (err, job) {
        if (err) {
          console.log(err)
        } else {
          console.log("added a job");
          //create a sms
          for(var i = 0; i < 100; i++) {
            Sms.create(
              {
                name: "name for sms (" + i + ")",
                phonenumber: "01023456789"
              }, function (err, sms) {
                if (err) {
                  console.log(err);
                } else {
                  job.smslist.push(sms);
                  job.save();
                  //console.log("Created new sms");
                }
              });
          }
        }
      });
    });
  });
}

module.exports = seedDB;
