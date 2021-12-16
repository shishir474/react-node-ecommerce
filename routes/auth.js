const express = require('express');
const router = express.Router();
const {signup, signin, signout} = require('../controllers/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators');


router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.get('/signout', signout)


module.exports = router;