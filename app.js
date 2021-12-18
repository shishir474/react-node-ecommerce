const express = require('express');
const app = express();
const Port = process.env.PORT || 8000;
require("dotenv").config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);

// db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true
}).then(()=> console.log('Database connected'))

app.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
})