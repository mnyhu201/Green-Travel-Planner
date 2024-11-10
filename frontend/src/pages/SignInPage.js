import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from '../firebaseConfig';


const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const [idToken, setIdToken] = useState(null);  // State to store the Firebase ID token


    const handleSubmit = async (e) => {
        e.preventDefault();
        // handle submit tbd
        console.log("email: ", email);
        console.log("password: ", password);
        try {
            // Authenticate with Firebase using email and password
            // const userCredential = await firebase.signInWithEmailAndPassword(email, password);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in as:', userCredential.user.email);
      
            // After successful login, you can get the ID Token for backend verification
            const idToken = await userCredential.user.getIdToken();
            console.log('ID Token:', idToken);
      
            setIdToken(idToken);
            // Send ID Token to the backend (optional, if you want to protect server-side routes)
            // You can redirect or handle post-login actions here
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