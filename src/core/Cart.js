import React, { useState, useEffect } from "react"
import Layout from "./Layout"
import { getProducts } from "./apiCore"
import Card from "./Card"
import { getCart } from "./cartHelpers"
import { Link } from "react-router-dom"

const Cart = () => {
    const [items, setItems] = useState([]);

    useEffect(()=>{
        setItems(getCart());
    },[]);

    const showItems = items => {
        return (
            <div>
                <h2> Your cart has {items.length} items</h2>
                <hr />
                {items && items.map((item,i) => (
                    <Card key={i} product={item} showAddToCartButton={false} cartUpdate={true} />
                ))}
            </div>
        )      
    }

    const noItemsMessage = () => (
        <h2>
            Your cart is empty.
            <br/> 
            <Link to='/shop'> Continue shopping </Link> 
        </h2>
    )
    

    return (
        <Layout
             title="Your cart" 
             description="Node React E-commerce App" 
             className="container-fluid"
        >
            <div className="row">
                <div className="col-6">
                    { items.length > 0 ? showItems(items) : noItemsMessage() }
                </div>

                <div className="col-6">
                   <p>Show Checkout options/shipping address/total/update quantity</p>
                </div>
            </div>
            
            
           
        </Layout>
    )
}

export default Cart;