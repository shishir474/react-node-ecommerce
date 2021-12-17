import React, { useState, useEffect } from "react"
import Layout from "./Layout"
import { getProducts } from "./apiCore"
import Card from "./Card"
import Search from "./Search"
import { useParams } from "react-router-dom";
import { read, listRelated } from "./apiCore"



const Product = () => {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const {productId} = useParams();

    const loadSingleProduct = productId => {
        read(productId).then(data => {
            if (data.error){
                setError(data.error);
            }
            else{
                setProduct(data.product);

                listRelated(data.product._id).then(data => {
                    if (data.error){
                        setError(data.error);
                    }
                    else{
                        setRelatedProducts(data.products)
                    }
                });

            }
        })
    }

    useEffect(()=>{
        loadSingleProduct(productId)
    }, [productId]);


    return (
        <Layout 
            title={product && product.name} 
            description={product && product.description && product.description.substring(0,100)}  
            className="container-fluid"
        >
         
           <div className="row ">
               <div className="col-8">
                    {product && product.description && <Card product={product} showViewProductButton={false} />}
               </div>

               <div className="col-4">
                   <h2> Related Products </h2>
                    {relatedProducts && relatedProducts.map((p,i) => {
                       return(
                            <div className="mb-3">
                                <Card key={i} product={p}/>
                            </div>
                        )
                    })}
               </div>
               
           </div>
           
        </Layout>
    )
}

export default Product;