const Category = require('../models/category');
const {errorHandler} = require('../helpers/dbErrorHandlers');

exports.categoryById = (req,res,next,id)=>{
   Category.findById(id).exec((err,category)=>{
       if (err){
            return res.status(400).json({
                error: 'category not found'
            });
       }
       req.category = category;
       next();
   })

}

exports.read = (req,res)=>{
    return res.status(200).json({category: req.category});
}

exports.create = (req, res)=>{
    const category = new Category(req.body);
    category.save((err, data)=>{
        if (err){
            return res.status(200).json({
                error: errorHandler(err)
            })
        }
        return res.status(201).json({data});
    });
}

exports.update = (req,res)=>{
  const category = req.category;
  category.name = req.body.name;
  category.save((err, data)=>{
    if (err){
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
    return res.status(200).json({data});
});
}

exports.remove = (req,res)=>{
    const category = req.category;
    category.remove((err, deletedCategory)=>{
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.status(200).json({message: "Category deleted succesfully"});
    })
}

exports.list = (req,res)=>{
    Category.find().exec((err,data)=>{
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.status(200).json({data})
    })
}