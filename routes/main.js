var express = require("express");
var router = express.Router();
var Job = require("../models/job");

router.get("/", function (req, res) {
  //req.flash("error", "test error");
  Job.find({}, function (err, allJobs) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.render("main/index", {jobs: allJobs});
    }
  });
});

router.get("/new", function(req, res){
  //req.flash("error", "test error");
  //res.redirect("/");
  res.render("main/new")
});

router.get("/:id", function(req, res){
  // find the job with provided id
  Job.findById(req.params.id).populate("smslist").exec(function(err, foundJob){
    if(err){
      req.flash("error", err.message);
      console.log(err);
    } else {
      console.log(foundJob)
      //render show template with that campground
      res.render("main/show", {job: foundJob});
    }
  });
});

module.exports = router;
