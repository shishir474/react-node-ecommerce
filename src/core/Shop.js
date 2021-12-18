import React, { useState, useEffect } from "react"
import Layout from "./Layout"
import Card from "./Card"
import { getCategories, getFilteredProducts } from "./apiCore"
import Checkbox from "./Checkbox"
import { prices } from "./fixedPrices"
import RadioBox from "./Radiobox"


const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters:{
            category: [],
            price: []
        }
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(6);
    const [filteredProducts, setFilteredProducts] = useState(0);
    const [size,setSize] = useState(0);


    // populate categories in sidebara
    const init = () =>{
        getCategories().then(data => {
            if (data.error){
                setError(data.error);
            }
            else{
                setCategories(data.data);
            }
        })
    }

    const loadFilteredProducts = newFilters => {
        //console.log('loadFilteredProducts', newFilters);
        getFilteredProducts(skip, limit, newFilters)
        .then(data => {
            if (data.error){
                setError(data.error);
            }
            else{
                setFilteredProducts(data.data);
                setSize(data.size);
                setSkip(0);
            }
        })
    }

    const loadMore = () => {
        let toSkip = skip + limit;
        getFilteredProducts(toSkip, limit, myFilters.filters)
        .then(data => {
            if (data.error){
                setError(data.error);
            }
            else{
                setFilteredProducts([...filteredProducts, ...data.data]);
                setSize(data.size);
                setSkip(toSkip);
            }
        })
    }
    
    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5 mt-3">Load More</button>
            )
        )
    }
    
    useEffect(()=>{
        init();
        loadFilteredProducts(myFilters.filters);
    },[]);

    const handleFilters =  (filters, filterBy) => {
        //console.log(filters, filterBy);
        const newFilters = {...myFilters}; // intialise newFilters obj with myFilters obj
        //console.log(newFilters.filters)
        
        newFilters.filters[filterBy] = filters;  // update the newFilters obj

        //  OR COULD DO IT THIS WAY

        // if (filterBy === 'c // update myFilters with newFiltersategory'){
        //    newFilters.filters.category = filters;
        // }else{
        //     newFilters.filters.price = filters;
        // }

        if(filterBy=="price"){
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }
        
        loadFilteredProducts(myFilters.filters);
        setMyFilters(newFilters);  // update myFilters with newFilters
    }

    const handlePrice = value => {
        let data = prices;
        let array = [];

        for(let key in data){
            if (data[key]._id == value){
                array = data[key].array;
            }
        }

        return array;
    }

   

    return (
        <Layout title="Shop Page" description="Search and find books of your choice" className="container-fluid">
            <div className="row">
                <div className="col-3"> 
                    <h3>Filter by categories</h3>
                    <ul>
                        <Checkbox categories={categories} handleFilters={filters => handleFilters(filters, "category")}/>
                    </ul>

                    <h3>Filter by price</h3>
                    <ul>
                        <RadioBox prices={prices} handleFilters={filters => handleFilters(filters, "price")}/>
                    </ul>
                </div>

                <div className="col-9">
                   <h2 className="mb-4"> Products </h2>
                   <div className="row">
                   {filteredProducts && filteredProducts.map((product, i)=>(
                        <div key={i} className="col-4 mb-3">
                            <Card product={product}/>
                        </div>
                    ))}
                      
                   </div>
                    <hr />
                   {loadMoreButton()}
                </div>
            </div>
       
        </Layout>
    )
}

export default Shop;