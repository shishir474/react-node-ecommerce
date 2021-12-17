import React, { useState } from "react"

const RadioBox = ({prices, handleFilters}) => {
    const [value, setValues] = useState(0);

    const handleChange = (e) => {
        handleFilters(e.target.value)
        setValues(e.target.value);
    }

    return (
        prices.map((p,i) => (
            <div key={i}>
                <input 
                    onChange={handleChange} 
                    value={`${p._id}`}
                    name={p}
                    type="radio" 
                    className="form-check-input" 
                />

                <label className="form-check-label" style={{fontWeight: "600"}}>
                     {p.name} 
                </label>
            </div>
        ))
    )
}

export default RadioBox;