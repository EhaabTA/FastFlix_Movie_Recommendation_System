import React, { useState } from 'react';
import axios from "axios";
import './register.css'; // Make sure to import your CSS file
import { useNavigate } from 'react-router-dom';

function Register() {

    const [usernameReg, setUsernameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);
    const navigate = useNavigate();


    const reg = () => {
        axios.post('http://localhost:8800/register',
            { username: usernameReg, password: passwordReg })
            .then((response) => { console.log(response); });


        setSubmitted(true);

        setTimeout(() => {
            // Redirect to the home page
            navigate('/');
        }, 1000);
    };




    return (

        <div className='login-container'>
            <section>
                {[...Array(100)].map((_, index) => (
                    <span key={index}></span>
                ))}
                <div className="signin">
                    <div className="content">
                        <h2>Register</h2>
                        <div className="form">
                            <div className="inputBox">
                                <input type="text" required onChange={(e) => setUsernameReg(e.target.value)} />
                                <i>Username</i>
                            </div>
                            <div className="inputBox">
                                <input type="password" required onChange={(e) => setPasswordReg(e.target.value)} />
                                <i>Password</i>
                            </div>
                            <div className="inputBox">
                                <input type="submit" value={isSubmitted ? "Thank you! Redirecting" : "Submit"} onClick={reg}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;
