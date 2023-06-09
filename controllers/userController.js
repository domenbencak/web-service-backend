var UserModel = require('../models/userModel.js');
var CarRideController = require('../controllers/carRideController.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			email : req.body.email,
			password : req.body.password
        });

        user.save()
        .then(function (user) {
            return res.redirect('/user/login');
        })
        .catch(function (err) {
            return res.status(500).json({
                message: 'Error when creating user',
                error: err
            });
        });
    },

    createMobile: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			email : req.body.email,
			password : req.body.password
        });

        user.save()
        .then(function (user) {
            //return res.status(201).json(user);
            //return res.status(200);
            console.log("Registration successful");
            res.status(200).json({ message: 'Registration successful' });
            //return res.redirect('/user/login');
        })
        .catch(function (err) {
            return res.status(500).json({
                message: 'Error when creating user',
                error: err
            });
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    showRegister: function(req, res){
        res.render('user/register');
    },

    showLogin: function(req, res){
        res.render('user/login');
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password)
        .then(function(user) {
            // Authentication successful
            req.session.userId = user._id;
            req.session.username = user.username;
            res.redirect('/user/profile');
          })
          .catch(function(err) {
            // Authentication failed
            var err = new Error('Wrong username or password');
                err.status = 401;
                return next(err);
          });
    },

    loginMobile: function(req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password)
            .then(function(user) {
            // Authentication successful
            res.status(200).json({
                message: 'Login successful',
                user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                faceImagePath: user.faceImagePath,
                faceFeaturesPath: user.faceFeaturesPath,
                // Include other user data fields as needed
                },
            });
            })
            .catch(function(err) {
            // Authentication failed
            res.status(401).json({ message: 'Wrong username or password' });
            });
    },


    profile: function(req, res,next){
        //console.log(req.session.userId);
        UserModel.findById(req.session.userId)
        .exec()
        .then(function(user) {
        if (user === null) {
            var err = new Error('Not authorized, go back!');
            err.status = 400;
            return next(err);
        } else {
            CarRideController.findCarRidesByUserId(req, res)
                .then(function(carRides) {
                    res.render('user/profile', { user: user, carRides: carRides });
                })
                .catch(function(err) {
                    return next(err);
                })
            
            /*getQuestionsByUser(req.session.userId)
            .then(function(questions){
                return res.render('user/profile', { user: user, questions: questions });
            })
            .catch(function(err){
                return next(err);
            });*/
        }
        })
        .catch(function(error) {
        return next(error);
        });
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    return res.redirect('/');
                }
            });
        }
    }
};

