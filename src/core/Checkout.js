import React, { useState, useEffect } from "react"
import Layout from "./Layout"
import { getProducts, getBraintreeClientToken, processPayment, createOrder } from "./apiCore"
import Card from "./Card"
import Search from "./Search"
import { isAuthenticated } from "../auth"
import { Link } from "react-router-dom"
import DropIn from 'braintree-web-drop-in-react'
import { emptyCart } from "./cartHelpers"

const Checkout = ({products,setRun = f => f, run = undefined}) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    })

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error){
                setData({...data, error: data.error});
            }
            else{
                setData({clientToken: data.clientToken})
            }
        })
    }

    useEffect(()=>{
        getToken(userId, token)
    }, [])

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count*nextValue.price;
        }, 0)
    }

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div> {showDropIn()} </div>
         ) : (
          <Link to='/signin'>
               <button className="btn btn-primary mt-4"> Sign in to checkout </button>
          </Link>
         )
    }
    
    let deliveryAddress = data.address;

    const buy = () => {
        // send the nonce to your server
        // nonce = data.instance.requestPaymentMethod()
        setData({loading: true});
        let nonce;
        let getNonce = data.instance.requestPaymentMethod().then(data => {
                    // console.log(data);
                    nonce = data.nonce
                    // once u have nonce (card type, card no.) send nonce as 'paymentMethodNonce' and also total to be charged
                    // console.log('nonce and total amt: ', nonce, getTotal(products))
                    const paymentData = {
                        paymentMethodNonce: nonce,
                        amount: getTotal(products)
                    }

                    processPayment(userId, token, paymentData)
                    .then(response => {
                        console.log(response);
                        // empty cart
                        // create order

                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        };

                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                emptyCart(() => {
                                    setRun(!run); // run useEffect in parent Cart
                                    console.log('payment success and empty cart');
                                    setData({
                                        loading: false,
                                        success: true
                                    });
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                setData({ loading: false });
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        setData({ loading: false });
                    })
            }) 
            .catch(error => {
                // console.log("dropin error: ", error);
                setData({ ...data, error: error.message });
            });
        };


    const showError = error => (
       <div className="alert alert-danger" style={{display: error ? '' : 'none'}}> 
            {error}
        </div>
    )

    const showSuccess = success => (
        <div className="alert alert-info" style={{display: success ? '' : 'none'}}> 
             Thanks! Your payment was successful.
         </div>
     )

    const showLoading = loading => loading && <h2 className="alert alert-danger">Loading...</h2>

    const handleAddress = e => {
        setData({...data, address: e.target.value})
    }

    const showDropIn = () => (
        <div onBlur={() => setData({...data, error:''})}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <div className="form-group mb-3">
                        <label className="text-muted"> Delivery Address: </label>
                        <textarea 
                            onChange={handleAddress} 
                            className="form-control" 
                            value={data.address} 
                            placeholder="Type your delivery address here..."
                        />
                    </div>

                    <DropIn options={{
                        authorization: data.clientToken,
                        paypal:{
                            flow: "vault"
                        }
                    }} onInstance={instance => (data.instance = instance)} />

                    <button className="btn btn-success btn-block" onClick={buy}> Pay </button>

                </div>
            ) : null}
        </div>  
    )

   return (
       <div>
           <h2> Total: ${getTotal()} </h2>
           {showLoading(data.loading)}
           {showError(data.error)}
           {showSuccess(data.success)}
           {showCheckout()}
       </div>
   )
}

export default Checkout;