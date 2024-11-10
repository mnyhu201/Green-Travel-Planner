import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from '../firebaseConfig';
import './SignInPage.css'; // Import the CSS file

const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const [idToken, setIdToken] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("email: ", email);
        console.log("password: ", password);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in as:', userCredential.user.email);
            const idToken = await userCredential.user.getIdToken();
            console.log('ID Token:', idToken);
            setIdToken(idToken);
            navigate('/');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                alert('No account found with this email. Please check your email or sign up.');
            } else if (error.code === 'auth/wrong-password') {
                alert('Incorrect password. Please try again.');
            } else if (error.code === 'auth/invalid-credential') {
                alert('Invalid credentials. Please make sure your email and password are correct.');
            } else {
                console.error('Error logging in:', error.message);
            }
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                <h2 className="signin-title">Sign In</h2>
                <form onSubmit={handleSubmit} className="signin-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <button type="submit" className="signin-button">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
