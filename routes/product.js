const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const {userById} = require('../controllers/user');
const {create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo} = require('../controllers/product');


// if there is a userId in route, userById middleware sets the user in req.profile
router.param("userId", userById);
router.param("productId", productById)  // similarly productById sets the product in req.product

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
// for deleting product user must have admin priviledge
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);

// get all products depending upon sell and latest arrivals
//  sell => '/products?sortBy=sold&order=desc&limit=3'
//  arrivel -> '/products?sortBy=createdAt&order=desc&limit=3'
router.get('/products', list);

// get related products
// It will find the products based on req product category.
// Other products that has the same category will be returned
router.get('/products/related/:productId', listRelated);

// get distinct product categories
router.get('/products/categories', listCategories);

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
router.post('/products/by/search', listBySearch);

//send product photo to client side
router.get('/product/photo/:productId', photo);


module.exports = router;