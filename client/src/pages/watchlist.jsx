import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Cards from "../components/card/card";
import { Link } from "react-router-dom";



const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        // Retrieve the user ID from sessionStorage
        const userid = sessionStorage.getItem('userId');

        // Make an Axios GET request to fetch the watchlist for the specific user
        axios.get(`http://localhost:8800/watchlistres/${userid}`)
            .then(response => {
                // Set the watchlist state with the data received from the backend
                setWatchlist(response.data);
            })
            .catch(error => {
                console.error("Error fetching watchlist:", error);
            });
    }, []); // Empty dependency array ensures the effect runs once when the component mounts

    return (
        <div className="movie__list">
            <h2 className="list__title">Watchlist</h2>
            <div className="list__cards">
                {watchlist.map((movie) => (
                    <Cards key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default Watchlist;



