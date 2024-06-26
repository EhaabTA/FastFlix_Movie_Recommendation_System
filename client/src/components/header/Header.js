import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Make sure to import your CSS file

function Header() {
    const [MovieName, setMovieName] = useState('');
    const [username, setUsername] = useState('');
    const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user information from sessionStorage when the component mounts
        const storedUsername = sessionStorage.getItem('username');
        console.log("Header useEffect - storedUsername:", storedUsername);
        if (storedUsername) {
            setUsername(storedUsername);
            setDeleteAccountVisible(true); // Show delete account option if the user is logged in
        }
    }, []); // Empty dependency array ensures the effect runs once when the component mounts

    useEffect(() => {
        // Update the state when sessionStorage changes
        const handleStorageChange = () => {
            const storedUsername = sessionStorage.getItem('username');
            console.log("Header handleStorageChange - storedUsername:", storedUsername);
            if (storedUsername) {
                setUsername(storedUsername);
                setDeleteAccountVisible(true); // Show delete account option if the user is logged in
            }
        };

        // Listen for storage events
        window.addEventListener('storage', handleStorageChange);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const recres = () => {
        axios.post('http://localhost:8800/recresult', { MovieName: MovieName })
            .then((response) => {
                if (response.data.message) {
                    setMovieName(response.data.message);
                } else {
                    navigate(`/movie/${response.data[0].id}`);
                }
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            recres();
        }
    };

    const logout = () => {
        // Clear user data from sessionStorage
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('username');

        // Perform any other logout-related tasks (e.g., redirect to the login page)
        // ...

        // Optional: Update component state or perform additional cleanup
        setUsername('');
        setDeleteAccountVisible(false); // Hide delete account option after logout
        navigate('/');
    };

    const handleDeleteAccount = () => {
        const storedID = sessionStorage.getItem('userId');
        logout();
        axios.post('http://localhost:8800/deleteAccount', { userId: storedID })
            .then((response) => {
                // Check if the deletion was successful
                if (response.status === 200) {
                    console.log('Account deleted successfully');
                    // After deleting the account, perform logout logic
                    logout();
                } else {
                    console.error('Failed to delete account');
                }
            })
            .catch((error) => {
                console.error('Error deleting account:', error);
            });
    };

    return (
        <div className="header">
            <div className="headerLeft">
                <Link to="/">
                    <img className="header__icon" src="https://upload.wikimedia.org/wikipedia/en/e/e4/National_University_of_Computer_and_Emerging_Sciences_logo.png" alt="" />
                </Link>
                <Link to="/all" style={{ textDecoration: "none" }}><span>All Movies</span></Link>
                <Link to="/movies/top_rated" style={{ textDecoration: "none" }}><span>Top Rated</span></Link>
                <Link to="/recommend" style={{ textDecoration: "none" }}><span>Recommendations</span></Link>
                <Link to={`/watchlistres/${username}`} style={{ textDecoration: "none" }}><span>Watchlist</span></Link>
            </div>
            <div className="headerRight">
                <div className="inputBox" onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setMovieName(e.target.value)}>
                    <input type="text" />
                    <i>Search Movie</i>
                </div>

                {username ? (
                    // Display the username if available in sessionStorage
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '10px' }}>{username}</span>
                        {/* <Link to="/" onClick={logout} style={{ textDecoration: "none" }} id='test'><span>Logout</span></Link> */}
                        {deleteAccountVisible && (
                            <div className="dropdown">
                                <button className="dropbtn">Account</button>
                                <div className="dropdown-content">
                                    <Link to="/" onClick={logout}>Logout</Link>
                                    <Link to="/" onClick={handleDeleteAccount}>Delete Account</Link>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Render "Login" and "Register" links if username is not available
                    <>
                        <Link to="/login" style={{ textDecoration: "none" }}><span>Login</span></Link>
                        <Link to="/register" style={{ textDecoration: "none" }}><span>Register</span></Link>
                    </>
                )}

            </div>
        </div>
    );
}

export default Header;
