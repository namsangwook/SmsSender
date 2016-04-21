var express   = require("express"),
    passport  = require("passport"),
    User      = require("../models/user"),
    router    = express.Router();

router.get("/", function(req, res){
  res.render("landing");
});

router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
      res.redirect("/jobs");
    });
  });

});

router.get("/login", function(req, res){
  //console.log("get login");
  res.render("login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/jobs",
    failureRedirect: "/login"
  }), function(req, res){
});

router.get("/logout", function(req, res){
  req.logout();
  req.flash("Logged You Out!");
  res.redirect("/");
});

module.exports = router;
