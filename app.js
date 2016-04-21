var express         = require("express"),
    flash           = require("connect-flash"),
    bodyParser      = require("body-parser"),
    cookieParser    = require("cookie-parser"),
    session         = require("express-session"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds"),
    mongoose        = require("mongoose"),
    app             = express();


var indexRoutes   = require("./routes/index"),
    jobRoutes     = require("./routes/job"),
    smsRoutes = require("./routes/sms");

var url = process.env.DATABASEURL || "mongodb://localhost/sms_sender";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser("secret"));
app.use(session({
  secret: "secret",
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

seedDB();

// PASSPORT CONFIGURATION
//app.use(require("express-session")({
//  secret: "Once again Rusty wins cutest dog!",
//  resave: false,
//  saveUninitialized: false
//}));

app.use(flash());

app.use(function(req, res, next){
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use("/", indexRoutes);
app.use("/jobs", jobRoutes);
app.use("/jobs/:id/smslist", smsRoutes);

var port = process.env.PORT || 3003;
app.listen(port, process.env.IP, function(){
  console.log("server started at http://localhost:" + port);
});
