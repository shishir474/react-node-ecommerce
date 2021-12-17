import React from "react";
import { Link } from "react-router-dom"
import ShowImage from "./ShowImage" 
import moment from 'moment'

const Card = ({product, showViewProductButton = true}) => {

    const showViewButton = showViewProductButton => {
        return showViewProductButton && (
            <Link to = {`/product/${product._id}`} className="mr-2" >
                <button className="btn btn-outline-primary mt-2 mb-2"> View product</button>
            </Link>
           
        )
    }

    const showAddToCartButton = () => (
        <button className="btn btn-outline-warning mb-2 mt-2"> Add to cart</button>
    )

    const showStock = (quantity) => {
        return (quantity > 0) ? (
            <span className="badge badge-primary badge-pill"> In stock </span>
        ): (
            <span className="badge badge-primary badge-pill"> Out of stock</span>
        )   
    }

    

    return (
            <div className="card">
                <div className="card-header name"><strong style={{textTransform: 'capitalize'}}>{product.name}</strong></div>
                <div className="card-body">
                    <ShowImage item={product} url="product"/>
                    <p className="lead mt-2">
                        {product.description.substring(0,100)}
                    </p>
                    <p className="black-10">${product.price}</p>
                    <p className="black-9">
                        Category: {product.category && product.category.name}
                    </p>
                    <p className="black-8">
                        Added on {moment(product.createdAt).fromNow()}
                    </p>
    
                    {showStock(product.quantity)}
                    <br />

                    {showViewButton(showViewProductButton)}

                    {showAddToCartButton()}
    
                    
                </div>
            </div>
    )
}

export default Card;