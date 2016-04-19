var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
  res.render("main/index");
});

router.get("/new", function(req, res){
  res.render("main/new")
});

module.exports = router;
