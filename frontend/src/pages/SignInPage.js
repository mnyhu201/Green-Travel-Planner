import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // handle submit tbd
    };

    return (
        <div className="register-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={email} onChange={handleEmailChange}
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={password} onChange={handlePasswordChange}
                required
            />
            </div>

            <button type="submit">Sign In</button>
        </form>
        </div>
    );
};
  
export default SignInPage;