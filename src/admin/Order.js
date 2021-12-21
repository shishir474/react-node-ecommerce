import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { listOrders } from "./apiAdmin";

const Order = () => {
    const [orders, setOrders] = useState([]);
    
    const {user, token} = isAuthenticated();

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if (data.error){
                console.log(data.error);
            }
            else{
                console.log(data);
                setOrders(data)
            }
        })
    }

    useEffect(() => {
      loadOrders();
    }, [])

    const noOrders = (orders) => {
        return orders.length < 1 ? <h2> No Orders...</h2> : null;
    }

    return (
        <Layout 
            title="Orders" 
            description={`G'day ${user.name}! You can manage all the orders here`} 
        >        
              <div className="row">
                <div className="col-md-8 offset-md-2"> 
                    {noOrders(orders)}
                    {JSON.stringify(orders)}
                    
                </div>
            </div>
           
        </Layout>
    )

}

export default Order;