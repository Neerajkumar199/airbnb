module.exports.isLoggedIn =(req ,res ,next) =>{
       
         if(!req.isAuthenticated()){

            // redirectUrl  save
            req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must br logged in to create listing!");
       return  res.redirect("/login");

    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
};
