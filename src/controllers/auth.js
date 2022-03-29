const mongoose = require('mongoose');
const jwt= require('jsonwebtoken');

const User = mongoose.model('User');

const register = (req, res, next) => {
    const user = req.body;

    if(!user) {
        const error = new Error("User details not sent in request body");
        next(error);
        return;
    }

    User
        .create(user)
        .then(updatedUser => {
                const dataToSend = {
                    name: updatedUser.name,
                    email : updatedUser.email,
                    role : updatedUser.role
                };
                res.status(201).json(dataToSend);
        })
        .catch(error => {
            if(error.name === "ValidationError") {
                error.status = 400;
            } else {
                error.status = 500;
            }

            return next(error);
        });
};

const login = (req, res, next) => {
    //this has {email: String, password: String}
    const userCredentials = req.body;

    if(!userCredentials) {
        const error = new Error("Login Details not sent in request body");
        next(error);
        return;
    }

    if(!userCredentials.email || !userCredentials.password) {
        const error = new Error("Login Details not sent in request body");
        next(error);
        return;
    }

    User
        .findOne({email: userCredentials.email})
        .then(user => {
            if(!user) {
                const error = new Error("No matching credentials");
                error.status= 404;
                return next(error);
            }

            //check if password matches the hashed one in DB
            user.checkPassword( userCredentials.password, ( error, isMatch ) => {
                if( error ) {
                    const error = new Error( 'No matching credentials' );
                    error.status = 404;
                    return next( error );
                }

                if( !isMatch ) {
                    const error = new Error( 'No matching credentials' );
                    error.status = 404;
                    return next( error );
                }

                // generate the token
                const claims = {
                    name: user.name,
                    email: user.email,
                    role: user.role
                };

                // 'abcd' is the secret key - please store this in process.env.* where * is some environment variable like JWT_SECRET (say)
                jwt.sign( claims, 'abcd' /* process.env.JWT_SECRET */, { expiresIn: 24 * 60 * 60 }, ( err, token ) => {
                    if( err ) {
                        err.status = 500;
                        return next( err );
                    }

                    res.json({
                        email: user.email,
                        token: token,
                        role : user.role
                    });
                });
            });
        })
        .catch( err => {
            if( err.name === 'ValidationError' ) {
                err.status = 400;
            } else {
                err.status = 500;
            }

            return next( err );
        });
};

module.exports = {
    register,
    login
};