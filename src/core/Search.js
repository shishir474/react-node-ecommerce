import React, { useState, useEffect } from "react"
import { getCategories, getProducts, list } from "./apiCore"
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

    const searchSubmit = (e) => {
        e.preventDefault();
       // console.log(category, search);
       if (search){
            list({search: search || undefined, category: category }).then((res) => { 
                if (res.error){
                    console.log(res.error);
                }
                else{
                    console.log(res)
                    setData({...data, results: res, searched: true});
                    // console.log('results', results)
                }
            })
       }
   


    }
    
    const handleChange = name => e => {
        setData({...data, [name]: e.target.value, searched: false});
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleChange('category')}>
                            <option value="All"> All </option>
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

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0){
            return `Found ${results.length} products`;
        }
        if (searched && results.length == 0){
            return 'No products found'
        }
    }

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4"> 
                    {searchMessage(searched, results)}
                 </h2>

                <div className="row">
                    {results.map((product,i) => (
                        <div className="col-4 mb-3"> 
                            <Card key={i} product={product} />
                        </div> 
                    ))}
                </div>
            </div>
        
        )
    }

    return (
        // <h2> Search bar </h2>
        <div className="row">
            <div className="container mb-3">
                {searchForm()}
            </div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    )
}

export default Search;
