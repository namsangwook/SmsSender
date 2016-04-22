var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Job = require("../models/job");
var Sms = require("../models/sms");
var middleware = require("../middleware");

//router.get("/", middleware.isLoggedIn, function (req, res) {
//  //req.flash("error", "test error");
//  Job.find({'author.id': mongoose.Types.ObjectId(req.user._id)}, function (err, allJobs) {
//    if (err) {
//      console.log(err);
//      req.flash("error", err.message);
//      res.redirect("back");
//    } else {
//      res.render("job/index", {jobs: allJobs});
//    }
//  });
//});

router.get("/", middleware.isLoggedIn, function (req, res) {
  //req.flash("error", "test error");
  var itemPerPage = 10;
  var currentPage = 1;
  Job.find({'author.id': mongoose.Types.ObjectId(req.user._id)})
    //.skip(itemPerPage * (currentPage - 1))
    //.limit(itemPerPage)
    .exec(function (err, allJobs) {
      if (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        var total = allJobs.length;
        var start = itemPerPage * (currentPage - 1);
        var end = start + itemPerPage;
        var subList = allJobs.slice(start, end);
        res.render("job/index", {jobs: subList, totalJobCount:total, itemPerPage: itemPerPage, currentPage: currentPage});
      }
    });
});

router.get("/page/:page", middleware.isLoggedIn, function (req, res) {
  //req.flash("error", "test error");
  var itemPerPage = 10;
  var currentPage = req.params.page;
  Job.find({'author.id': mongoose.Types.ObjectId(req.user._id)})
    //.skip(itemPerPage * (currentPage - 1))
    //.limit(itemPerPage)
    .exec(function (err, allJobs) {
      if (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        var total = allJobs.length;
        var start = itemPerPage * (currentPage - 1);
        var end = start + itemPerPage;
        var subList = allJobs.slice(start, end);
        res.render("job/index", {jobs: subList, totalJobCount:total, itemPerPage: itemPerPage, currentPage: currentPage});
      }
    });
});

router.get("/new", middleware.isLoggedIn,  function(req, res){
  //req.flash("error", "test error");
  //res.redirect("/");
  res.render("job/new")
});

router.get("/:id", middleware.checkUserJob, function(req, res){
  // find the job with provided id
  Job.findById(req.params.id).populate("smslist").exec(function(err, foundJob){
    if(err){
      req.flash("error", err.message);
      console.log(err);
      res.redirect("/jobs");
    } else {
      //console.log(foundJob)
      //render show template with that campground
      res.render("job/show", {job: foundJob, itemPerPage:10, currentPage: 1});
    }
  });
});

router.get("/:id/page/:page", middleware.checkUserJob, function(req, res){
  // find the job with provided id
  Job.findById(req.params.id).populate("smslist").exec(function(err, foundJob){
    if(err){
      req.flash("error", err.message);
      console.log(err);
      res.redirect("/jobs");
    } else {
      //console.log(foundJob)
      //render show template with that campground
      res.render("job/show", {job: foundJob, itemPerPage:10, currentPage: req.params.page});
    }
  });
});

router.delete("/:id", middleware.checkUserJob, function(req, res){
  Job.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    } else {
      Sms.find({'job.id': mongoose.Types.ObjectId(req.params.id)}).remove(function(err){
        if(err) {
          console.log(err);
        }
        else {
          res.redirect("/jobs");
        }
      });
    }
  })
});

module.exports = router;
