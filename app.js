var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.render("landing");
});



var port = process.env.PORT || 3003;
app.listen(port, process.env.IP, function(){
  console.log("server started at http://localhost:" + port);
});
