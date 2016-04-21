

module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    else {
      req.flash("error", "You must be signed in to do that");
      res.redirect("/login");
    }
  }
}
