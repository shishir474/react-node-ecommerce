import React, { useState, useEffect } from "react"
import Layout from "./Layout"
import { getProducts, getBraintreeClientToken, processPayment } from "./apiCore"
import Card from "./Card"
import Search from "./Search"
import { isAuthenticated } from "../auth"
import { Link } from "react-router-dom"
import DropIn from 'braintree-web-drop-in-react'

const Checkout = ({products}) => {

    const [data, setData] = useState({
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
    
    const buy = () => {
        // send the nonce to your server
        // nonce = data.instance.requestPaymentMethod()
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

            processPayment(userId, token, paymentData).then(response => {
                setData({...data, success: response.success})
                // empty order
                // create order: post req to backend to create order 
            })
            .catch(err => console.log(err))
            
        })
        .catch(error => {
            //console.log('Drop-in error: ', error);
            setData({...data, error: error.message})
        })
    }

    const showError = error => {
       return <div className="alert alert-danger" style={{display: error ? '' : 'none'}}> 
            {error}
        </div>
    }

    const showSuccess = success => {
        return <div className="alert alert-info" style={{display: success ? '' : 'none'}}> 
             Thanks! Your payment was successfull.
         </div>
     }

    const showDropIn = () => (
        <div onBlur={() => setData({...data, error:''})}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <DropIn options={{
                        authorization: data.clientToken
                    }} onInstance={instance => (data.instance = instance)} />

                    <button className="btn btn-success btn-block" onClick={buy}> Pay </button>

                </div>
            ) : null}
        </div>  
    )

   return (
       <div>
           <h2> Total: ${getTotal()} </h2>
           {showError(data.error)}
           {showSuccess(data.success)}
           {showCheckout()}
       </div>
   )
}

export default Checkout;