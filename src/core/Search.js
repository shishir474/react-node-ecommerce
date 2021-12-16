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

    const searchForm = () => {
        <form onSubmit={searchSubmit}>
            <input 
                type="search"
                onChange={handleChange('search')} 
                className="form-control" 
                placeholder="Search by name"
            />
        </form>
    }

    return (
        // <h2> Search bar </h2>
        <div className="row">
            <div className="container">{searchForm()}</div>
        </div>
    )
}

export default Search;
