var express = require("express");
var router = express.Router();
var Job = require("../models/job");
var middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function (req, res) {
  //req.flash("error", "test error");
  Job.find({}, function (err, allJobs) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.render("job/index", {jobs: allJobs});
    }
  });
});

router.get("/new", middleware.isLoggedIn,  function(req, res){
  //req.flash("error", "test error");
  //res.redirect("/");
  res.render("job/new")
});

router.get("/:id", middleware.isLoggedIn,  function(req, res){
  // find the job with provided id
  Job.findById(req.params.id).populate("smslist").exec(function(err, foundJob){
    if(err){
      req.flash("error", err.message);
      console.log(err);
    } else {
      console.log(foundJob)
      //render show template with that campground
      res.render("job/show", {job: foundJob});
    }
  });
});

module.exports = router;
