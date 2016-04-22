var Sms = require("../models/sms");
var Job = require("../models/job");

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    else {
      req.flash("error", "You must be signed in to do that");
      res.redirect("/login");
    }
  },
  checkUserJob: function (req, res, next) {
    if (req.isAuthenticated()) {
      Job.findById(req.params.id, function (err, job) {
        if (job.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("/jobs/");
        }
      });
    } else {
      req.flash("error", "You need to be signed in to do that!");
      res.redirect("/login");
    }
  },
  checkUserSms: function (req, res, next) {
    if (req.isAuthenticated()) {
      Sms.findById(req.params.smsId, function (err, sms) {
        if (sms.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("/jobs/" + req.params.id);
        }
      });
    } else {
      req.flash("error", "You need to be signed in to do that!");
      res.redirect("/login");
    }
  }
};
