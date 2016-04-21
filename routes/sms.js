var express = require("express");
var router = express.Router();
//var Job = require("../models/job");
var Sms = require("../models/sms");

router.get("/:smsId", function(req, res){
  // find sms with provided id
  Sms.findById(req.params.smsId, function(err, sms){
    if(err){
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.render("sms/show", {job_id: req.params.id, sms: sms});
    }
  });
});

module.exports = router;
