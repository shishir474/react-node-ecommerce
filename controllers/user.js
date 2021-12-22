const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandlers');

exports.userById = (req,res,next,id) => {
  User.findById(id).exec((err, user)=>{
      if (err || !user){
          return res.status(400).json({
              error: 'User not found'
          });
      }
      req.profile = user;
      next();
  })
}

exports.read = (req,res)=>{
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.status(200).json(req.profile);
}

exports.update = (req,res)=>{
    User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true})
        .exec((err,user)=>{
            if (err){
                return res.status(400).json({
                    error: 'You are not authorized to perform this action'
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.status(200).json(user);
        })
}

exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            quantity: item.count,
            category: item.category,
            description: item.description,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        })
    });

    User.findOneAndUpdate({_id: req.profile._id}, {$push : {history: history}}, {new: true}, (err, data) => {
        if (err){
            return res.status(400).json({
                error: 'Could not update user purchase history'
            });
        }
        //console.log(data);
        next();
    } )
    
}

exports.purchaseHistory = (req, res) => {
    Order.find({user: req.profile._id})
    .populate('user', '_id name')
    .sort('-createdAt')
    .exec((error, orders) => {
        if (error){
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        return res.status(200).json(orders)
    })
}

