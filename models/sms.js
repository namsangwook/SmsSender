var mongoose = require("mongoose");

var SmsSchema = mongoose.Schema({
  name: String,
  phonenumber: String,
  status:  {type: Number, default: 0}, // 0: undefined, 1: success, -1:failed
  job: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    },
    jobname: String
  }
});

module.exports = mongoose.model("Sms", SmsSchema);