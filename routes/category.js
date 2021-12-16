const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const {userById} = require('../controllers/user');
const {create, categoryById, read, update, remove, list} = require('../controllers/category');


// if there is a userId in route, userById sets the user in req.profile
router.param("userId", userById);
router.param("categoryId", categoryById);

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/category/:categoryId', read);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/categories', list); // get all categories


module.exports = router;