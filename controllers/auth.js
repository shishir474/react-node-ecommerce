const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require('../helpers/dbErrorHandlers');

exports.signup = (req, res) => {

    const user = new User(req.body);
    user.save((err, user)=>{
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.status(201).json({
            user
        });
    });

}

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email },function(err,user){
        if(err) {
            return res.status(400).json({
                message:'error in finding the user' 
            })
        }

        if(user.authenticate(req.body.password)){
            // generate a signed token with user id and secret
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
            // persist the token as 't' inn cookie with expiry date 
            res.cookie("t", token, { expiresIn: '1h' });
            const { _id, name, email, role } = user;
            // return response with user and token to frontend client
            res.status(200).json({
                token,
                user: { _id, name, email, role}
            });
        }else{
            return res.status(400).json({
                error: 'Invalid email/Password'
            })
        }
    })

}

exports.signout = (req,res) => {
    res.clearCookie('t');
    return res.status(200).json({msg: 'signout success'});
}

// protected route, only for logged in user/ use this middleware to make a route protected
// Authorisation: Bearer Token must be passed in req headers
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

// middleware to check if the authenticated user is the current authenticated user
exports.isAuth = (req,res,next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if (!user){
        return res.status(403).json({
            error: 'Access Denied'
        });
    }

    next();
}

// middleware to check if the user is an admin
exports.isAdmin = (req,res,next)=>{
    if (req.profile.role === 0){
        return res.status(403).json({
            error: 'Admin Resource! Access Denied'
        });
    }

    next();
}