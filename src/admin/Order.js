import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    
    const {user, token} = isAuthenticated();

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if (data.error){
                console.log(data.error);
            }
            else{
                //console.log(data);
                setOrders(data)
            }
        })
    }

    
    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if (data.error){
                console.log(data.error);
            }
            else{
                //console.log(data);
                setStatusValues(data)
            }
        })
    }

    useEffect(() => {
      loadOrders();
      loadStatusValues();
    }, [])

    const showOrdersLength = () => {
        if (orders.length > 0){
            return (
                <h2 className="text-danger display-2"> Total Orders: {orders.length} </h2>
            )
        }
        else{
            return <h2 className="text-danger"> No Orders...</h2>
        }
      
    }

    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text"> {key} </div>
            </div>

            <input type="text" value={value} className="form-control" readOnly/>
        </div>
    )

    const handleStatusChange = (e, orderId) => {
        updateOrderStatus(user._id, token, orderId, e.target.value).then(data => {
            if (data.error){
                console.log('status update failed')
            }
            else{
                loadOrders();
            }
        })
    }

    const showStatus = (o) => (
        <div className="form-group">
            <h3 className="mark mb-4"> Status: {o.status}</h3>
            <select 
                className="form-control"    
                onChange={e => handleStatusChange(e, o._id)} 
            >
                <option> Update Status </option>
                {statusValues.map((status, index) => (
                    <option key={index} value={status}> {status} </option>)
                )}

            </select>
        </div>
    ) 

    return (
        <Layout 
            title="Orders" 
            description={`G'day ${user.name}! You can manage all the orders here`} 
        >        
              <div className="row">
                <div className="col-md-8 offset-md-2"> 
                    {showOrdersLength()}

                    {orders.map((order, oIndex) => {
                        return (
                            <div className="mt-5" key={oIndex} style={{borderBottom : '5px solid indigo'}}>
                                <h2 className="mb-5">
                                   <span className=" bg-primary"> Order Id: {order._id} </span> 
                                </h2>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {showStatus(order)}
                                    </li>
                                    <li className="list-group-item">
                                        Transaction Id: {order.transaction_id}
                                    </li>
                                    <li className="list-group-item">
                                        Amount: ${order.amount}
                                    </li>
                                    <li className="list-group-item">
                                        <span style={{textTransform: 'capitalize'}}> Ordered By: {order.user.name} </span>
                                    </li>
                                    <li className="list-group-item">
                                        Ordered on: {moment(order.createdAt).fromNow()}
                                    </li>
                                    <li className="list-group-item">
                                        Delivary Address: {order.address}
                                    </li>
                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                    Total products in the order: {order.products.length}
                                </h3>

                                {order.products.map((product, pIndex) => (
                                    <div className="mb-4" key={pIndex} style={{padding: '20px', border: '1px solid indigo'}}>
                                        {showInput('Product Name', product.name)}
                                        {showInput('Price', product.price)}
                                        {showInput('Count', product.count)}
                                        {showInput('Product Id', product._id)}
                                    </div>
                                ))}

                            </div>

                        )
                    })}

                   
                    
                </div>
            </div>
           
        </Layout>
    )

}

export default Order;