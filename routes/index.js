var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root Route
router.get("/", function (req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function (req, res) {
    res.render("register", { page: 'register' });
});

//show login form
router.get("/login", function (req, res) {
    res.render("login", { page: 'login' });
});

// Handle Signup Logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    if (req.body.adminCode == process.env.ADMINCODE) {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        })
    });
})

// Handling post logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) { });

// Logout Route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You've been logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;
