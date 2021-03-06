const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const {userById, addOrderToUserHistory } = require('../controllers/user');
const {create, listOrders, getStatusValues, orderById, updateOrderStatus} = require('../controllers/order');
const {decreaseQuantity } = require('../controllers/product');

// create order
router.post('/order/create/:userId', requireSignin, isAuth, addOrderToUserHistory, decreaseQuantity,  create);

// list orders
router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);

// get all status values to pass to frontend client
router.get('/order/status-values/:userId', requireSignin, isAuth, isAdmin, getStatusValues);

// update order status
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);


router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;