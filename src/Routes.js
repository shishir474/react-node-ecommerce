import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Signin from "./user/Signin";
import Signup from "./user/Signup";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "./user/UserDashboard";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Shop from "./core/Shop";
import Product from "./core/Product";
import Cart from "./core/Cart";
import Order from "./admin/Order";
import Profile from "./user/Profile";

 
const Routes = () =>{
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/shop" exact component={Shop} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} />
                <Route path="/cart" exact component={Cart} />
                <PrivateRoute 
                    path="/user/dashboard" 
                    exact 
                    component={Dashboard}
                />
                <AdminRoute 
                    path="/admin/dashboard" 
                    exact 
                    component={AdminDashboard}
                />
                 <AdminRoute 
                    path="/create/category" 
                    exact 
                    component={AddCategory}
                />
                <AdminRoute 
                    path="/create/product" 
                    exact 
                    component={AddProduct}
                />

                <Route path="/product/:productId" exact component={Product} />
                
                <AdminRoute 
                    path="/admin/orders" 
                    exact 
                    component={Order}
                />

                <PrivateRoute 
                    path="/profile/:userId" 
                    exact 
                    component={Profile}
                />
            </Switch>
        
        </BrowserRouter>
    )
}

export default Routes;