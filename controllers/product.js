const Product = require('../models/product');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const {errorHandler} = require('../helpers/dbErrorHandlers');

exports.productById = (req, res, next, id) => {
  Product.findById(id)
  .populate('category')
  .exec((err,product)=>{
      if (err){
        return res.status(400).json({
            error: 'product not found'
        });
      }
      req.product = product;
      next();
  })

}

exports.read = (req,res)=>{
    // for now not sending the photo as photos are very large. Later will create an efficient method to send photos
    req.product.photo = undefined;
    return res.status(200).json({product: req.product});
}

exports.remove = (req,res)=>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.status(200).json({
            message:'product deleted succesfully'
        })
    })
}


exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
      if (err){
          return res.status(400).json({
              error: 'Image could not be uploaded'
          });
      }
     
      const {name,description,price,quantity,shipping,category} = fields;
      if (!name || !description || !price || !quantity || !shipping || !category){
            return res.status(400).json({
                error: 'All fields are required'
            })
      }
      // create new product with all fields
      let product = new Product(fields);
    
      // if the req contains photos of the product add the photos
      if (files.photo){
          if (files.photo.size > 1000000){
              return res.status(400).json({
                  error: 'Image should be less than 1mb in size'
              })
          }
          product.photo.data = fs.readFileSync(files.photo.filepath);
          product.photo.contentType = files.photo.mimetype;
         
      }
  
      // save the product
      product.save((err, result)=>{
          if (err){
              return res.status(400).json({
                  error: errorHandler(err)
              })
          }

          return res.json(result);
      })
  })
}


exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let product = req.product;
        // updating product using extend method provided by lodash
        product = _.extend(product, fields);
      
        // if the req contains photos of the product add the photos
        if (files.photo){
            if (files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                })
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
           
        }
    
        // save the product
        product.save((err, result)=>{
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
  
            return res.json(result);
        })
    })
  }
  

exports.list = (req,res)=>{
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let order = req.query.order ? req.query.order : 'asc';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err,products)=>{
            if (err){
                return res.status(400).json({error: 'Products not found'})
            }
            res.status(200).json({products: products});
        })
}


exports.listRelated = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({_id: {$ne:req.product}, category: req.product.category})
        .limit(limit)
        .populate('category', '_id name')
        .exec((err,products)=>{
            if (err){
                return res.status(400).json({error: 'Products not found'})
            }
            res.status(200).json({products: products});
        })
}


exports.listCategories = (req,res)=>{
    Product.distinct('category', {}, (err, categories)=>{
        if (err){
            return res.status(400).json({error: 'Categories not found'})
        }
        res.status(200).json({categories: categories});
    })
}


exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo = (req,res,next)=>{
    if (req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        res.send(req.product.photo.data);
    }
}

exports.listSearch = (req, res)=>{
  // create query object to hold search value and category value
    const query = {};
// assign search value to query.name
    if (req.query.search){
        query.name = { $regex: req.query.search, $options: "i" } // uses the i option perform a case-insensitive match
// assign category value to query.cateogory
        if (req.query.category && req.query.category != 'All'){
            query.category = req.query.category
        }
    }

    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (err, products) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json(products);
    }).populate('category').select('-photo');
}

exports.decreaseQuantity = (req,res,next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
                updateOne : {
                    filter: {_id: item._id},
                    update: {$inc : {quantity: -item.count, sold: +item.count}}
                }
            };
    });

    Product.bulkWrite(bulkOps, {}, (err, data) => {
        if(err){
            return res.status(400).json({
                error: 'could not update product quantity'
            })
        }
       // console.log(data);
        next();
    })

   
}