module.exports = function(app, passport){
	// Homepage
	app.get('/', function(req, res){
		res.render('index.ejs');
	});
	// Show login form
	app.get('/login', function(req, res){
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});
	// Process login form
	// Signup
	app.get('/signup', function(req, res){
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	})
	// Process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));
	// Profile section
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {user: req.user});
	});
	// Logout
	app.get('/logout', function(req, res){
		req.logout();
		req.redirect('/');
	});
};

// route middleware to make sure user is logged in
function isLoggedIn(req, res, next){
	// is authenticated?
	if (req.isAuthenticated())
		return next();
	// else redirect
	res.redirect('/');
}