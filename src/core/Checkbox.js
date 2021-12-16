import React, { useState, useEffect } from "react"


const Checkbox = ({categories, handleFilters}) => {
    const [checked, setChecked] = useState([]);

    const toggleChange = c => () => {
        // return the firstIndex or -1
        const currentCategoryId = checked.indexOf(c);
        
        // initilised newCheckedCategoryId with checked
        const newCheckedCategoryId = [...checked]

        // if currently checked was not already in checked state > push
        // else pull/take of
        if (currentCategoryId === -1){
            newCheckedCategoryId.push(c);
        }
        else{
            // from that point onwards remove 1 element
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }

       // console.log(newCheckedCategoryId);
        setChecked(newCheckedCategoryId);
        // passing newSetof category Id's to parent component 
        handleFilters(newCheckedCategoryId);
    }

    return (
        categories.map((c,i) => (
            <li key={i} className="list-unstyled">
                <input 
                    onChange={toggleChange(c._id)} 
                    value={checked.indexOf(c._id===-1)}
                    type="checkbox" 
                    className="form-check-input" 
                />

                <label className="form-check-label" style={{fontWeight: "600"}}>
                     {c.name} 
                </label>
            </li>
        ))
    )
}

export default Checkbox;