const { Order, CartItem } = require('../models/order');
const {errorHandler} = require('../helpers/dbErrorHandlers');

// create order
exports.create = (req, res) => {
  // console.log('req body', req.body);
    req.body.order.user =  req.profile;
    
    const order = new Order(req.body.order);
    order.save((error, data) => {
      if (error){
          return res.status(400).json({
            error: errorHandler(error)
          });
      }

      return res.status(201).json(data);

    })
}

// list all Orders
exports.listOrders = (req, res) => {
  Order.find()
      .populate('user', '_id name address')
      .sort('-createdAt')
      .exec((error, data) => {
            if (error){
              return res.status(400).json({
                error: errorHandler(error)
              });
          }

          return res.status(200).json(data);
  })

}

exports.getStatusValues = (req, res) => {
  return res.status(200).json(Order.schema.path('status').enumValues);
}