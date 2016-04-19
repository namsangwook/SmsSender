var express         = require("express"),
    app             = express(),
    flash           = require("connect-flash"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds"),
    mongoose        = require("mongoose");

var indexRoutes = require("./routes/index"),
    mainRoutes  = require("./routes/main");

var url = process.env.DATABASEURL || "mongodb://localhost/sms_sender";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

//seedDB();

app.use("/", indexRoutes);
app.use("/main", mainRoutes);

var port = process.env.PORT || 3003;
app.listen(port, process.env.IP, function(){
  console.log("server started at http://localhost:" + port);
});
