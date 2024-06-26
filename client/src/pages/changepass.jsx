import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './changepass.css';
function Changepass() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginstatus, setloginstatus] = useState("");
    const [CorrectDeets, setCorrectDeets] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user information from sessionStorage when the component mounts
        const storedUsername = sessionStorage.getItem('username');
        console.log("useefffect", storedUsername);
        if (storedUsername) {
            setUsername(storedUsername);
            setCorrectDeets(true);
        }
    }, []);

    const log = () => {
        axios.post('http://localhost:8800/login',
            { username: username, password: password })
            .then((response) => {

                if (response.data.message) {
                    setloginstatus(response.data.message);
                }
                else {
                    const id = response.data[0].id;
                    const name = response.data[0].username;
                    console.log(id, name);

                    sessionStorage.setItem('userId', id);
                    sessionStorage.setItem('username', name);

                    setCorrectDeets(true);
                    setTimeout(() => {
                        // Redirect to the home page
                        navigate('/');

                        // Reload the home page after a delay
                        setTimeout(() => {
                            window.location.reload();
                        });
                    }, 1000);




                }
            });
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            log();
        }
    };
    return (
        <div className='login-container'>
            <section>
                {[...Array(100)].map((_, index) => (
                    <span key={index}></span>
                ))}
                <div className="signin">
                    <div className="content">
                        <h2>Sign In</h2>
                        <div className="form">
                            <div className="inputBox">
                                <input type="text" required onChange={(e) => setUsername(e.target.value)} />
                                <i>Username</i>
                            </div>
                            <div className="inputBox">
                                <input type="password" required onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setPassword(e.target.value)} />
                                <i>Password</i>
                            </div>
                            <div className="links">
                                <a href="/register">Signup</a>
                                <a href="/changepass">Change Password</a>

                            </div>
                            <div className="inputBox">
                                <input type="submit" value={CorrectDeets ? "Welcome" : "Submit"} onClick={log} />
                            </div>
                            <h1>{loginstatus}</h1>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Changepass;
