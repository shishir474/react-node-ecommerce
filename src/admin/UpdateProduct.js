import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { getProduct, getCategories, updateProduct, getProducts } from "./apiAdmin";



const UpdateProduct = ({match}) => {
    
    const [values, setValues] = useState({
        name:'',
        description:'',
        price:'',
        categories:[],
        category:'',
        shipping:'',
        quantity:'',
        photo:'',
        loading:false,
        error:'',
        createdProduct:'',
        redirectToProfile:false,
        formData:''
    })

    const {user, token} = isAuthenticated();

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

    const init = (productId) => {
        getProduct(productId).then(data => {
            if (data.error){
                setValues({...values, error: data.error});
            }
            else{
                console.log(data);
                // populate the state
                setValues({...values, 
                    name: data.product.name, 
                    price: data.product.price,
                    shipping: data.product.shipping, 
                    category: data.product.category._id,
                    description: data.product.description, 
                    quantity: data.product.quantity,
                    formData: new FormData()
                });

                // load categories
                initCategories();
            }
        })
    }

    useEffect(()=>{
        init(match.params.productId);
    },[]);

    // so once the component mounts useEffect runs, it will populate categories and make the formData ready for us to use.
    const initCategories = () =>{
        getCategories().then(data => {
            if (data.error){
                setValues({...values, error: data.error})
            }
            else{
                setValues({categories: data.data, formData: new FormData() });
            }
        })
    }


    const handleChange = name => event =>{
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value });
    }

    const clickSubmit = (event) => {
        event.preventDefault();

        setValues({...values, error:'', loading: true})

        updateProduct(match.params.productId, user._id, token, formData)
        .then(data => {
            if(data.error){
                setValues({...values, error: data.error})
            } 
            else{
                setValues({
                    ...values, 
                    name:'',
                    description:'',
                    price:'',
                    quantity:'',
                    photo:'',
                    loading:false,  
                    error: false,
                    redirectToProfile: true,
                    createdProduct: data.name
                });
    
            }
        })
    }

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4> Post Photo </h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input 
                        type="file" 
                        name="photo" 
                        accept="image/*"
                        onChange={handleChange('photo')} 
                    />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted"> Name </label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={handleChange('name')} 
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label className="text-muted"> Description </label>
                <textarea
                    value={description} 
                    onChange={handleChange('description')} 
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label className="text-muted"> Price </label>
                <input 
                    type="number" 
                    value={price} 
                    onChange={handleChange('price')} 
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label className="text-muted"> Category </label>
                <select onChange={handleChange('category')}  className="form-control">
                    <option>Please select</option>
                        {categories && categories.map((c, i) => (
                                    <option key={i} value={c._id}>
                                        {c.name}
                                    </option>
                        ))}
            
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted"> Shipping </label>
                <select onChange={handleChange('shipping')}  className="form-control">
                    <option>Please select</option>
                    <option value="0"> No </option>
                    <option value="1"> Yes </option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted"> Quantity </label>
                <input 
                    type="number" 
                    value={quantity} 
                    onChange={handleChange('quantity')} 
                    className="form-control"
                />
            </div>

            <button className="btn btn-outline-primary"> Update Product </button>

        </form>
    )

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h2>{`${createdProduct}`} is updated!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    const redirectUser = (redirectToProfile, error) => {
        if (redirectToProfile){
            if (!error){
               return <Redirect to="/" />
            }
        }
    }

    return (
        <Layout 
            title="Add a new product" 
            description={`G'day ${user.name}! ready to add a new product?`} 
        >        
              <div className="row">
                <div className="col-md-8 offset-md-2"> 
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                    {redirectUser(redirectToProfile, error)}
                </div>
            </div>
           
        </Layout>
    )
}

export default UpdateProduct;