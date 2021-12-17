import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout } from "../auth";
import { isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";


const isActive = (history, path) => {
    if (history.location.pathname === path){
        return { color: '#ff9900' };
    }
    else{
        return { color: '#ffffff' };
    }
}

const Menu = ({history}) => {
    return (
        <div>
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-link">
                    <Link 
                        to="/" 
                        className="nav-link" 
                        style={isActive(history,'/')}
                    >
                          Home 
                    </Link>
                </li>

                <li className="nav-link">
                    <Link 
                        to="/shop" 
                        className="nav-link" 
                        style={isActive(history,'/shop')}
                    >
                          Shop 
                    </Link>
                </li>

                <li className="nav-link">
                    <Link 
                        to="/cart" 
                        className="nav-link" 
                        style={isActive(history,'/cart')}
                    >
                          Cart <sup><small className="cart-badge">{itemTotal()}</small></sup>
                    </Link>
                </li>

                {isAuthenticated() && isAuthenticated().user.role === 0 && (
                    <li className="nav-link">
                        <Link 
                            to="/user/dashboard" 
                            className="nav-link" 
                            style={isActive(history,'/user/dashboard')}
                        >
                            Dashboard
                        </Link>
                    </li>
                )}

                {isAuthenticated() && isAuthenticated().user.role === 1 && (
                    <li className="nav-link">
                        <Link 
                            to="/admin/dashboard" 
                            className="nav-link" 
                            style={isActive(history,'/admin/dashboard')}
                        >
                            Dashboard
                        </Link>
                    </li>
                )}

               {!isAuthenticated() && (
                   <Fragment>
                        <li className="nav-link">
                            <Link 
                                to="/signin" 
                                className="nav-link" 
                                style={isActive(history,'/signin')}
                            > 
                                Signin
                            </Link>
                        </li>

                        <li className="nav-link">
                            <Link 
                                to="/signup" 
                                className="nav-link" 
                                style={isActive(history,'/signup')}
                            > 
                                Signup
                            </Link>
                        </li> 
                   </Fragment>
               )}

                {isAuthenticated() && (
                     <li className="nav-link">
                        <span 
                            className="nav-link" 
                            style={{cursor: "pointer", color: '#ffffff'}}
                            onClick={()=> signout(()=>{
                                history.push('/')
                            })}
                        > 
                            Signout 
                        </span>
                     </li>
                )}
               
            </ul>
        </div>
    )
}

export default withRouter(Menu);



