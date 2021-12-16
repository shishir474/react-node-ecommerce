import React, { useState, useEffect } from "react"
import { getCategories, getProducts } from "./apiCore"
import Card from "./Card"

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category:'',
        search:'',
        searched: false,
        results:[]
    })

    const {categories, category, search, searched, results} = data;

    const loadCategories = () => {
        getCategories().then(data => {
            if(data.error){
                console.log(data.error);
            }
            else{
                setData({...data, categories: data.data});
            }
        })
    }

    useEffect(()=>{
        loadCategories();
    }, []);

    const searchSubmit = () => {

    }
    
    const handleChange = () => {

    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleChange('category')}>
                            <option value="All"> Pick category</option>
                            {categories.map((c,i) => (<option key={i} value={c._id}> {c.name} </option>) )}
                        </select>
                    </div>

                    <input 
                        type="search"
                        onChange={handleChange('search')} 
                        className="form-control" 
                        placeholder="Search by name"
                    />
                </div>
                <div className="btn input-group-append" style={{border: 'none'}}>
                    <button className="input-group-text"> Search </button>
                </div>

            </span>
    
        </form>
    );

    return (
        // <h2> Search bar </h2>
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
        </div>
    )
}

export default Search;
