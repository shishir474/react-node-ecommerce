import React, { useState, useEffect } from "react"
import Layout from "./Layout"
import Card from "./Card"
import { getCart } from "./cartHelpers"
import { Link } from "react-router-dom"
import Checkout from "./Checkout"

const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(()=>{
        setItems(getCart());
    },[run]);

    const showItems = items => {
        return (
            <div>
                <h2> Your cart has {items.length} items</h2>
                <hr />
                {items && items.map((item,i) => (
                    <Card 
                        key={i} 
                        product={item} 
                        showAddToCartButton={false} 
                        cartUpdate={true} 
                        showRemoveProductButton={true} 
                        setRun = {setRun}
                        run = {run}
                    />
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
             title="Shopping cart" 
             description="Manage your cart items. Add remove checkout or continue shopping." 
             className="container-fluid"
        >
            <div className="row">
                <div className="col-6">
                    { items.length > 0 ? showItems(items) : noItemsMessage() }
                </div>

                <div className="col-6">
                    <h2> Your cart summary</h2>    
                    <hr />
                    <Checkout products={items} setRun = {setRun} run = {run} />
                </div>
            </div>
            
            
           
        </Layout>
    )
}

export default Cart;