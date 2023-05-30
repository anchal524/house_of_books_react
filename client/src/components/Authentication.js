import React from 'react';
import Signup from "./Signup";
import Signin from "./Signin";
import '../styles/Authentication.scss';

const Authentication = () => {
    return (
        <div className="authentication-container">
            <Signin />
            <Signup />
        </div>
    )
}

export default Authentication;