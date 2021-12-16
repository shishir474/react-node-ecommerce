import React, { useState, useEffect } from "react"
import Layout from "./Layout"
import { getProducts } from "./apiCore"
import Card from "./Card"
import Search from "./Search"


const Home = () => {
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [productsBySell, setProductsBySell] = useState([]);
    const [error, setError] = useState(false);

    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if (data.error){
                setError(data.error);
            }
            else{
                setProductsByArrival(data.products)
                console.log('productsByArrival', productsByArrival)
            }
        })
    }

    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if (data.error){
                setError(data.error);
            }
            else{
                setProductsBySell(data.products)
                console.log(productsBySell)
            }
        })
    }

    useEffect(()=>{
        loadProductsByArrival();
        loadProductsBySell();
    }, [])
   
    return (
        <Layout title="Home Page" description="Node React E-commerce App" className="container-fluid">
            <Search />
            
            <h2 className="mb-4"> New Arrivals </h2>
            <div className="row mb-4">
                {productsByArrival && productsByArrival.map((product, i)=>{
                    return <Card key={i} product={product}/>
                })}
            </div>
   
            <h2 className="mb-4"> Best Sellers </h2>
            <div className="row">
                {productsBySell && productsBySell.map((product, i)=>{
                    return <Card key={i} product={product}/>
                })}
            </div>
          
           
        </Layout>
    )
}
  
export default Home;