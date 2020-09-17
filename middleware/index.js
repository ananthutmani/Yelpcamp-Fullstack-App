// ALL MIDDLEWARE GOES HERE
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }
            else {
                if (foundCampground.author.id.equals(req.user._id)||(req.user.isAdmin)) {
                    next();
                }
                else {
                    req.flash("error", "Permission Denied.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Log In first.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(req.user._id)||(req.user.isAdmin)) {
                    next();
                }
                else {
                    req.flash("error", "Permission Denied.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Log In first.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Log In first.");
    res.redirect("/login");
}

module.exports = middlewareObj;