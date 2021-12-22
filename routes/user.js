const express = require('express');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const router = express.Router();
const {userById, read, update, purchaseHistory } = require('../controllers/user');

// if there is a userId in route, userById sets the user in req.profile
router.param("userId", userById);

// not only the user should be authenticated user, he should be current authenticated user(jo banda logged in hai usi ki userId route me passed hai) and he should be admin as well then only the req will be succesfull
// not only that we need to be logged in, not only that we need to be curnpmrent authenticated user, we also need to be admin
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res)=>{
    return res.status(200).json({
        user: req.profile
    })
})

router.get('/user/:userId',requireSignin, isAuth, read);
router.put('/user/:userId',requireSignin, isAuth, update);

router.get('/orders/by/user/:userId',requireSignin, isAuth, purchaseHistory);

module.exports = router;