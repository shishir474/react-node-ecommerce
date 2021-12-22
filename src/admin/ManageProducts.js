import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { getProducts, deleteProduct } from "./apiAdmin";


const ManageProducts = () => {

    const [products, setProducts] = useState([]);
    const {user, token} = isAuthenticated();

    const loadProducts = () => {
        getProducts().then(data => {
            if (data.error){
                console.log(data.error);
            }else{
                setProducts(data.products);
            }
        })
    }

    useEffect(()=>{
        loadProducts();
    }, []);

    const destroy = productId =>  {
        deleteProduct(productId, user._id, token).then(data => {
            if (data.error){
                console.log(data.error);
            }else{
                loadProducts();
            }
        })
    }

    return (
        <Layout title="Manage Products" description="Perform CRUD on products" className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <ul className="list-group">
                      {products.map((p,i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                <strong>{p.name}</strong>
                                <Link to={`/admin/product/update/${p._id}`} >
                                    <span className="badge badge-warning badge-pill">
                                        Update
                                    </span>
                                </Link>
                                <button className="d-inline">
                                    <span onClick={() => destroy(p._id)} className="badge badge-danger badge-pill">
                                            Delete
                                    </span>
                                </button>
                          
                            </li>
                      ))}
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default ManageProducts
