var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

// expose to app
module.exports = function(passport){
	// passport session setup
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});
	// process signup
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.email': email}, function(err, user){
				// if err return err
				if (err)
					return done (err);
				// check whether user exists
				if (user)
					return done(null, false, req.flash('signupMessage', 'That email is already taken'));
				else // if no user add new user
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					// save user
					newUser.save(function(err){
						if (err)
							throw err;
						return done(null, newUser);
					});
			});
		});
	}));
	// login
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		User.findOne({'local.email': email}, function(err, user){
			if (err)
				return done(err);
			if (!user)
				return done(null, false, req.flash('loginMessage', 'Email does not exist'));
			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Incorrect password'));
			return done(null, user);
		});
	}
	));
};

