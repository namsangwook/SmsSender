var express         = require("express"),
    flash           = require("connect-flash"),
    bodyParser      = require("body-parser"),
    cookieParser    = require("cookie-parser"),
    session         = require("express-session"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    busboy          = require("connect-busboy"),
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
app.use(busboy());
//app.use(busboy({
//  highWaterMark: 2 * 1024 * 1024,
//  limits: {
//    fileSize: 10 * 1024 * 1024
//  }
//}));

app.use(cookieParser("secret"));
app.use(session({
  secret: "session secret",
  //cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

//seedDB();

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use("/", indexRoutes);
app.use("/jobs", jobRoutes);
app.use("/jobs/:id/smslist", smsRoutes);

var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function(){
  console.log("server started at http://localhost:" + port);
});
